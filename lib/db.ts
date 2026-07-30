import { drizzle } from 'drizzle-orm/postgres-js';
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

    // 1. ALWAYS sync the admin credentials based on Vercel Environment Variables
    if (adminUser && adminPass) {
      const adminSalt = crypto.randomBytes(16).toString('hex');
      const adminPasswordHash = hashPassword(adminPass, adminSalt);

      // This inserts the admin if missing, OR updates it if 'usr-admin' already exists!
      await db.insert(schema.users)
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
      
      console.log('🔒 Admin credentials successfully synchronized with environment variables.');
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
      { id: 'sc-site-whatsapp', key: 'site_whatsapp', value: '+610430799567', label: 'WhatsApp Number', group: 'site_settings', type: 'text' },
      { id: 'sc-site-facebook', key: 'site_facebook', value: '#', label: 'Facebook URL', group: 'site_settings', type: 'text' },
      { id: 'sc-site-instagram', key: 'site_instagram', value: '#', label: 'Instagram URL', group: 'site_settings', type: 'text' },
      { id: 'sc-site-twitter', key: 'site_twitter', value: '#', label: 'Twitter URL', group: 'site_settings', type: 'text' },
      { id: 'sc-site-brand', key: 'site_brand_name', value: 'Fair & Fresh Cleaning', label: 'Brand Name', group: 'site_settings', type: 'text' },
      { id: 'sc-site-logo', key: 'site_logo', value: '/fair-fresh-logo.svg', label: 'Site Logo', group: 'site_settings', type: 'image' },
      { id: 'sc-wh-start', key: 'working_hours_start', value: '07:00', label: 'Working Hours Start', group: 'site_settings', type: 'text' },
      { id: 'sc-wh-end', key: 'working_hours_end', value: '19:00', label: 'Working Hours End', group: 'site_settings', type: 'text' },
      { id: 'sc-home-hero-title', key: 'home_hero_title', value: 'Professional Fabric Cleaning in <span class="text-primary">Brisbane</span>', label: 'Hero Title (HTML allowed)', group: 'home', type: 'textarea' },
      { id: 'sc-home-hero-desc', key: 'home_hero_description', value: 'Expert cleaning services for carpets, mattresses, rugs, upholstery, curtains, and car seats in Brisbane. Fair pricing, fresh results, guaranteed satisfaction.', label: 'Hero Description', group: 'home', type: 'textarea' },
      { id: 'sc-home-promo', key: 'home_promo_text', value: 'Get 20% OFF on same day booking!', label: 'Promo Banner Text', group: 'home', type: 'text' },
      { id: 'sc-home-rating', key: 'home_rating_text', value: '4.9/5 Rating', label: 'Rating Text', group: 'home', type: 'text' },
      { id: 'sc-home-stats-label', key: 'home_stats_label', value: 'Happy Customers', label: 'Stats Badge Label', group: 'home', type: 'text' },
      { id: 'sc-home-stats-value', key: 'home_stats_value', value: '500+', label: 'Stats Badge Value', group: 'home', type: 'text' },
      { id: 'sc-home-hero-image', key: 'home_hero_image', value: '/professional-carpet-cleaning-service-in-modern-hom.jpg', label: 'Hero Image', group: 'home', type: 'image' },
      { id: 'sc-home-about-image', key: 'home_about_image', value: '/professional-cleaning-team-with-equipment-in-brisb.jpg', label: 'About Section Image', group: 'home', type: 'image' },
      { id: 'sc-home-about-heading', key: 'home_about_heading', value: "Brisbane's Most Trusted Fabric Cleaning Specialists", label: 'About Section Heading', group: 'home', type: 'text' },
      { id: 'sc-home-about-desc', key: 'home_about_description', value: 'For over 15 years, Fair and Fresh Cleaning has been transforming homes and businesses across Brisbane with our professional fabric cleaning services. We combine cutting-edge technology with eco-friendly practices to deliver exceptional results.', label: 'About Section Description', group: 'home', type: 'textarea' },
      { id: 'sc-home-about-years-val', key: 'home_about_years_value', value: '15', label: 'Years Stat Value', group: 'home', type: 'number' },
      { id: 'sc-home-about-years-lbl', key: 'home_about_years_label', value: 'Years', label: 'Years Stat Label', group: 'home', type: 'text' },
      { id: 'sc-home-about-clients-val', key: 'home_about_clients_value', value: '2.5', label: 'Clients Stat Value (number)', group: 'home', type: 'number' },
      { id: 'sc-home-about-clients-lbl', key: 'home_about_clients_label', value: 'Clients', label: 'Clients Stat Label', group: 'home', type: 'text' },
      { id: 'sc-home-about-satisfaction-val', key: 'home_about_satisfaction_value', value: '98', label: 'Satisfaction Stat Value', group: 'home', type: 'number' },
      { id: 'sc-home-about-satisfaction-lbl', key: 'home_about_satisfaction_label', value: 'Satisfaction', label: 'Satisfaction Stat Label', group: 'home', type: 'text' },
      { id: 'sc-home-about-feat1-title', key: 'home_about_feature_1_title', value: 'Fully Insured', label: 'Feature 1 Title', group: 'home', type: 'text' },
      { id: 'sc-home-about-feat1-desc', key: 'home_about_feature_1_desc', value: 'Complete protection', label: 'Feature 1 Description', group: 'home', type: 'text' },
      { id: 'sc-home-about-feat2-title', key: 'home_about_feature_2_title', value: 'Certified Experts', label: 'Feature 2 Title', group: 'home', type: 'text' },
      { id: 'sc-home-about-feat2-desc', key: 'home_about_feature_2_desc', value: 'Professional training', label: 'Feature 2 Description', group: 'home', type: 'text' },
      { id: 'sc-home-about-feat3-title', key: 'home_about_feature_3_title', value: '2,500+ Happy Clients', label: 'Feature 3 Title', group: 'home', type: 'text' },
      { id: 'sc-home-about-feat3-desc', key: 'home_about_feature_3_desc', value: 'Proven track record', label: 'Feature 3 Description', group: 'home', type: 'text' },
      { id: 'sc-home-about-feat4-title', key: 'home_about_feature_4_title', value: '100% Guarantee', label: 'Feature 4 Title', group: 'home', type: 'text' },
      { id: 'sc-home-about-feat4-desc', key: 'home_about_feature_4_desc', value: 'Satisfaction guaranteed', label: 'Feature 4 Description', group: 'home', type: 'text' },
      { id: 'sc-home-about-cta-text', key: 'home_about_cta_text', value: 'Learn More About Us', label: 'CTA Button Text', group: 'home', type: 'text' },
      { id: 'sc-about-badge', key: 'about_badge', value: "Brisbane's Trusted Fabric Care Experts", label: 'Hero Badge', group: 'about', type: 'text' },
      { id: 'sc-about-hero-title', key: 'about_hero_title', value: 'Where expertise meets\n<span class="block text-primary mt-2">pristine perfection</span>', label: 'Hero Title (HTML allowed)', group: 'about', type: 'textarea' },
      { id: 'sc-about-hero-desc', key: 'about_hero_description', value: "For over 15 years, we've been transforming Brisbane homes and businesses with professional fabric cleaning that goes beyond surface deep.", label: 'Hero Description', group: 'about', type: 'textarea' },
      { id: 'sc-about-section1-title', key: 'about_section1_title', value: "Brisbane's fabric cleaning experts", label: 'Section 1 Title', group: 'about', type: 'text' },
      { id: 'sc-about-section1-desc', key: 'about_section1_description', value: 'Fair & Fresh Cleaning has been serving Brisbane families and businesses for over 15 years, specializing in comprehensive fabric care.', label: 'Section 1 Description', group: 'about', type: 'textarea' },
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
      { id: 'sc-services-why-title', key: 'services_why_title', value: 'Why Choose Fair and Fresh?', label: 'Why Choose Us Title', group: 'services', type: 'text' },
      { id: 'sc-services-why-desc', key: 'services_why_description', value: "We're committed to delivering exceptional results with every cleaning service.", label: 'Why Choose Us Description', group: 'services', type: 'text' },
      { id: 'sc-services-process-title', key: 'services_process_title', value: 'Our Cleaning Process', label: 'Process Section Title', group: 'services', type: 'text' },
      { id: 'sc-services-process-desc', key: 'services_process_description', value: 'A systematic approach that ensures consistent, high-quality results every time.', label: 'Process Section Description', group: 'services', type: 'text' },
      { id: 'sc-services-cta-title', key: 'services_cta_title', value: 'Ready to Experience the Difference?', label: 'CTA Title', group: 'services', type: 'text' },
      { id: 'sc-services-cta-desc', key: 'services_cta_description', value: 'Get a free, no-obligation quote today and discover why Brisbane trusts Fair and Fresh Cleaning.', label: 'CTA Description', group: 'services', type: 'textarea' },
      { id: 'sc-footer-about', key: 'footer_about_text', value: "Brisbane's trusted fabric cleaning specialists. Fair pricing, fresh results, guaranteed satisfaction.", label: 'About Text', group: 'footer', type: 'textarea' },
      { id: 'sc-footer-copyright', key: 'footer_copyright_text', value: 'Fair and Fresh Cleaning. All rights reserved.', label: 'Copyright Text', group: 'footer', type: 'text' },
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

    // 3. Safely check if structural data (categories/services) is already seeded
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
        metaTitle: 'Fair & Fresh - Premium Professional Cleaning Services',
        metaDescription: 'Spotless residential, deep, and commercial cleaning. Reclaim your time with our expert cleaners.',
        ogTitle: 'Fair & Fresh Cleaning Services',
        ogType: 'website',
        canonicalUrl: 'https://fairfresh.com/'
      },
      {
        id: 'about',
        name: 'About Us',
        slug: 'about-us',
        metaTitle: 'About Fair & Fresh Cleaning Services',
        metaDescription: 'Learn about our cleaning standards, background-checked professionals, and mission to deliver fresh homes.',
        ogTitle: 'About Fair & Fresh',
        ogType: 'website',
        canonicalUrl: 'https://fairfresh.com/about-us/'
      },
      {
        id: 'contact',
        name: 'Contact Us',
        slug: 'contact-us',
        metaTitle: 'Contact Fair & Fresh Cleaning Services',
        metaDescription: 'Get in touch for customized clean packages, office quotes, or support with booking.',
        ogTitle: 'Contact Fair & Fresh',
        ogType: 'website',
        canonicalUrl: 'https://fairfresh.com/contact-us/'
      },
      {
        id: 'services',
        name: 'Services Catalog',
        slug: 'services',
        metaTitle: 'Professional Cleaning Services Directory',
        metaDescription: 'Explore our catalog of custom cleaning services including Deep Clean, Office Clean, and Standard Home Care.',
        ogTitle: 'Fair & Fresh Cleaning Catalog',
        ogType: 'website',
        canonicalUrl: 'https://fairfresh.com/services/'
      },
      {
        id: 'blog',
        name: 'Blog Index',
        slug: 'blog',
        metaTitle: 'Cleaning Guides, Tips & Professional Advice',
        metaDescription: 'Explore our blog for professional sanitization advice, spring cleaning guides, and office workspace health tips.',
        ogTitle: 'Fair & Fresh Cleaning Guides',
        ogType: 'website',
        canonicalUrl: 'https://fairfresh.com/blog/'
      }
    ]);

    console.log('✅ PostgreSQL Database seeded successfully.');
  } catch (error) {
    console.error('❌ Error seeding PostgreSQL database:', error);
  }
}
