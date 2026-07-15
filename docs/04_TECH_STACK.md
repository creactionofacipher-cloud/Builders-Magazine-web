# **Technology Stack**

## **Purpose**

This document defines the technical architecture, development standards, and technology stack for the Builders Magazine platform.

The goal is to build a scalable, maintainable, and high-performance digital magazine that can evolve from an MVP into a complete editorial platform.

---

# **Architecture**

The project follows a Headless Architecture.

```text
Browser
        │
        ▼
Next.js Frontend
        │
        ▼
Sanity CMS
        │
        ▼
Image CDN
```

The frontend is completely separated from content management.

All content is delivered through the CMS.

---



# **Core Technologies**



## **Frontend**

Framework:

- Next.js (latest)

Language:

- TypeScript

Rendering:

- App Router
- React Server Components
- Static Generation where possible
- Dynamic Rendering where required

---



## **Styling**

Framework:

- Tailwind CSS

Requirements:

- Utility-first styling
- Responsive layouts
- Reusable UI components
- Design Token approach
- Mobile-first

No inline styles.

No duplicated layouts.

---



## **CMS**

Preferred solution:

Sanity CMS

Requirements:

- Headless
- Draft / Publish
- Relationships
- Rich Text
- Image Management
- Media CDN
- Role Management
- Content Versioning (future)

The website must not depend on hardcoded content.

---



## **Image Management**

Images are a core part of the project.

Requirements:

- CDN delivery
- Responsive images
- Automatic resizing
- Automatic format optimization
- Lazy loading
- Modern formats (WebP / AVIF where supported)

Every image must support:

- Alt text
- Caption
- Credits

---



## **Deployment**

Hosting:

Vercel

Requirements:

- GitHub integration
- Automatic deployment
- Preview deployments
- HTTPS
- Global CDN

---



# **Project Structure**

The application should follow a modular architecture.

```text
site/

├── app/
├── components/
├── cms/
├── lib/
├── types/
├── utils/
├── hooks/
├── public/
└── styles/
```

Each folder has a single responsibility.

---



# **Components**

The UI should be built from reusable components.

Core components:

- Header
- Footer
- Hero
- Section
- Container
- StoryCard
- IssueCard
- BikeCard
- BuilderCard
- Gallery
- ImageGrid
- Search
- Filter
- Button
- Badge

Components should remain independent and reusable.

---



# **Routing**

Use the App Router.

Current routes:

```text
/

/magazine

/magazine/[slug]

/stories

/stories/[slug]

/builders-cup

/builders-cup/[slug]

/buy

/about

/search
```

Future routes:

```text
/bikes

/bikes/[slug]

/builders

/builders/[slug]

/shop

/community
```

---



# **Data Layer**

The application should isolate all CMS communication.

Recommended structure:

```text
cms/

queries/

services/

mappers/

schemas/
```

UI components must never communicate directly with the CMS.

---



# **Type Safety**

Use TypeScript everywhere.

Requirements:

- strict mode
- typed props
- typed CMS models
- typed API responses

Avoid using:

- any
- unknown (unless necessary)

---



# **SEO**

Every public page should support:

- Metadata API
- Open Graph
- Twitter Cards
- Canonical URLs
- Sitemap
- Robots.txt
- Structured Data (JSON-LD)

URLs should remain clean and readable.

---



# **Performance**

Performance is a priority.

Requirements:

- Server Components by default
- Client Components only when required
- Lazy loading
- Optimized images
- Code splitting
- Route-level loading
- Route-level error handling
- Cache where appropriate

Target:

Excellent Core Web Vitals.

---



# **Accessibility**

Minimum requirements:

- semantic HTML
- keyboard navigation
- ARIA labels
- sufficient color contrast
- alt text for images
- accessible forms

Accessibility should be considered from the beginning.

---



# **Internationalization**

The architecture must support:

- Russian
- English

Even if only one language is used in the MVP.

Future structure:

```text
/ru

/en
```

No hardcoded assumptions about language.

Use App Router locale segments.

Although MVP will launch with a single language, the routing structure must already support future localization without changing URLs.

---



# **Analytics**

Use:

Google Analytics 4

Future integrations:

- Google Search Console
- Google Tag Manager
- Microsoft Clarity

Analytics should not negatively affect performance.

---



# **Security**

Requirements:

- Environment Variables
- Protected API Keys
- Role-based CMS Access
- HTTPS Only
- Secure Headers
- Regular Backups

No secrets should be stored in the repository.

---



# **Code Quality**

General principles:

- Clean Architecture
- DRY
- SOLID
- Reusable Components
- Separation of Concerns

Avoid:

- duplicated code
- oversized components
- business logic inside UI components

---



# **Development Workflow**

Development process:

1. Create architecture.
2. Create reusable components.
3. Build layouts.
4. Connect mock data.
5. Integrate CMS.
6. Test responsiveness.
7. Optimize SEO.
8. Optimize performance.
9. Deploy to Vercel.

Every stage should result in a working application.

---



# **Future Scalability**

The architecture should support future features without major refactoring.

Potential future modules:

- Full E-commerce
- Shopping Cart
- Authentication
- User Accounts
- Community
- Newsletter
- Builder Profiles
- Bike Profiles
- Interactive Maps
- Event Registration
- Ticket Sales
- Mobile App API

The MVP should serve as a stable foundation for these future capabilities.

## Architecture Rules

- UI components must never communicate directly with the CMS.
- Pages must never contain GROQ queries.
- All data access must go through the cms/services layer.
- Data returned by the CMS should be mapped to application types before reaching the UI.
- Components must only consume typed application models.



## Search

MVP search should be implemented using Sanity GROQ queries.

Initial search scope:

- Stories

- Issues

- Bikes

- Builders

The MVP search implementation may use simple text matching.

Known MVP limitations:

- no typo tolerance

- no relevance ranking

- no fuzzy search

The architecture must allow future replacement with a dedicated search engine (such as Algolia or Typesense) without requiring changes to UI components or page structure.

