import type { PortableTextBlock } from "@portabletext/types";
import type { Bike, Builder, Issue, MediaAsset, Person, Story } from "@/types/content";

// Representative mock data for the /dev/components catalog only.
// Not the mock CMS service layer (that's Milestones 3-9) — this route
// previews components in isolation, it doesn't simulate page data-fetching.

export const wideImage: MediaAsset = {
  id: "media-wide",
  url: "/placeholders/placeholder-wide.png",
  width: 1600,
  height: 900,
  altText: "Плейсхолдер: широкий кадр мотоцикла",
  caption: "Фото-заглушка",
  copyright: "Builders Magazine",
};

export const portraitImage: MediaAsset = {
  id: "media-portrait",
  url: "/placeholders/placeholder-portrait.png",
  width: 1200,
  height: 1600,
  altText: "Плейсхолдер: портретная обложка",
};

export const squareImage: MediaAsset = {
  id: "media-square",
  url: "/placeholders/placeholder-square.png",
  width: 1200,
  height: 1200,
  altText: "Плейсхолдер: квадратный кадр",
};

export const richTextSample: PortableTextBlock[] = [
  {
    _type: "block",
    _key: "b1",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "s1",
        text: "Пример текста, свёрстанного через Portable Text: заголовки, списки и цитаты рендерятся через компоненты дизайн-системы, а не через сырой HTML.",
      },
    ],
  },
  {
    _type: "block",
    _key: "b2",
    style: "h3",
    children: [{ _type: "span", _key: "s2", text: "Пример подзаголовка" }],
  },
  {
    _type: "block",
    _key: "b3",
    style: "blockquote",
    children: [{ _type: "span", _key: "s3", text: "Пример выделенной цитаты из статьи." }],
  },
  {
    _type: "block",
    _key: "b4",
    style: "normal",
    listItem: "bullet",
    level: 1,
    children: [{ _type: "span", _key: "s4", text: "Первый пункт списка" }],
  },
  {
    _type: "block",
    _key: "b5",
    style: "normal",
    listItem: "bullet",
    level: 1,
    children: [{ _type: "span", _key: "s5", text: "Второй пункт списка" }],
  },
];

export const person: Person = {
  id: "person-1",
  slug: "ivan-petrov",
  name: "Иван Петров",
  role: "Фотограф",
  photo: squareImage,
  bio: richTextSample,
};

export const bike: Bike = {
  id: "bike-1",
  slug: "panhead-chopper",
  name: "Panhead Chopper",
  brand: "Harley-Davidson",
  model: "Panhead",
  year: 1958,
  style: "Chopper",
  engine: "1200cc V-Twin",
  description: richTextSample,
  images: [wideImage, squareImage],
  stories: [],
  issues: [],
};

export const builder: Builder = {
  id: "builder-1",
  slug: "ironhide-garage",
  name: "Ironhide Garage",
  location: "Москва",
  bio: richTextSample,
  projects: [bike],
  stories: [],
};

bike.builder = builder;

export const story: Story = {
  id: "story-1",
  slug: "panhead-chopper-story",
  title: "Панхед-чоппер из гаража Ironhide",
  coverImage: wideImage,
  shortDescription:
    "История постройки классического чоппера на базе Harley-Davidson Panhead 1958 года.",
  content: richTextSample,
  category: "Bike",
  author: person,
  publishedDate: "2026-05-01",
  gallery: [wideImage, squareImage, portraitImage],
  relatedBike: [bike],
  relatedBuilder: [builder],
  status: "published",
};

export const issue: Issue = {
  id: "issue-1",
  slug: "builders-magazine-03",
  number: 3,
  year: 2025,
  title: "Builders Magazine №3",
  coverImage: portraitImage,
  description: richTextSample,
  releaseDate: "2025-11-01",
  buyLinks: [{ label: "Купить", url: "https://example.com/buy" }],
  status: "published",
  featuredStories: [story],
  gallery: [wideImage],
};

export const galleryImages: MediaAsset[] = [wideImage, squareImage, portraitImage];

export const storyCategories = ["Bike", "Builder", "Culture", "Interview", "Event"] as const;
