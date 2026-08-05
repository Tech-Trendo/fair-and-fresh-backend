# fair-and-fresh-backend

Backend for **Fair and Fresh** — a professional cleaning services marketplace. Built with **Next.js 16 (App Router)**, **Drizzle ORM**, **Neon PostgreSQL**, **Vercel Blob**, and **Vercel Speed Insights**.

## Features

- **Service catalog** with categories, pricing, and suburb-based availability
- **Blog** with SEO metadata, categories, and rich content
- **Quote/booking** system with contact forms and suburb-specific pricing
- **Admin dashboard** for managing services, blog posts, categories, pages, and suburbs
- **Static map rendering** via Geoapify for service-area visuals
- **File uploads** via Vercel Blob
- **SEO** — dynamic sitemaps, robots.txt, and per-page metadata
- **Authentication** — JWT-based admin auth with token refresh
- **Crawler optimization** — proxy middleware that serves `X-Robots-Tag` headers only to known bots, avoiding internal API round-trips for regular visitors

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Database | Neon PostgreSQL (serverless) |
| ORM | Drizzle ORM |
| Migrations | Drizzle Kit |
| Storage | Vercel Blob |
| Analytics | Vercel Analytics + Speed Insights |
| Maps | Geoapify Static Maps API |
| Styling | Tailwind CSS v4 |
| UI | Radix UI primitives + custom components |

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- A Neon PostgreSQL database (or compatible PostgreSQL)
- A Geoapify API key (free tier: 3,000 requests/day)
- A Vercel Blob store

### Setup

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

3. Run database migrations and seed data:

```bash
npm run build
```

The build pipeline runs Drizzle migrations, seeds the database, and then builds the Next.js app.

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
app/                    # Next.js App Router pages and API routes
  api/                  # API endpoints (blog, services, suburbs, contact, quote, etc.)
  dashboard/            # Admin dashboard pages
  blog/                 # Blog pages
  services/             # Service listing pages
  [suburb]/             # Dynamic suburb pages
  quote/                # Quote/booking page
  contact/              # Contact page
  login/                # Admin login page
  sitemap.xml/          # Dynamic sitemap generator

components/             # React components (UI primitives + page sections)
  ui/                   # Reusable UI components (button, card, dialog, etc.)
  header.tsx            # Site header
  footer.tsx            # Site footer
  hero.tsx              # Hero section
  service-template.tsx  # Service detail page template
  contact-form.tsx      # Contact form component
  before-after-slider.tsx # Before/after image slider

lib/                    # Shared libraries
  schema.ts             # Drizzle ORM table definitions
  db.ts                 # Database connection and query helpers
  auth.ts               # JWT authentication utilities
  jwt.ts                # Token generation and verification
  geoapify.ts           # Geoapify API helpers
  suburb-pricing.ts     # Suburb-based pricing logic
  site-content.ts       # Site-wide content fetchers
  pagination.ts         # Pagination utilities

scripts/                # Build and data scripts
  seed.ts               # Main seed script
  seed-suburbs.ts       # Suburb data seeding
  backfill-home-section.ts # Home page content backfill

public/                 # Static assets (images, SVGs, logos)

drizzle/                # Drizzle migration SQL files
```

## Environment Variables

See [`.env.example`](./.env.example) for the full list of required environment variables.

## Deployment

Deployed on **Vercel**. The build command runs migrations and seeding automatically:

```bash
npx drizzle-kit migrate && npx tsx scripts/seed.ts && next build
```

## License

Private. All rights reserved.

