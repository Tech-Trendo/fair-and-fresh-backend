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
    }

    // 2. Safely check if structural data (categories/services) is already seeded
    const categoriesCount = await db.select().from(schema.serviceCategories).limit(1);
    if (categoriesCount.length > 0) {
      return; // Safe exit: Content layout already exists, do not duplicate rows
    }

    console.log('🌱 Seeding PostgreSQL Database with content layout data...');

    await db.insert(schema.serviceCategories).values([
      {
        id: 'cat-1',
        title: 'Residential Cleaning',
        description: 'Professional cleaning for houses, apartments, and residential spaces.',
        image: '/uploads/residential.jpg',
        slug: 'residential-cleaning'
      },
      {
        id: 'cat-2',
        title: 'Commercial Cleaning',
        description: 'Office, retail, and corporate cleaning solutions tailored to your business.',
        image: '/uploads/commercial.jpg',
        slug: 'commercial-cleaning'
      },
      {
        id: 'cat-3',
        title: 'Deep Cleaning',
        description: 'Thorough, detailed sanitization and cleaning targeting every nook and cranny.',
        image: '/uploads/deep.jpg',
        slug: 'deep-cleaning'
      }
    ]);

    await db.insert(schema.blogCategories).values([
      {
        id: 'cat-2',
        title: 'Commercial Cleaning',
        description: 'Office, retail, and corporate cleaning solutions tailored to your business.',
        image: '/uploads/commercial.jpg',
        slug: 'commercial-cleaning'
      }
    ]);

    await db.insert(schema.services).values([
      {
        id: 'srv-1',
        name: 'Standard Home Cleaning',
        shortDescription: 'Keep your home clean and fresh with our recurring standard cleaning.',
        longDescription: 'Our Standard Home Cleaning service is designed to maintain your living space neat, tidy, and hygienic. Ideal for weekly, bi-weekly, or monthly intervals, it covers dusting, mopping, vacuuming, kitchen cleaning, and bathroom sanitization.',
        whatWeOffer: {
          frequency_options: ['Weekly', 'Bi-weekly', 'One-time'],
          supplies_included: true
        },
        metaTitle: 'Professional Standard Home Cleaning Services',
        metaDescription: 'Book standard home cleaning services online. Trusted cleaners, professional equipment, and a fresh home guaranteed.',
        metaKeywords: 'house cleaning, home cleaning, maid service, recurring cleaning',
        slug: 'standard-home-cleaning',
        ogTitle: 'Standard Home Cleaning Services',
        ogDescription: 'Book standard home cleaning services online.',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        createdAt: new Date()
      },
      {
        id: 'srv-2',
        name: 'Office & Workspace Cleaning',
        shortDescription: 'Create a clean, healthy, and productive environment for your staff.',
        longDescription: 'A clean workplace boosts morale and productivity. Our comprehensive commercial office cleaning service handles desks, meeting rooms, break areas, carpets, and sanitizes high-touch surfaces to protect your employees.',
        whatWeOffer: {
          after_hours_available: true,
          customized_schedule: true
        },
        metaTitle: 'Commercial Office Cleaning Services | Professional Cleaners',
        metaDescription: 'Get tailored office and commercial cleaning services. Maintain a spotless, professional environment for your business.',
        metaKeywords: 'office cleaning, commercial cleaning, workspace sanitization',
        slug: 'office-workspace-cleaning',
        ogTitle: 'Office & Workspace Cleaning Services',
        ogDescription: 'Tailored office and commercial cleaning services.',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        createdAt: new Date()
      }
    ]);

    await db.insert(schema.whatsIncluded).values([
      { id: 'inc-1', serviceId: 'srv-1', title: 'Dusting all surfaces', description: 'Dusting furniture, shelves, light fixtures, and picture frames.' },
      { id: 'inc-2', serviceId: 'srv-1', title: 'Kitchen sanitization', description: 'Wiping exterior appliances, countertops, sink, and cabinet faces.' },
      { id: 'inc-3', serviceId: 'srv-1', title: 'Bathroom scrub', description: 'Deep scrubbing of toilet, shower, tub, sink, and mirrors.' },
      { id: 'inc-4', serviceId: 'srv-2', title: 'Desk sanitization', description: 'Wiping down keyboards, mice, desks, and office phones.' },
      { id: 'inc-5', serviceId: 'srv-2', title: 'Trash removal', description: 'Emptying office bins, recycling, and replacing liners.' }
    ]);

    await db.insert(schema.benefits).values([
      { id: 'ben-1', serviceId: 'srv-1', title: 'Time Saving', description: 'Reclaim your weekends while we keep your space spotless.' },
      { id: 'ben-2', serviceId: 'srv-1', title: 'Eco-friendly Products', description: 'We use non-toxic, pet-safe, and biodegradable products.' },
      { id: 'ben-3', serviceId: 'srv-2', title: 'Increased Productivity', description: 'A cleaner office reduces sick days and maintains employee focus.' }
    ]);

    await db.insert(schema.serviceImages).values([
      { id: 'img-1', serviceId: 'srv-1', imageUrl: '/uploads/home_cleaning_1.jpg' },
      { id: 'img-2', serviceId: 'srv-2', imageUrl: '/uploads/office_cleaning_1.jpg' }
    ]);

    await db.insert(schema.testimonials).values([
      { id: 'tst-1', serviceId: 'srv-1', author: 'Sarah Jenkins', content: 'Absolutely outstanding service. The team was on time and left my house looking brand new.', rating: 5 },
      { id: 'tst-2', serviceId: 'srv-2', author: 'Robert Dow', content: 'Reliable commercial cleaning. High attention to detail in our conference rooms.', rating: 4 }
    ]);

    await db.insert(schema.blogs).values([
      {
        id: 'blog-1',
        title: '5 Crucial Tips for a Clean and Fresh Workspace',
        featuredImage: '/uploads/blog_workspace.jpg',
        description: '<h2>Keeping a workspace clean is essential.</h2><p>Here are 5 tips: 1. Disinfect keyboards, 2. Keep trash sorted, 3. Clean break room appliances daily, 4. Avoid desk eating, 5. Schedule deep carpet cleans quarterly.</p>',
        metaTitle: '5 Crucial Tips for a Clean Workspace',
        metaDescription: 'Read the top tips on keeping your office environment clean, fresh, and productive for everyone.',
        metaKeywords: 'office tips, desk cleaning, hygiene at work',
        slug: '5-crucial-tips-for-a-clean-and-fresh-workspace',
        ogTitle: '5 Tips for a Clean and Fresh Workspace',
        ogType: 'article',
        createdAt: new Date()
      }
    ]);

    await db.insert(schema.blogsCategories).values({
      blogId: 'blog-1',
      categoryId: 'cat-2'
    });

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

// Automatically seed on connection (only once per process)
if (!globalForDrizzle.seeded) {
  globalForDrizzle.seeded = true;
  seedDatabase();
}
