# Database Schema & Entity-Relationship (ER) Diagram

Below is the database schema for the local PostgreSQL database, mapped using Drizzle ORM.

---

## 1. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    users {
        string id PK
        string username
        string password_hash
        string salt
        boolean is_staff
    }
    categories {
        string id PK
        string title
        string description
        string image
    }
    blogs {
        string id PK
        string title
        string featured_image
        string description
        timestamp created_at
        string slug
        string meta_title
        string meta_description
        string meta_keywords
        string og_title
        string og_description
        string og_image
        string og_type
        string twitter_title
        string twitter_description
        string twitter_image
        string twitter_card
        string canonical_url
    }
    blogs_categories {
        string blog_id PK, FK
        string category_id PK, FK
    }
    services {
        string id PK
        string name
        string short_description
        string long_description
        jsonb what_we_offer
        timestamp created_at
        string slug
        string meta_title
        string meta_description
        string meta_keywords
        string og_title
        string og_description
        string og_image
        string og_type
        string twitter_title
        string twitter_description
        string twitter_image
        string twitter_card
        string canonical_url
    }
    whats_included {
        string id PK
        string service_id FK
        string title
        string description
    }
    benefits {
        string id PK
        string service_id FK
        string title
        string description
    }
    service_images {
        string id PK
        string service_id FK
        string image_url
    }
    testimonials {
        string id PK
        string service_id FK
        string author
        string content
        integer rating
    }
    blacklisted_tokens {
        string token PK
        timestamp created_at
    }

    blogs_categories }|..|| blogs : "cascades on delete"
    blogs_categories }|..|| categories : "cascades on delete"
    whats_included }|..|| services : "cascades on delete"
    benefits }|..|| services : "cascades on delete"
    service_images }|..|| services : "cascades on delete"
    testimonials }|..|| services : "cascades on delete"
```

---

## 2. Table Schemas Description

### Users Table

- Stores account details for authentication.
- Field `is_staff` restricts write access (POST, PUT, PATCH, DELETE) to admin accounts.

### Categories Table

- Defines clean categories (e.g. Residential Cleaning, Deep Cleaning).
- Connects to blogs via a many-to-many relationship.

### Blogs & Blogs-Categories Tables

- Stores articles and SEO metadata (inherited from SEOMixin fields).
- Many-to-many join table resolves categories with cascading deletion rules.

### Services Table

- Core catalog table for cleaning services.
- Contains metadata, SEO fields, and a `what_we_offer` JSONB field for custom options.

### whats_included / benefits / service_images / testimonials Tables

- Relational child tables referencing `services.id`.
- Pushing/updating/deleting services cascades and cleans up these records automatically.
