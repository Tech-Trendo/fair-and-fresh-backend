# BACKEND_DESCRIPTION_FAF

## Project Overview

The **Fair and Fresh** backend is a Django 6.0 based REST API that powers a cleaning‑service marketplace. It provides CRUD endpoints for blogs, service listings, categories, and SEO metadata. The API uses **Django REST Framework (DRF)** with **SimpleJWT** for token‑based authentication and **drf‑spectacular** for OpenAPI schema generation.

---

## High‑Level Architecture

```
Fair and Fresh Backend (Django)
│
├─ fair_and_fresh_cleaning/        # Project settings & core files (settings, urls, wsgi, asgi)
├─ blog/                           # Blog app (models, serializers, viewsets, urls)
├─ category/                       # Category app (models, serializers, viewsets, urls)
├─ services/                       # Service catalog app (models, serializers, viewsets, urls)
├─ seo_mixin/                      # Reusable SEO fields mixin (models, views)
├─ pagination.py                   # Custom pagination class
├─ requirements.txt                # Python dependencies
└─ manage.py                       # Django management entry point
```

---

## Django Settings (`fair_and_fresh_cleaning/settings.py`)

- **Installed Apps**
  - Core Django apps (`admin`, `auth`, `sessions`, `messages`, `staticfiles`)
  - Third‑party: `drf_spectacular`, `seo_mixin`, `services`, `category`, `ckeditor`, `rest_framework_simplejwt`, `rest_framework_simplejwt.token_blacklist`
- **Middleware** – Standard security, session, CSRF, auth, messages, clickjacking.
- **Database** – SQLite (`db.sqlite3`).
- **Static & Media**
  - `STATIC_URL = 'static/'`
  - `MEDIA_ROOT = BASE_DIR / 'media'`
  - `MEDIA_URL = '/media/'`
- **REST Framework** – JWT authentication only.
  ```python
  REST_FRAMEWORK = {
      'DEFAULT_AUTHENTICATION_CLASSES': (
          'rest_framework_simplejwt.authentication.JWTAuthentication',
      )
  }
  ```
- **SimpleJWT Settings** – 5 min access token, 1 day refresh token, rotating refresh tokens, blacklist enabled.
- **OpenAPI (drf‑spectacular)** – Basic title/description; schema served via the default endpoint.
- **Allowed Hosts** – `['192.168.100.133', 'localhost']`
- **Debug** – `True` (development); should be switched off for production.

---

## Apps Overview

### 1. `blog`

- **Model (`blog/models.py`)**
  ```python
  class Blog(SEOMixin):
      title = models.CharField(max_length=250)
      category = models.ManyToManyField(Category, related_name="categories")
      featured_image = models.ImageField(upload_to="blog_featured_image")
      description = RichTextField(blank=True, null=True)
  ```
- **Serializer (`blog/serializers.py`)** – `ModelSerializer` exposing all fields.
- **ViewSet (`blog/views.py`)** – `ModelViewSet` with `IsAdminUser` permission.
- **URLs (`blog/urls.py`)** – Registered with a `DefaultRouter` under the `blog/` prefix.

### 2. `category`

- **Model (`category/models.py`)**
  ```python
  class Category(models.Model):
      title = models.CharField(max_length=250, null=True, blank=True)
      description = models.TextField(null=True, blank=True)
      image = models.ImageField(upload_to="category_image/", null=True, blank=True)
  ```
- **Serializer (`category/serializers.py`)** – `ModelSerializer` for all fields.
- **ViewSet (`category/views.py` – not shown but follows same pattern as Blog)**
- **URLs (`category/urls.py`)** – Registered under `category/`.

### 3. `services`

- **Models (`services/models.py`)**
  - `Services` (inherits `SEOMixin`) – fields: `name`, `short_description`, `long_description`, `what_we_offer` (JSONField).
  - `WhatsIncluded`, `Benefits`, `Images`, `Testimonial` – each linked via `ForeignKey` to `Services`.
- **Serializers (`services/serializers.py`)** – Separate `ModelSerializer`s for each model, all fields exposed.
- **ViewSets (`services/views.py` – not displayed but analogous to Blog)**
- **URLs (`services/urls.py` – similar pattern)**

### 4. `seo_mixin`

- **Model (`seo_mixin/models.py`)** – Abstract model providing SEO‑related fields:
  - `meta_title`, `meta_description`, `meta_keywords`
  - `slug` (auto‑generated on `save` if missing, using `title` or `name`)
  - Open Graph fields (`og_*`), Twitter Card fields (`twitter_*`), `canonical_url`
- Intended to be inherited by content models (Blog, Services, etc.).

---

## Pagination (`pagination.py`)

```python
class StandardPagination(PageNumberPagination):
    page_size = 10
    max_page_size = 100
    page_size_query_param = "page_size"
    page_query_param = "page"
```

All viewsets use this pagination class implicitly via DRF settings (if configured) or can be set per‑view.

---

## Authentication & Permissions

- **Authentication** – JWT via `rest_framework_simplejwt`. Endpoints provided by the package (`/api/token/`, `/api/token/refresh/`).
- **Permissions** – Example: `BlogViewset` restricts access to admin users (`IsAdminUser`). Other viewsets follow the same pattern unless overridden.
- **Token Blacklisting** – Enabled via `rest_framework_simplejwt.token_blacklist` for revoking refresh tokens.

---

## Third‑Party Integrations

- **CKEditor** – Rich‑text editor for `Blog.description` (`RichTextField`).
- **drf‑spectacular** – Generates OpenAPI documentation at `/api/schema/` (default). Configured in `SPECTACULAR_SETTINGS`.
- **SEO Mixin** – Centralizes SEO metadata across content models.

---

## Testing

- Each app contains a minimal `tests.py` (placeholder). Test coverage can be expanded using Django's `TestCase` and DRF's `APIClient`.

---

## Deployment Considerations

1. **Environment Variables** – Secret key, database URL, and allowed hosts should be moved to env vars for production.
2. **Static Files** – Run `python manage.py collectstatic` during deployment.
3. **WSGI/ASGI** – Entry points are `fair_and_fresh_cleaning/wsgi.py` and `asgi.py`.
4. **Media** – Served via a dedicated media server or cloud storage in production.
5. **Database** – Replace SQLite with PostgreSQL/MySQL for scalability; update `DATABASES` accordingly.
6. **CORS** – If a separate Next.js frontend will consume the API, configure CORS middleware (e.g., `django-cors-headers`).

---

## Mapping to a Next.js Frontend

- **Base URL** – The Next.js app should target the Django API root (`/api/` or custom router prefixes).
- **Authentication Flow** – Store JWT access token in an HTTP‑only cookie or local storage; refresh using `/api/token/refresh/`.
- **Data Fetching** – Use `fetch` or `axios` with the `Authorization: Bearer <token>` header.
- **OpenAPI Integration** – Optionally generate TypeScript client code from the drf‑spectacular schema.

---

## OpenAPI Schema (drf‑spectacular)

The schema includes endpoints for:

- `/blog/` – CRUD for blog posts.
- `/category/` – CRUD for categories.
- `/services/` – CRUD for services and related nested resources.
- `/api/token/` – Obtain JWT pair.
- `/api/token/refresh/` – Refresh access token.
- `/api/schema/` – OpenAPI JSON/YAML.

---

## Summary

The backend provides a modular, RESTful API with reusable SEO fields, JWT authentication, and admin‑only write access. It is ready to be consumed by a modern Next.js client, with clear extension points for CORS, production database migration, and enhanced documentation.

---

_Generated by Antigravity on 2026‑06‑21._
