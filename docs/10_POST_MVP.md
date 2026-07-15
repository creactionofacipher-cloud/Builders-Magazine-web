# Builders Magazine

# Post-MVP Development Roadmap

## Purpose

This document describes the long-term evolution of the Builders Magazine platform beyond the initial MVP.

The MVP should remain intentionally simple, but every architectural decision should support future expansion without requiring major refactoring.

The project should evolve into a complete digital platform around Builders Magazine and Builders Cup.

---

# Phase 2 — Content Expansion

After the MVP, the content model should be expanded.

## Bikes

Introduce a dedicated Bikes section.

Routes:

/bikes

/bikes/[slug]

Features:

- complete motorcycle specifications
- image galleries
- related stories
- related builder
- related magazine issues
- related Builders Cup entries

---



## Builders

Introduce dedicated Builder pages.

Routes:

/builders

/builders/[slug]

Features:

- biography
- location
- workshop
- social links
- motorcycle projects
- published stories
- Builders Cup participation

---



## People

Create public pages for photographers, authors and contributors.

Routes:

/people

/people/[slug]

---



# Phase 3 — Shop

Expand the Buy section into a complete ecommerce experience.

Future features:

- shopping cart
- checkout
- payment providers
- order history
- stock management
- product categories
- product search

Possible routes:

/shop

/shop/[category]

/product/[slug]

/cart

/checkout

---



# Phase 4 — Builders Cup Platform

Expand Builders Cup pages.

Future features:

- participant profiles
- motorcycle pages
- judging information
- awards
- interactive galleries
- event schedule
- venue map

---



# Phase 5 — Community

Introduce community functionality.

Possible features:

- newsletter
- saved articles
- favorite bikes
- favorite builders
- user accounts
- comments
- reactions

Possible routes:

/login

/profile

/favorites

---



# Phase 6 — Search

Replace MVP search with a dedicated search engine.

Possible technologies:

- Algolia
- Typesense

Future capabilities:

- typo tolerance
- relevance ranking
- autocomplete
- filters
- faceted search

---



# Phase 7 — Internationalization

Enable multilingual content.

Supported languages:

- English
- Russian

Future architecture should allow adding more languages without changing URLs or page structure.

---



# Phase 8 — Editorial Workflow

Improve CMS capabilities.

Future features:

- preview mode
- scheduled publishing
- content revisions
- editorial roles
- approval workflow

---



# Phase 9 — Performance

Introduce advanced optimizations.

Possible improvements:

- Incremental Static Regeneration
- cache tags
- image focal point support
- CDN optimization
- prefetching

---



# Phase 10 — Analytics

Expand analytics.

Possible integrations:

- Google Analytics 4
- Google Search Console
- Microsoft Clarity
- Plausible

---



# Phase 11 — SEO

Future improvements:

- structured data expansion
- article schema
- event schema
- product schema
- breadcrumb schema

---



# Phase 12 — API

Introduce a public API.

Possible consumers:

- mobile application
- external integrations
- partner websites

REST or GraphQL may be considered depending on future requirements.

---



# Architectural Principle

The MVP must not implement these features.

However, the project architecture should make their future implementation possible without major refactoring.

All reusable components, data models and routing decisions should consider this future evolution.



Create Site Settings singleton in Sanity.