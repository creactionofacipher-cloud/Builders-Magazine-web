# **Site Structure**

## **Purpose**

This document describes the information architecture of the Builders Magazine website.

The goal is to create a scalable structure that supports the MVP while allowing future expansion without changing the navigation model.

---

# **Navigation**

The primary navigation consists of:

- Home
- Magazine
- Stories
- Builders Cup
- Buy
- About
- Search

Future versions may include:

- Bikes
- Builders
- Shop
- Community

---

# **Sitemap**

```
/
│
├── Magazine
│   ├── /magazine
│   └── /magazine/[slug]
│
├── Stories
│   ├── /stories
│   └── /stories/[slug]
│
├── Builders Cup
│   ├── /builders-cup
│   └── /builders-cup/[slug]
│
├── Buy
│   ├── /buy
│   ├── /buy/magazine
│   └── /buy/merchandise
│
├── About
│   └── /about
│
└── Search
    └── /search
```

---



# **Home Page**

Route:

```
/
```

Purpose:

The homepage introduces Builders Magazine and highlights the latest content.

Main sections:

- Hero
- Current Issue
- Featured Stories
- Latest Builders Cup
- Featured Content
- Newsletter (future)
- Footer

---



# **Magazine**

Route:

```
/magazine
```

Purpose:

Archive of printed issues.

Displays:

- cover
- issue number
- release year
- short description
- purchase button

---



# **Issue Page**

Route:

```
/magazine/[slug]
```

Contains:

- Cover
- Title
- Description
- Release Date
- Contents
- Featured Stories
- Gallery
- Purchase Links

Future additions:

- Digital preview
- Related stories
- Related bikes

---



# **Stories**

Route:

```
/stories
```

Purpose:

Digital editorial content.

Available filters:

- Bike
- Builder
- Culture
- Interview
- Event

Display:

- cover image
- title
- excerpt
- category
- publication date

---



# **Story Page**

Route:

```
/stories/[slug]
```

Contains:

- Hero Image
- Title
- Description
- Full Article
- Gallery
- Related Bike
- Related Builder
- Related Stories

Future additions:

- Tags
- Share buttons
- Reading progress

---



# **Builders Cup**

Route:

```
/builders-cup
```

Purpose:

Official Builders Cup section.

Displays:

- latest event
- previous events
- featured projects
- announcement

Future:

- registration
- tickets

---



# **Builders Cup Event**

Route:

```
/builders-cup/[slug]
```

Contains:

- cover
- description
- date
- location
- participants
- winners
- gallery
- related stories

---



# **Buy**

Route:

```
/buy
```

Purpose:

Simple landing page for products.

MVP includes:

- Magazine
- Merchandise

Future:

- full online shop
- shopping cart
- checkout
- payments

---



# **About**

Route:

```
/about
```

Contains:

- About Builders Magazine
- Philosophy
- Crew
- Partners
- Contacts
- Cooperation

Future:

- timeline
- press kit
- media resources

---



# **Search**

Route:

```
/search
```

Searches:

- Stories
- Issues
- Bikes
- Builders

Future:

- full-text search
- filters
- search suggestions

---



# **Future Sections**

These sections are planned but are outside the MVP.

## **Bikes**

```
/bikes
/bikes/[slug]
```

Each motorcycle will have its own dedicated page.

---



## **Builders**

```
/builders
/builders/[slug]
```

Each builder will have a profile page.

---



## **Shop**

```
/shop
```

Complete e-commerce experience.

---



## **Community**

Future platform features:

- user accounts
- saved articles
- comments
- event registration
- builder directory

---



# **User Navigation Principles**

Navigation should follow several principles:

- Maximum two clicks to reach any primary content.
- Consistent navigation across all pages.
- Editorial content always has priority.
- Large visual previews.
- Mobile-first navigation.
- Fast access to current magazine issue.

---



# **URL Structure**

Readable, SEO-friendly URLs.

Examples:

```
/

/magazine

/magazine/builders-magazine-03

/stories/panhead-chopper

/builders-cup/builders-cup-2025

/about

/search
```

---



# **Scalability**

The structure must support future expansion without changing existing URLs.

New sections should be added as independent modules while preserving the overall navigation and information architecture.