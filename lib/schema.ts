import { pgTable, text, timestamp, boolean, integer, jsonb, primaryKey, serial, varchar, decimal, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users Table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  salt: text('salt').notNull(),
  isStaff: boolean('is_staff').default(false).notNull(),
});

// Blog Categories Table
export const blogCategories = pgTable('blog_categories', {
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
  metaRobots: text('meta_robots'),
});

// Service Categories Table
export const serviceCategories = pgTable('service_categories', {
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
  metaRobots: text('meta_robots'),
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
  metaRobots: text('meta_robots'),
});

// Blogs to Categories Join Table (Many-to-Many)
export const blogsCategories = pgTable('blogs_categories', {
  blogId: text('blog_id').references(() => blogs.id, { onDelete: 'cascade' }).notNull(),
  categoryId: text('category_id').references(() => blogCategories.id, { onDelete: 'cascade' }).notNull(),
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
  icon: text('icon'),
  sortOrder: integer('sort_order').default(0).notNull(),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }), // null = no price published; suburb pricing = basePrice * suburb.priceMultiplier

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
  metaRobots: text('meta_robots'),
});

// Services to Categories Join Table (Many-to-Many)
export const servicesCategories = pgTable('services_categories', {
  serviceId: text('service_id').references(() => services.id, { onDelete: 'cascade' }).notNull(),
  categoryId: text('category_id').references(() => serviceCategories.id, { onDelete: 'cascade' }).notNull(),
}, (table) => [
  primaryKey({ columns: [table.serviceId, table.categoryId] })
]);

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

// Service Types Table (One-to-Many with Service)
export const serviceTypes = pgTable('service_types', {
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
  metaRobots: text('meta_robots'),
});

// Contact Messages Table
export const contactMessages = pgTable('contact_messages', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject'),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  isRead: boolean('is_read').default(false).notNull(),
});

// Before & After Images Table
export const beforeAfterImages = pgTable('before_after_images', {
  id: text('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  caption: text('caption'),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Site Content Table (CMS - editable content for pages and global settings)
export const siteContent = pgTable('site_content', {
  id: text('id').primaryKey(),
  key: text('key').unique().notNull(),
  value: text('value').notNull(),
  label: text('label').notNull(),
  group: text('group').notNull(),
  type: text('type').default('text').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Availability Table (closed dates & unavailable time slots)
export const availability = pgTable('availability', {
  id: text('id').primaryKey(),
  date: text('date'), // YYYY-MM-DD, null for recurring
  startTime: text('start_time'), // HH:mm
  endTime: text('end_time'), // HH:mm
  type: text('type').notNull(), // 'closed_date', 'unavailable_slot'
  reason: text('reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Quotation Requests Table
export const quotationRequests = pgTable('quotation_requests', {
  id: text('id').primaryKey(),
  services: jsonb('services').$type<string[]>().notNull(),
  preferredDate: text('preferred_date'),
  preferredTime: text('preferred_time'),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  street: text('street').notNull(),
  city: text('city').notNull(),
  additionalNotes: text('additional_notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  status: text('status').default('Pending').notNull(),
});


// Suburbs Table (programmatic suburb landing page network)
export const suburbs = pgTable('suburbs', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  region: varchar('region', { length: 50 }).notNull(), // e.g. 'brisbane-north', 'gold-coast'
  regionType: varchar('region_type', { length: 30 }).notNull(), // 'inner-city' | 'coastal' | 'outer-suburban' — drives copy-block selection
  postcode: varchar('postcode', { length: 10 }),
  lat: decimal('lat', { precision: 9, scale: 6 }),
  lng: decimal('lng', { precision: 9, scale: 6 }),
  travelTimeMins: integer('travel_time_mins'),
  localLandmark: text('local_landmark'),
  priceMultiplier: decimal('price_multiplier', { precision: 4, scale: 2 }).default('1.00').notNull(),
  metaDescription: text('meta_description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Suburb Testimonials Join Table (links suburbs to existing testimonials — review content is NOT duplicated)
export const suburbTestimonials = pgTable(
  'suburb_testimonials',
  {
    id: serial('id').primaryKey(),
    suburbId: integer('suburb_id').references(() => suburbs.id, { onDelete: 'cascade' }).notNull(),
    reviewId: text('review_id').references(() => testimonials.id, { onDelete: 'cascade' }).notNull(), // testimonials is the existing 'reviews' table
  },
  (table) => [
    uniqueIndex('suburb_testimonials_suburb_review_unique').on(table.suburbId, table.reviewId),
  ]
);

// Suburb Service Pricing Overrides Table (null = base price * priceMultiplier)
export const suburbServicePricing = pgTable(
  'suburb_service_pricing',
  {
    id: serial('id').primaryKey(),
    suburbId: integer('suburb_id').references(() => suburbs.id, { onDelete: 'cascade' }).notNull(),
    serviceId: text('service_id').references(() => services.id, { onDelete: 'cascade' }).notNull(),
    priceOverride: decimal('price_override', { precision: 10, scale: 2 }),
  },
  (table) => [
    uniqueIndex('suburb_service_pricing_suburb_service_unique').on(table.suburbId, table.serviceId),
  ]
);

// Suburb Copy Blocks Table (regionType-driven content pools for rotation)
export const suburbCopyBlocks = pgTable('suburb_copy_blocks', {
  id: serial('id').primaryKey(),
  regionType: varchar('region_type', { length: 30 }).notNull(), // matches suburbs.regionType
  blockType: varchar('block_type', { length: 30 }).notNull(), // 'intro' | 'local-detail' | 'faq-question' | 'faq-answer'
  content: text('content').notNull(),
});

// Combo Page Targets Table (curated service x suburb combo pages — NOT a full matrix)
export const comboPageTargets = pgTable(
  'combo_page_targets',
  {
    id: serial('id').primaryKey(),
    serviceId: text('service_id').references(() => services.id, { onDelete: 'cascade' }).notNull(),
    suburbId: integer('suburb_id').references(() => suburbs.id, { onDelete: 'cascade' }).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    uniqueIndex('combo_page_targets_service_suburb_unique').on(table.serviceId, table.suburbId),
  ]
);

// --- Relations Definitions ---

export const blogsRelations = relations(blogs, ({ many }) => ({
  blogsCategories: many(blogsCategories),
}));

export const blogCategoriesRelations = relations(blogCategories, ({ many }) => ({
  blogsCategories: many(blogsCategories),
}));

export const serviceCategoriesRelations = relations(serviceCategories, ({ many }) => ({
  servicesCategories: many(servicesCategories),
}));

export const blogsCategoriesRelations = relations(blogsCategories, ({ one }) => ({
  blog: one(blogs, {
    fields: [blogsCategories.blogId],
    references: [blogs.id],
  }),
  category: one(blogCategories, {
    fields: [blogsCategories.categoryId],
    references: [blogCategories.id],
  }),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  whatsIncluded: many(whatsIncluded),
  benefits: many(benefits),
  serviceTypes: many(serviceTypes),
  images: many(serviceImages),
  testimonials: many(testimonials),
  servicesCategories: many(servicesCategories),
  suburbServicePricing: many(suburbServicePricing),
  comboPageTargets: many(comboPageTargets),
}));

export const servicesCategoriesRelations = relations(servicesCategories, ({ one }) => ({
  service: one(services, {
    fields: [servicesCategories.serviceId],
    references: [services.id],
  }),
  category: one(serviceCategories, {
    fields: [servicesCategories.categoryId],
    references: [serviceCategories.id],
  }),
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

export const serviceTypesRelations = relations(serviceTypes, ({ one }) => ({
  service: one(services, {
    fields: [serviceTypes.serviceId],
    references: [services.id],
  }),
}));

export const serviceImagesRelations = relations(serviceImages, ({ one }) => ({
  service: one(services, {
    fields: [serviceImages.serviceId],
    references: [services.id],
  }),
}));

export const testimonialsRelations = relations(testimonials, ({ one, many }) => ({
  service: one(services, {
    fields: [testimonials.serviceId],
    references: [services.id],
  }),
  suburbTestimonials: many(suburbTestimonials),
}));

export const suburbsRelations = relations(suburbs, ({ many }) => ({
  suburbTestimonials: many(suburbTestimonials),
  suburbServicePricing: many(suburbServicePricing),
  comboPageTargets: many(comboPageTargets),
}));

export const suburbTestimonialsRelations = relations(suburbTestimonials, ({ one }) => ({
  suburb: one(suburbs, {
    fields: [suburbTestimonials.suburbId],
    references: [suburbs.id],
  }),
  review: one(testimonials, {
    fields: [suburbTestimonials.reviewId],
    references: [testimonials.id],
  }),
}));

export const suburbServicePricingRelations = relations(suburbServicePricing, ({ one }) => ({
  suburb: one(suburbs, {
    fields: [suburbServicePricing.suburbId],
    references: [suburbs.id],
  }),
  service: one(services, {
    fields: [suburbServicePricing.serviceId],
    references: [services.id],
  }),
}));

export const comboPageTargetsRelations = relations(comboPageTargets, ({ one }) => ({
  service: one(services, {
    fields: [comboPageTargets.serviceId],
    references: [services.id],
  }),
  suburb: one(suburbs, {
    fields: [comboPageTargets.suburbId],
    references: [suburbs.id],
  }),
}));
