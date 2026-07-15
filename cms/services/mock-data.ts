import type { PortableTextBlock } from "@portabletext/types";
import type { Bike, Builder, BuildersCup, Issue, MediaAsset, Person, Story } from "@/types/content";

// Placeholder fixtures standing in for Sanity content until Milestone 10
// (CMS Integration). Only cms/services/*.ts files should import this —
// pages consume the named service functions (getFeaturedStories, etc.),
// never this file directly.

function paragraph(key: string, text: string): PortableTextBlock {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    children: [{ _type: "span", _key: `${key}-s`, text }],
  };
}

const wideImage: MediaAsset = {
  id: "media-wide",
  url: "/placeholders/placeholder-wide.png",
  width: 1600,
  height: 900,
  altText: "Плейсхолдер: широкий кадр мотоцикла",
  copyright: "Builders Magazine",
};

const portraitImage: MediaAsset = {
  id: "media-portrait",
  url: "/placeholders/placeholder-portrait.png",
  width: 1200,
  height: 1600,
  altText: "Плейсхолдер: портретная обложка",
};

const squareImage: MediaAsset = {
  id: "media-square",
  url: "/placeholders/placeholder-square.png",
  width: 1200,
  height: 1200,
  altText: "Плейсхолдер: квадратный кадр",
};

const author: Person = {
  id: "person-maria",
  slug: "maria-sokolova",
  name: "Мария Соколова",
  role: "Автор",
  photo: squareImage,
};

const bike: Bike = {
  id: "bike-panhead",
  slug: "panhead-chopper",
  name: "Panhead Chopper",
  brand: "Harley-Davidson",
  model: "Panhead",
  year: 1958,
  style: "Chopper",
  images: [wideImage, squareImage],
};

const builder: Builder = {
  id: "builder-ironhide",
  slug: "ironhide-garage",
  name: "Ironhide Garage",
  location: "Москва",
  projects: [bike],
};

bike.builder = builder;

export const mockStories: Story[] = [
  {
    id: "story-panhead",
    slug: "panhead-chopper-story",
    title: "Панхед-чоппер из гаража Ironhide",
    coverImage: wideImage,
    shortDescription:
      "История постройки классического чоппера на базе Harley-Davidson Panhead 1958 года.",
    content: [paragraph("story-panhead-p1", "Полный текст истории появится после интеграции CMS.")],
    category: "Bike",
    author,
    publishedDate: "2026-05-01",
    relatedBike: [bike],
    relatedBuilder: [builder],
    status: "published",
  },
  {
    id: "story-ironhide-philosophy",
    slug: "ironhide-garage-philosophy",
    title: "Мастерская Ironhide: философия ручной сборки",
    coverImage: squareImage,
    shortDescription: "Почему в Ironhide Garage принципиально не используют серийные детали.",
    content: [paragraph("story-ironhide-p1", "Полный текст появится после интеграции CMS.")],
    category: "Builder",
    author,
    publishedDate: "2026-04-20",
    relatedBuilder: [builder],
    status: "published",
  },
  {
    id: "story-chopper-culture",
    slug: "chopper-culture-roots",
    title: "Кастом-байки и дух свободы: как зародилась культура чопперов",
    coverImage: wideImage,
    shortDescription: "От послевоенной Калифорнии до сегодняшних гаражных мастерских.",
    content: [paragraph("story-culture-p1", "Полный текст появится после интеграции CMS.")],
    category: "Culture",
    author,
    publishedDate: "2026-03-15",
    status: "published",
  },
  {
    id: "story-interview-ironhide",
    slug: "interview-ironhide-founder",
    title: "Интервью с основателем Ironhide Garage",
    coverImage: portraitImage,
    shortDescription: "Разговор о первых заказах, ошибках и том, что держит мастерскую на плаву.",
    content: [paragraph("story-interview-p1", "Полный текст появится после интеграции CMS.")],
    category: "Interview",
    author,
    publishedDate: "2026-02-10",
    relatedBuilder: [builder],
    status: "published",
  },
  {
    id: "story-builders-cup-recap",
    slug: "builders-cup-2025-recap",
    title: "Как прошёл Builders Cup 2025",
    coverImage: wideImage,
    shortDescription: "Атмосфера, участники и главные впечатления с прошедшего слёта.",
    content: [paragraph("story-recap-p1", "Полный текст появится после интеграции CMS.")],
    category: "Event",
    author,
    publishedDate: "2026-01-25",
    status: "published",
  },
  {
    id: "story-caucasus-trip",
    slug: "caucasus-motorcycle-trip",
    title: "Мотопутешествие через Кавказ",
    coverImage: squareImage,
    shortDescription: "Две тысячи километров, три перевала и один старый Panhead.",
    content: [paragraph("story-trip-p1", "Полный текст появится после интеграции CMS.")],
    category: "Culture",
    author,
    publishedDate: "2026-01-05",
    relatedBike: [bike],
    status: "published",
  },
];

export const mockIssues: Issue[] = [
  {
    id: "issue-3",
    slug: "builders-magazine-03",
    number: 3,
    year: 2025,
    title: "Builders Magazine №3",
    coverImage: portraitImage,
    description: [
      paragraph(
        "issue-3-p1",
        "Третий номер журнала посвящён мастерским, которые строят мотоциклы вручную — от рамы до последней гайки.",
      ),
    ],
    releaseDate: "2025-11-01",
    buyLinks: [
      { label: "Купить на сайте", url: "https://example.com/buy/issue-03" },
      { label: "Купить в фирменном магазине", url: "https://example.com/shop/issue-03" },
    ],
    status: "published",
    featuredStories: [mockStories[0], mockStories[1], mockStories[3]],
    gallery: [wideImage, squareImage],
  },
  {
    id: "issue-2",
    slug: "builders-magazine-02",
    number: 2,
    year: 2025,
    title: "Builders Magazine №2",
    coverImage: squareImage,
    description: [
      paragraph(
        "issue-2-p1",
        "Во втором номере — репортаж с Builders Cup, мотопутешествие через Кавказ и разговор о культуре чопперов.",
      ),
    ],
    releaseDate: "2025-06-01",
    buyLinks: [{ label: "Купить на сайте", url: "https://example.com/buy/issue-02" }],
    status: "published",
    featuredStories: [mockStories[4], mockStories[5], mockStories[2]],
    gallery: [wideImage],
  },
  {
    id: "issue-1",
    slug: "builders-magazine-01",
    number: 1,
    year: 2024,
    title: "Builders Magazine №1",
    coverImage: wideImage,
    description: [
      paragraph(
        "issue-1-p1",
        "Первый номер Builders Magazine: с чего началась история независимого журнала о кастомных мотоциклах.",
      ),
    ],
    releaseDate: "2024-10-01",
    buyLinks: [{ label: "Купить на сайте", url: "https://example.com/buy/issue-01" }],
    status: "published",
    featuredStories: [mockStories[0], mockStories[2]],
  },
];

export const mockBuildersCupEvents: BuildersCup[] = [
  {
    id: "builders-cup-2025",
    slug: "builders-cup-2025",
    name: "Builders Cup 2025",
    date: "2025-09-06",
    location: "Москва",
    description: [
      paragraph(
        "bc-2025-p1",
        "Ежегодный слёт кастом-байкеров: конкурс построек, живая музыка и мастерские под открытым небом.",
      ),
    ],
    coverImage: wideImage,
    participants: [bike],
    winners: [bike],
  },
];
