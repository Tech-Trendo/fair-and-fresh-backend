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

    // 2. Safely check if structural data (categories/services) is already seeded
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
