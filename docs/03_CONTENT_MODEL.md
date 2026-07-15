# **Content Model**

## **Purpose**

This document defines the content architecture of Builders Magazine.

The website is built around a headless CMS where every piece of content is represented as an entity with relationships to other entities.

The goal is to make all content reusable, searchable, and interconnected.

---

# **Content Architecture**

The MVP consists of the following content types:

- Issue
- Story
- Bike
- Builder
- Builders Cup
- Person
- Media Asset
- Product

All entities should support future expansion without breaking existing content.

---

# **Entity: Issue**

Represents a printed magazine issue.

## **Fields**


| **Field**       | **Type**          |
| --------------- | ----------------- |
| id              | string            |
| number          | number            |
| year            | number            |
| title           | string            |
| slug            | string            |
| coverImage      | Media Asset       |
| description     | rich text         |
| releaseDate     | date              |
| advertisers     | array             |
| buyLinks        | array             |
| status          | draft / published |
| featuredStories | Story[]           |
| gallery         | Media Asset[]     |




## **Relationships**

Issue → Stories

Issue → Media Assets

Future:

Issue → Products

Issue → Downloads

---



# **Entity: Story**

Represents editorial content published on the website.

Stories are independent from the printed magazine but may optionally reference one.

## **Fields**


| **Field**        | **Type**      |
| ---------------- | ------------- |
| id               | string        |
| title            | string        |
| slug             | string        |
| coverImage       | Media Asset   |
| shortDescription | string        |
| content          | rich text     |
| category         | enum          |
| author           | Person        |
| publishedDate    | date          |
| issue            | Issue         |
| gallery          | Media Asset[] |
| relatedBike      | Bike[]        |
| relatedBuilder   | Builder[]     |




## **Categories**

- Bike
- Builder
- Culture
- Interview
- Event



## **Relationships**

Story → Bike

Story → Builder

Story → Issue

Story → Media

Future:

Story → Tags

Story → Related Stories

Story → Products

---



# **Entity: Bike**

Represents a motorcycle project.

A bike can appear in multiple stories and multiple magazine issues.

## **Fields**


| **Field**      | **Type**      |
| -------------- | ------------- |
| id             | string        |
| name           | string        |
| brand          | string        |
| model          | string        |
| year           | number        |
| style          | string        |
| engine         | string        |
| description    | rich text     |
| specifications | object        |
| images         | Media Asset[] |
| builder        | Builder       |
| stories        | Story[]       |
| issues         | Issue[]       |




## **Relationships**

Bike → Builder

Bike → Stories

Bike → Issues

Bike → Media Assets

Future:

Bike → Awards

Bike → Videos

Bike → Location

---



# **Entity: Builder**

Represents a motorcycle builder or workshop.

## **Fields**


| **Field**   | **Type**  |
| ----------- | --------- |
| id          | string    |
| name        | string    |
| location    | string    |
| bio         | rich text |
| socialLinks | object    |
| projects    | Bike[]    |
| stories     | Story[]   |




## **Relationships**

Builder → Bikes

Builder → Stories

Future:

Builder → Workshop

Builder → Awards

Builder → Events

---



# **Entity: Builders Cup**

Represents one Builders Cup event.

## **Fields**


| **Field**    | **Type**      |
| ------------ | ------------- |
| id           | string        |
| name         | string        |
| date         | date          |
| location     | string        |
| description  | rich text     |
| coverImage   | Media Asset   |
| gallery      | Media Asset[] |
| participants | Bike[]        |
| winners      | Bike[]        |
| stories      | Story[]       |




## **Relationships**

Builders Cup → Bikes

Builders Cup → Stories

Builders Cup → Media Assets

Future:

Builders Cup → Tickets

Builders Cup → Sponsors

Builders Cup → Judges

---



# **Entity: Person**

Represents a contributor.

Examples:

- photographer
- author
- editor
- organizer



## **Fields**


| **Field** | **Type**    |
| --------- | ----------- |
| id        | string      |
| slug      | string      |
| name      | string      |
| role      | string      |
| photo     | Media Asset |
| bio       | rich text   |
| articles  | Story[]     |




## **Relationships**

Person → Stories

Future:

Person → Social Links

Person → Team

---



# **Entity: Media Asset**

Represents an image or media file.

Every uploaded image should be reusable.

## **Fields**


| **Field**     | **Type**  |
| ------------- | --------- |
| id            | string    |
| file          | image     |
| caption       | string    |
| author        | Person    |
| copyright     | string    |
| altText       | string    |
| relatedObject | reference |


Future:

- focal point
- EXIF metadata
- image credits

---



# **Entity: Product**

Represents a merchandise item available for purchase through the Buy section.

MVP scope is catalog presentation only. There is no cart, checkout, payment, or stock management — every product links out to an external purchase URL (see Post-MVP Roadmap, Phase 3 — Shop).

## **Fields**


| **Field**        | **Type**           |
| ----------------- | ------------------ |
| id                | string              |
| slug              | string              |
| name              | string              |
| shortDescription  | string              |
| description       | rich text           |
| mainImage         | Media Asset         |
| gallery           | Media Asset[]       |
| price             | number              |
| currency          | string              |
| sizes             | array               |
| materials         | string              |
| externalBuyUrl    | string              |
| status            | draft / published   |




## **Relationships**

Product has no relationships to other entities in the current implementation — it is a standalone catalog entity.

Future:

Product → Issue

---



# **Entity Relationships**

```text
Issue
│
├── Story
│     │
│     ├── Bike
│     │      │
│     │      └── Builder
│     │
│     ├── Person
│     │
│     └── Media
│
└── Media


Builders Cup
│
├── Bike
├── Story
└── Media
```

---



# **Slug Strategy**

All public entities should use human-readable slugs.

Examples:

```text
builders-magazine-03

panhead-chopper

john-doe-customs

builders-cup-2025

builders-tshirt
```

Slugs must be unique.

---



# **Media Strategy**

Images are first-class content.

Every image should support:

- responsive sizes
- alt text
- captions
- author credits
- reuse across multiple entities

Images should never be duplicated unnecessarily.

---



# **Draft & Publish Workflow**

All editable entities should support:

- Draft
- Published

Future:

- Scheduled publishing
- Revision history
- Content approval workflow

---



# **Scalability**

The content model is designed for long-term growth.

Future entities may include:

- Workshop
- Partner
- Sponsor
- Video
- Newsletter
- Event
- Tag

These additions should integrate with the existing relationship model without requiring structural changes.



## Site Settings

- siteTitle
- siteDescription
- mission
- philosophy
- contacts
- cooperation
- socialLinks[]
- defaultSEO
- footerText

