import { drizzle } from 'drizzle-orm/postgres-js';
import { eq, inArray } from 'drizzle-orm';
import postgres from 'postgres';
import * as schema from './schema';
import crypto from 'crypto';

const connectionString = process.env.DATABASE_URL || 'postgresql://faf_user:faf_password@localhost:5432/fair_and_fresh';

const globalForDrizzle = global as unknown as {
  postgresClient: postgres.Sql | undefined;
  seeded?: boolean;
};

if (!globalForDrizzle.postgresClient) {
  globalForDrizzle.postgresClient = postgres(connectionString, {
    prepare: false,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
}

export const db = drizzle(globalForDrizzle.postgresClient, { schema });
export const postgresClient = globalForDrizzle.postgresClient;

// Re-export utility functions
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export async function seedDatabase() {
  try {
    console.log('🌱 Checking database sync status...');

    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;

    // 1. Create the admin account ONLY if it does not already exist.
    //    Previously this block ran an upsert that reset the password on every
    //    deploy (so a password changed in the dashboard would be wiped by the
    //    next build). Existing credentials are now never overwritten — change
    //    the password via Dashboard -> Change Password instead.
    //    Forgotten password? Set ADMIN_FORCE_RESET_PASSWORD=1 alongside
    //    ADMIN_USERNAME/ADMIN_PASSWORD and redeploy once to reset it.
    const forceReset = process.env.ADMIN_FORCE_RESET_PASSWORD === '1';
    if (adminUser && adminPass) {
      const existingAdmin = await db
        .select({ id: schema.users.id })
        .from(schema.users)
        .where(eq(schema.users.id, 'usr-admin'))
        .limit(1);

      if (existingAdmin.length === 0 || forceReset) {
        const adminSalt = crypto.randomBytes(16).toString('hex');
        const adminPasswordHash = hashPassword(adminPass, adminSalt);

        await db
          .insert(schema.users)
          .values({
            id: 'usr-admin',
            username: adminUser,
            passwordHash: adminPasswordHash,
            salt: adminSalt,
            isStaff: true
          })
          .onConflictDoUpdate({
            target: schema.users.id,
            set: {
              username: adminUser,
              passwordHash: adminPasswordHash,
              salt: adminSalt
            }
          });

        console.log(forceReset
          ? '🔒 Admin credentials force-reset from environment variables.'
          : '🔒 Admin account created from environment variables.');
      } else {
        console.log('🔒 Admin account already exists — credentials left unchanged (use the dashboard to change the password).');
      }
    } else {
      console.warn('⚠️ ADMIN_USERNAME or ADMIN_PASSWORD environment variable is missing. Skipping admin credential sync.');
    }

    // 2. Upsert default site content (CMS editable fields) — always syncs labels & types so existing DB stays in sync
    console.log('📝 Syncing default site content...');
    const siteContentDefaults = [
      { id: 'sc-site-phone', key: 'site_phone', value: '0430 799 567', label: 'Phone Number', group: 'site_settings', type: 'text' },
      { id: 'sc-site-email', key: 'site_email', value: 'support@fairandfreshcleaning.com.au', label: 'Email Address', group: 'site_settings', type: 'text' },
      { id: 'sc-site-address', key: 'site_address', value: 'Brisbane and Surrounding Areas', label: 'Service Address', group: 'site_settings', type: 'text' },
      { id: 'sc-site-hours', key: 'site_business_hours', value: 'Monday - Sunday: 7AM - 7PM', label: 'Business Hours', group: 'site_settings', type: 'text' },
      { id: 'sc-site-facebook', key: 'site_facebook', value: '#', label: 'Facebook URL', group: 'site_settings', type: 'text' },
      { id: 'sc-site-instagram', key: 'site_instagram', value: '#', label: 'Instagram URL', group: 'site_settings', type: 'text' },
      { id: 'sc-site-youtube', key: 'site_youtube', value: '#', label: 'YouTube URL', group: 'site_settings', type: 'text' },
      { id: 'sc-site-logo', key: 'site_logo', value: '/fair-fresh-logo.svg', label: 'Site Logo', group: 'site_settings', type: 'image' },
      { id: 'sc-wh-start', key: 'working_hours_start', value: '07:00', label: 'Working Hours Start', group: 'site_settings', type: 'text' },
      { id: 'sc-wh-end', key: 'working_hours_end', value: '19:00', label: 'Working Hours End', group: 'site_settings', type: 'text' },
      { id: 'sc-home-hero-title', key: 'home_hero_title', value: 'Professional Fabric Cleaning in <span class="text-primary">Brisbane</span>', label: 'Hero Title (HTML allowed)', group: 'home', type: 'textarea' },
      { id: 'sc-home-hero-desc', key: 'home_hero_description', value: 'Expert cleaning services for carpets, mattresses, rugs, upholstery, curtains, and car seats in Brisbane. Fair pricing, fresh results.', label: 'Hero Description', group: 'home', type: 'textarea' },
      { id: 'sc-home-promo', key: 'home_promo_text', value: 'Get 20% OFF on same day booking!', label: 'Promo Banner Text', group: 'home', type: 'text' },
      { id: 'sc-home-hero-image', key: 'home_hero_image', value: '/professional-carpet-cleaning-service-in-modern-hom.jpg', label: 'Hero Image', group: 'home', type: 'image' },
      { id: 'sc-home-about-image', key: 'home_about_image', value: '/professional-cleaning-team-with-equipment-in-brisb.jpg', label: 'About Section Image', group: 'home', type: 'image' },
      { id: 'sc-home-about-heading', key: 'home_about_heading', value: "Brisbane's Most Trusted Fabric Cleaning Specialists", label: 'About Section Heading', group: 'home', type: 'text' },
      { id: 'sc-home-about-desc', key: 'home_about_description', value: 'For over 15 years, we have been transforming homes and businesses across Brisbane with our professional fabric cleaning services. We combine cutting-edge technology with eco-friendly practices to deliver exceptional results.', label: 'About Section Description', group: 'home', type: 'textarea' },
      { id: 'sc-home-about-cta-text', key: 'home_about_cta_text', value: 'Learn More About Us', label: 'CTA Button Text', group: 'home', type: 'text' },
      { id: 'sc-about-badge', key: 'about_badge', value: "Brisbane's Trusted Fabric Care Experts", label: 'Hero Badge', group: 'about', type: 'text' },
      { id: 'sc-about-hero-title', key: 'about_hero_title', value: 'Where expertise meets\n<span class="block text-primary mt-2">pristine perfection</span>', label: 'Hero Title (HTML allowed)', group: 'about', type: 'textarea' },
      { id: 'sc-about-hero-desc', key: 'about_hero_description', value: "For over 15 years, we've been transforming Brisbane homes and businesses with professional fabric cleaning that goes beyond surface deep.", label: 'Hero Description', group: 'about', type: 'textarea' },
      { id: 'sc-about-section1-title', key: 'about_section1_title', value: "Brisbane's fabric cleaning experts", label: 'Section 1 Title', group: 'about', type: 'text' },
      { id: 'sc-about-section1-desc', key: 'about_section1_description', value: 'We have been serving Brisbane families and businesses for over 15 years, specializing in comprehensive fabric care.', label: 'Section 1 Description', group: 'about', type: 'textarea' },
      { id: 'sc-about-mission-title', key: 'about_mission_title', value: 'Our Mission', label: 'Mission Title', group: 'about', type: 'text' },
      { id: 'sc-about-mission-desc', key: 'about_mission_description', value: 'To provide Brisbane with exceptional fabric cleaning services that restore, protect, and extend the life of your valued possessions using eco-friendly products and advanced techniques.', label: 'Mission Description', group: 'about', type: 'textarea' },
      { id: 'sc-about-vision-title', key: 'about_vision_title', value: 'Our Vision', label: 'Vision Title', group: 'about', type: 'text' },
      { id: 'sc-about-vision-desc', key: 'about_vision_description', value: "To be recognized as Brisbane's most trusted and innovative fabric cleaning company.", label: 'Vision Description', group: 'about', type: 'textarea' },
      { id: 'sc-about-values-title', key: 'about_values_title', value: 'What drives us every day', label: 'Values Section Title', group: 'about', type: 'text' },
      { id: 'sc-about-values-desc', key: 'about_values_description', value: 'Our core values guide everything we do, from the products we use to the service we provide', label: 'Values Section Description', group: 'about', type: 'text' },
      { id: 'sc-about-cta-title', key: 'about_cta_title', value: 'Ready to experience the difference?', label: 'CTA Title', group: 'about', type: 'text' },
      { id: 'sc-about-cta-desc', key: 'about_cta_description', value: 'Contact us today for a free quote and discover why Brisbane trusts us with their most valued fabrics', label: 'CTA Description', group: 'about', type: 'textarea' },
      { id: 'sc-contact-badge', key: 'contact_badge', value: 'Available 7 Days a Week', label: 'Hero Badge', group: 'contact', type: 'text' },
      { id: 'sc-contact-hero-title', key: 'contact_hero_title', value: 'Ready to Transform Your Fabrics?', label: 'Hero Title', group: 'contact', type: 'text' },
      { id: 'sc-contact-hero-desc', key: 'contact_hero_description', value: "Get in touch with Brisbane's most trusted fabric cleaning specialists.", label: 'Hero Description', group: 'contact', type: 'textarea' },
      { id: 'sc-contact-why-title', key: 'contact_why_title', value: 'Why Brisbane Trusts Us', label: 'Why Choose Us Title', group: 'contact', type: 'text' },
      { id: 'sc-services-badge', key: 'services_badge', value: 'Professional Fabric Cleaning Services', label: 'Hero Badge', group: 'services', type: 'text' },
      { id: 'sc-services-hero-title', key: 'services_hero_title', value: 'Transform Your Space with Expert Care', label: 'Hero Title', group: 'services', type: 'text' },
      { id: 'sc-services-hero-desc', key: 'services_hero_description', value: "Brisbane's most trusted fabric cleaning specialists. From carpets to curtains, we bring new life to every surface.", label: 'Hero Description', group: 'services', type: 'textarea' },
      { id: 'sc-services-why-title', key: 'services_why_title', value: 'Why Choose Us?', label: 'Why Choose Us Title', group: 'services', type: 'text' },
      { id: 'sc-services-why-desc', key: 'services_why_description', value: "We're committed to delivering exceptional results with every cleaning service.", label: 'Why Choose Us Description', group: 'services', type: 'text' },
      { id: 'sc-services-process-title', key: 'services_process_title', value: 'Our Cleaning Process', label: 'Process Section Title', group: 'services', type: 'text' },
      { id: 'sc-services-process-desc', key: 'services_process_description', value: 'A systematic approach that ensures consistent, high-quality results every time.', label: 'Process Section Description', group: 'services', type: 'text' },
      { id: 'sc-services-cta-title', key: 'services_cta_title', value: 'Ready to Experience the Difference?', label: 'CTA Title', group: 'services', type: 'text' },
      { id: 'sc-services-cta-desc', key: 'services_cta_description', value: 'Get a free, no-obligation quote today and discover why Brisbane trusts us.', label: 'CTA Description', group: 'services', type: 'textarea' },
      { id: 'sc-footer-about', key: 'footer_about_text', value: "Brisbane's trusted fabric cleaning specialists. Fair pricing, fresh results.", label: 'About Text', group: 'footer', type: 'textarea' },
      { id: 'sc-footer-copyright', key: 'footer_copyright_text', value: 'All rights reserved.', label: 'Copyright Text', group: 'footer', type: 'text' },
    ];

    for (const item of siteContentDefaults) {
      await db.insert(schema.siteContent)
        .values(item)
        .onConflictDoUpdate({
          target: schema.siteContent.key,
          set: {
            label: item.label,
            type: item.type,
            group: item.group,
            updatedAt: new Date(),
          }
        });
    }
    console.log('✅ Default site content synced (labels & types updated for existing entries).');

    // 2b. Delete site content keys whose frontend components have been removed.
    //     Targeted by key id so manually created CMS entries are never touched.
    const removedSiteContentIds = [
      'sc-site-whatsapp',
      'sc-home-rating',
      'sc-home-stats-label',
      'sc-home-stats-value',
      'sc-home-about-years-val',
      'sc-home-about-years-lbl',
      'sc-home-about-clients-val',
      'sc-home-about-clients-lbl',
      'sc-home-about-satisfaction-val',
      'sc-home-about-satisfaction-lbl',
    ];
    await db.delete(schema.siteContent).where(
      inArray(schema.siteContent.id, removedSiteContentIds)
    );
    console.log('🧹 Removed obsolete site content entries (components no longer on the site).');

    // 3. Seed the default home service categories (homepage section groupings)
    const homeCategoriesCount = await db
      .select({ id: schema.homeServiceCategories.id })
      .from(schema.homeServiceCategories)
      .limit(1);
    if (homeCategoriesCount.length === 0) {
      await db.insert(schema.homeServiceCategories).values([
        {
          id: 'hsc-steam-cleaning',
          title: 'Steam Cleaning',
          slug: 'steam-cleaning',
          sortOrder: 0,
          description:
            'Professional steam cleaning for carpets, upholstery, mattresses and more — deep cleaning that lifts dirt, stains and allergens from your fabrics.',
          metaTitle: 'Steam Cleaning Brisbane | Carpet, Upholstery & Mattress Steam Cleaning',
          metaDescription:
            'Professional steam cleaning in Brisbane. Carpet, upholstery, mattress and rug steam cleaning that removes tough stains, odours and allergens. Get a free quote today.',
          metaKeywords: 'steam cleaning Brisbane, carpet steam cleaning, upholstery steam cleaning, mattress steam cleaning',
          ogTitle: 'Steam Cleaning Brisbane — Fair & Fresh Cleaning',
          canonicalUrl: 'https://www.fairandfreshcleaning.com.au/home-services/steam-cleaning',
        },
        {
          id: 'hsc-home-maintenance',
          title: 'Home Maintenance',
          slug: 'home-maintenance',
          sortOrder: 1,
          description:
            'Practical home maintenance services that keep your Brisbane home in top shape — from lawn mowing to rubbish removal and general upkeep.',
          metaTitle: 'Home Maintenance Brisbane | Lawn Mowing & Rubbish Removal',
          metaDescription:
            'Reliable home maintenance services across Brisbane. Lawn mowing, rubbish removal and general home upkeep from the team at Fair & Fresh Cleaning.',
          metaKeywords: 'home maintenance Brisbane, lawn mowing Brisbane, rubbish removal Brisbane',
          ogTitle: 'Home Maintenance Brisbane — Fair & Fresh Cleaning',
          canonicalUrl: 'https://www.fairandfreshcleaning.com.au/home-services/home-maintenance',
        },
        {
          id: 'hsc-specialized',
          title: 'Specialized Cleaning & Restoration',
          slug: 'specialized-cleaning-restoration',
          sortOrder: 2,
          description:
            'Specialized cleaning and restoration for the jobs that need expert care — flood damage restoration, bond cleaning and more.',
          metaTitle: 'Specialized Cleaning & Restoration Brisbane | Flood & Bond Cleaning',
          metaDescription:
            'Specialized cleaning and restoration services in Brisbane. Flood damage restoration, bond cleaning and specialist deep cleans from Fair & Fresh Cleaning.',
          metaKeywords: 'specialized cleaning Brisbane, flood damage restoration Brisbane, bond cleaning Brisbane',
          ogTitle: 'Specialized Cleaning & Restoration — Fair & Fresh Cleaning',
          canonicalUrl: 'https://www.fairandfreshcleaning.com.au/home-services/specialized-cleaning-restoration',
        },
      ]);
      console.log('🌱 Seeded default home service categories.');
    }

    // 4. Safely check if structural data (categories/services) is already seeded
    const categoriesCount = await db.select().from(schema.serviceCategories).limit(1);
    if (categoriesCount.length > 0) {
      return; // Safe exit: Content layout already exists, do not duplicate rows
    }

    console.log('🌱 Seeding PostgreSQL Database with content layout data...');

    await db.insert(schema.staticPages).values([
      {
        id: 'home',
        name: 'Home Page',
        slug: 'home',
        metaTitle: 'Premium Professional Cleaning Services',
        metaDescription: 'Spotless residential, deep, and commercial cleaning. Reclaim your time with our expert cleaners.',
        ogTitle: 'Professional Cleaning Services',
        ogType: 'website',
        canonicalUrl: 'https://fairfresh.com/'
      },
      {
        id: 'about',
        name: 'About Us',
        slug: 'about-us',
        metaTitle: 'About Our Cleaning Services',
        metaDescription: 'Learn about our cleaning standards, background-checked professionals, and mission to deliver fresh homes.',
        ogTitle: 'About Us',
        ogType: 'website',
        canonicalUrl: 'https://fairfresh.com/about-us/'
      },
      {
        id: 'contact',
        name: 'Contact Us',
        slug: 'contact-us',
        metaTitle: 'Contact Us',
        metaDescription: 'Get in touch for customized clean packages, office quotes, or support with booking.',
        ogTitle: 'Contact Us',
        ogType: 'website',
        canonicalUrl: 'https://fairfresh.com/contact-us/'
      },
      {
        id: 'services',
        name: 'Services Catalog',
        slug: 'services',
        metaTitle: 'Professional Cleaning Services Directory',
        metaDescription: 'Explore our catalog of custom cleaning services including Deep Clean, Office Clean, and Standard Home Care.',
        ogTitle: 'Professional Cleaning Catalog',
        ogType: 'website',
        canonicalUrl: 'https://fairfresh.com/services/'
      },
      {
        id: 'blog',
        name: 'Blog Index',
        slug: 'blog',
        metaTitle: 'Cleaning Guides, Tips & Professional Advice',
        metaDescription: 'Explore our blog for professional sanitization advice, spring cleaning guides, and office workspace health tips.',
        ogTitle: 'Cleaning Guides & Tips',
        ogType: 'website',
        canonicalUrl: 'https://fairfresh.com/blog/'
      }
    ]);

    console.log('✅ PostgreSQL Database seeded successfully.');
  } catch (error) {
    console.error('❌ Error seeding PostgreSQL database:', error);
  }
}
