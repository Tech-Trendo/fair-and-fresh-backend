import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DB_FILE = path.join(process.cwd(), 'db.json');

export interface SEOMixin {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  slug?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  twitter_card?: string;
  canonical_url?: string;
}

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  salt: string;
  isStaff: boolean;
}

export interface Category {
  id: string;
  title: string;
  description?: string;
  image?: string;
}

export interface Blog extends SEOMixin {
  id: string;
  title: string;
  categoryIds: string[];
  featured_image?: string;
  description?: string; // RichText HTML
  created_at: string;
}

export interface Service extends SEOMixin {
  id: string;
  name: string;
  short_description?: string;
  long_description?: string;
  what_we_offer?: Record<string, any>;
  created_at: string;
}

export interface WhatsIncluded {
  id: string;
  service_id: string;
  title: string;
  description?: string;
}

export interface Benefit {
  id: string;
  service_id: string;
  title: string;
  description?: string;
}

export interface ServiceImage {
  id: string;
  service_id: string;
  image_url: string;
}

export interface Testimonial {
  id: string;
  service_id: string;
  author: string;
  content: string;
  rating: number;
}

export interface DatabaseSchema {
  users: User[];
  categories: Category[];
  blogs: Blog[];
  services: Service[];
  whats_included: WhatsIncluded[];
  benefits: Benefit[];
  images: ServiceImage[];
  testimonials: Testimonial[];
  blacklisted_tokens: string[];
}

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

function getInitialData(): DatabaseSchema {
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword('admin123', salt);

  const initialCategories: Category[] = [
    {
      id: 'cat-1',
      title: 'Residential Cleaning',
      description: 'Professional cleaning for houses, apartments, and residential spaces.',
      image: '/uploads/residential.jpg'
    },
    {
      id: 'cat-2',
      title: 'Commercial Cleaning',
      description: 'Office, retail, and corporate cleaning solutions tailored to your business.',
      image: '/uploads/commercial.jpg'
    },
    {
      id: 'cat-3',
      title: 'Deep Cleaning',
      description: 'Thorough, detailed sanitization and cleaning targeting every nook and cranny.',
      image: '/uploads/deep.jpg'
    }
  ];

  const initialServices: Service[] = [
    {
      id: 'srv-1',
      name: 'Standard Home Cleaning',
      short_description: 'Keep your home clean and fresh with our recurring standard cleaning.',
      long_description: 'Our Standard Home Cleaning service is designed to maintain your living space neat, tidy, and hygienic. Ideal for weekly, bi-weekly, or monthly intervals, it covers dusting, mopping, vacuuming, kitchen cleaning, and bathroom sanitization.',
      what_we_offer: {
        frequency_options: ['Weekly', 'Bi-weekly', 'One-time'],
        supplies_included: true
      },
      meta_title: 'Professional Standard Home Cleaning Services',
      meta_description: 'Book standard home cleaning services online. Trusted cleaners, professional equipment, and a fresh home guaranteed.',
      meta_keywords: 'house cleaning, home cleaning, maid service, recurring cleaning',
      slug: 'standard-home-cleaning',
      og_title: 'Standard Home Cleaning Services',
      og_description: 'Book standard home cleaning services online.',
      og_type: 'website',
      twitter_card: 'summary_large_image',
      created_at: new Date().toISOString()
    },
    {
      id: 'srv-2',
      name: 'Office & Workspace Cleaning',
      short_description: 'Create a clean, healthy, and productive environment for your staff.',
      long_description: 'A clean workplace boosts morale and productivity. Our comprehensive commercial office cleaning service handles desks, meeting rooms, break areas, carpets, and sanitizes high-touch surfaces to protect your employees.',
      what_we_offer: {
        after_hours_available: true,
        customized_schedule: true
      },
      meta_title: 'Commercial Office Cleaning Services | Professional Cleaners',
      meta_description: 'Get tailored office and commercial cleaning services. Maintain a spotless, professional environment for your business.',
      meta_keywords: 'office cleaning, commercial cleaning, workspace sanitization',
      slug: 'office-workspace-cleaning',
      og_title: 'Office & Workspace Cleaning Services',
      og_description: 'Tailored office and commercial cleaning services.',
      og_type: 'website',
      twitter_card: 'summary_large_image',
      created_at: new Date().toISOString()
    }
  ];

  const initialWhatsIncluded: WhatsIncluded[] = [
    { id: 'inc-1', service_id: 'srv-1', title: 'Dusting all surfaces', description: 'Dusting furniture, shelves, light fixtures, and picture frames.' },
    { id: 'inc-2', service_id: 'srv-1', title: 'Kitchen sanitization', description: 'Wiping exterior appliances, countertops, sink, and cabinet faces.' },
    { id: 'inc-3', service_id: 'srv-1', title: 'Bathroom scrub', description: 'Deep scrubbing of toilet, shower, tub, sink, and mirrors.' },
    { id: 'inc-4', service_id: 'srv-2', title: 'Desk sanitization', description: 'Wiping down keyboards, mice, desks, and office phones.' },
    { id: 'inc-5', service_id: 'srv-2', title: 'Trash removal', description: 'Emptying office bins, recycling, and replacing liners.' }
  ];

  const initialBenefits: Benefit[] = [
    { id: 'ben-1', service_id: 'srv-1', title: 'Time Saving', description: 'Reclaim your weekends while we keep your space spotless.' },
    { id: 'ben-2', service_id: 'srv-1', title: 'Eco-friendly Products', description: 'We use non-toxic, pet-safe, and biodegradable products.' },
    { id: 'ben-3', service_id: 'srv-2', title: 'Increased Productivity', description: 'A cleaner office reduces sick days and maintains employee focus.' }
  ];

  const initialImages: ServiceImage[] = [
    { id: 'img-1', service_id: 'srv-1', image_url: '/uploads/home_cleaning_1.jpg' },
    { id: 'img-2', service_id: 'srv-2', image_url: '/uploads/office_cleaning_1.jpg' }
  ];

  const initialTestimonials: Testimonial[] = [
    { id: 'tst-1', service_id: 'srv-1', author: 'Sarah Jenkins', content: 'Absolutely outstanding service. The team was on time and left my house looking brand new.', rating: 5 },
    { id: 'tst-2', service_id: 'srv-2', author: 'Robert Dow', content: 'Reliable commercial cleaning. High attention to detail in our conference rooms.', rating: 4 }
  ];

  const initialBlogs: Blog[] = [
    {
      id: 'blog-1',
      title: '5 Crucial Tips for a Clean and Fresh Workspace',
      categoryIds: ['cat-2'],
      featured_image: '/uploads/blog_workspace.jpg',
      description: '<h2>Keeping a workspace clean is essential.</h2><p>Here are 5 tips: 1. Disinfect keyboards, 2. Keep trash sorted, 3. Clean break room appliances daily, 4. Avoid desk eating, 5. Schedule deep carpet cleans quarterly.</p>',
      meta_title: '5 Crucial Tips for a Clean Workspace',
      meta_description: 'Read the top tips on keeping your office environment clean, fresh, and productive for everyone.',
      meta_keywords: 'office tips, desk cleaning, hygiene at work',
      slug: '5-crucial-tips-for-a-clean-and-fresh-workspace',
      og_title: '5 Tips for a Clean and Fresh Workspace',
      og_type: 'article',
      created_at: new Date().toISOString()
    }
  ];

  return {
    users: [
      {
        id: 'usr-admin',
        username: 'admin',
        passwordHash,
        salt,
        isStaff: true
      }
    ],
    categories: initialCategories,
    blogs: initialBlogs,
    services: initialServices,
    whats_included: initialWhatsIncluded,
    benefits: initialBenefits,
    images: initialImages,
    testimonials: initialTestimonials,
    blacklisted_tokens: []
  };
}

export function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const data = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      return data;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading DB, returning empty schema:', error);
    return getInitialData();
  }
}

export function writeDb(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing DB:', error);
  }
}
