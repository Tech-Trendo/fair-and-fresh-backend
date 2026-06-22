import { pgTable, text, timestamp, boolean, integer, jsonb, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users Table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  salt: text('salt').notNull(),
  isStaff: boolean('is_staff').default(false).notNull(),
});

// Categories Table
export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  image: text('image'),
  slug: text('slug').unique().notNull(),

  // SEOMixin fields
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  metaKeywords: text('meta_keywords'),
  ogTitle: text('og_title'),
  ogDescription: text('og_description'),
  ogImage: text('og_image'),
  ogType: text('og_type').default('website'),
  twitterTitle: text('twitter_title'),
  twitterDescription: text('twitter_description'),
  twitterImage: text('twitter_image'),
  twitterCard: text('twitter_card').default('summary_large_image'),
  canonicalUrl: text('canonical_url'),
});

// Blogs Table
export const blogs = pgTable('blogs', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  featuredImage: text('featured_image'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  slug: text('slug').unique().notNull(),
  
  // SEOMixin fields
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  metaKeywords: text('meta_keywords'),
  ogTitle: text('og_title'),
  ogDescription: text('og_description'),
  ogImage: text('og_image'),
  ogType: text('og_type').default('article'),
  twitterTitle: text('twitter_title'),
  twitterDescription: text('twitter_description'),
  twitterImage: text('twitter_image'),
  twitterCard: text('twitter_card').default('summary_large_image'),
  canonicalUrl: text('canonical_url'),
});

// Blogs to Categories Join Table (Many-to-Many)
export const blogsCategories = pgTable('blogs_categories', {
  blogId: text('blog_id').references(() => blogs.id, { onDelete: 'cascade' }).notNull(),
  categoryId: text('category_id').references(() => categories.id, { onDelete: 'cascade' }).notNull(),
}, (table) => [
  primaryKey({ columns: [table.blogId, table.categoryId] })
]);

// Services Table
export const services = pgTable('services', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  shortDescription: text('short_description'),
  longDescription: text('long_description'),
  whatWeOffer: jsonb('what_we_offer'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  slug: text('slug').unique().notNull(),

  // SEOMixin fields
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  metaKeywords: text('meta_keywords'),
  ogTitle: text('og_title'),
  ogDescription: text('og_description'),
  ogImage: text('og_image'),
  ogType: text('og_type').default('website'),
  twitterTitle: text('twitter_title'),
  twitterDescription: text('twitter_description'),
  twitterImage: text('twitter_image'),
  twitterCard: text('twitter_card').default('summary_large_image'),
  canonicalUrl: text('canonical_url'),
});

// Whats Included Table (One-to-Many with Service)
export const whatsIncluded = pgTable('whats_included', {
  id: text('id').primaryKey(),
  serviceId: text('service_id').references(() => services.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
});

// Benefits Table (One-to-Many with Service)
export const benefits = pgTable('benefits', {
  id: text('id').primaryKey(),
  serviceId: text('service_id').references(() => services.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
});

// Service Images Table (One-to-Many with Service)
export const serviceImages = pgTable('service_images', {
  id: text('id').primaryKey(),
  serviceId: text('service_id').references(() => services.id, { onDelete: 'cascade' }).notNull(),
  imageUrl: text('image_url').notNull(),
});

// Testimonials Table (One-to-Many with Service)
export const testimonials = pgTable('testimonials', {
  id: text('id').primaryKey(),
  serviceId: text('service_id').references(() => services.id, { onDelete: 'cascade' }).notNull(),
  author: text('author').notNull(),
  content: text('content').notNull(),
  rating: integer('rating').default(5).notNull(),
});

// Blacklisted Tokens Table (JWT token blacklist)
export const blacklistedTokens = pgTable('blacklisted_tokens', {
  token: text('token').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Static Pages SEO Table
export const staticPages = pgTable('static_pages', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),

  // SEOMixin fields
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  metaKeywords: text('meta_keywords'),
  ogTitle: text('og_title'),
  ogDescription: text('og_description'),
  ogImage: text('og_image'),
  ogType: text('og_type').default('website'),
  twitterTitle: text('twitter_title'),
  twitterDescription: text('twitter_description'),
  twitterImage: text('twitter_image'),
  twitterCard: text('twitter_card').default('summary_large_image'),
  canonicalUrl: text('canonical_url'),
});

// --- Relations Definitions ---

export const blogsRelations = relations(blogs, ({ many }) => ({
  blogsCategories: many(blogsCategories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  blogsCategories: many(blogsCategories),
}));

export const blogsCategoriesRelations = relations(blogsCategories, ({ one }) => ({
  blog: one(blogs, {
    fields: [blogsCategories.blogId],
    references: [blogs.id],
  }),
  category: one(categories, {
    fields: [blogsCategories.categoryId],
    references: [categories.id],
  }),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  whatsIncluded: many(whatsIncluded),
  benefits: many(benefits),
  images: many(serviceImages),
  testimonials: many(testimonials),
}));

export const whatsIncludedRelations = relations(whatsIncluded, ({ one }) => ({
  service: one(services, {
    fields: [whatsIncluded.serviceId],
    references: [services.id],
  }),
}));

export const benefitsRelations = relations(benefits, ({ one }) => ({
  service: one(services, {
    fields: [benefits.serviceId],
    references: [services.id],
  }),
}));

export const serviceImagesRelations = relations(serviceImages, ({ one }) => ({
  service: one(services, {
    fields: [serviceImages.serviceId],
    references: [services.id],
  }),
}));

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  service: one(services, {
    fields: [testimonials.serviceId],
    references: [services.id],
  }),
}));
