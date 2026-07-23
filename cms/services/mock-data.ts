import type { PortableTextBlock } from "@portabletext/types";
import type {
  Bike,
  Builder,
  BuildersCup,
  HomePage,
  Issue,
  LandingPage,
  LayoutBlock,
  MediaAsset,
  Person,
  Product,
  RichText,
  SiteSettings,
  SocialPost,
  Story,
} from "@/types/content";

// Placeholder fixtures standing in for Sanity content until Milestone 10
// (CMS Integration). Only cms/services/*.ts files should import this —
// pages consume the named service functions (getStories, getMerchandise,
// etc.), never this file directly.

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
  groups: ["Team"],
};

const editorInChief: Person = {
  id: "person-aleksei",
  slug: "aleksei-volkov",
  name: "Алексей Волков",
  role: "Главный редактор",
  photo: squareImage,
  groups: ["Team"],
};

// Belongs to both blocks at once — demonstrates that group membership
// isn't exclusive (see PERSON_GROUPS in types/content.ts).
const photographer: Person = {
  id: "person-dmitry",
  slug: "dmitry-orlov",
  name: "Дмитрий Орлов",
  role: "Фотограф",
  photo: squareImage,
  groups: ["Team", "Photographers"],
};

const founder: Person = {
  id: "person-ekaterina",
  slug: "ekaterina-titova",
  name: "Екатерина Титова",
  role: "Основатель",
  photo: squareImage,
  groups: ["Team"],
};

export const mockCrew: Person[] = [founder, editorInChief, author, photographer];

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

const bike2: Bike = {
  id: "bike-bobber",
  slug: "ironhead-bobber",
  name: "Ironhead Bobber",
  brand: "Harley-Davidson",
  model: "Ironhead",
  year: 1972,
  style: "Bobber",
  images: [squareImage, wideImage],
};

const bike3: Bike = {
  id: "bike-cafe-racer",
  slug: "cb750-cafe-racer",
  name: "CB750 Café Racer",
  brand: "Honda",
  model: "CB750",
  year: 1978,
  style: "Café Racer",
  images: [wideImage, portraitImage],
};

const builder: Builder = {
  id: "builder-ironhide",
  slug: "ironhide-garage",
  name: "Ironhide Garage",
  location: "Москва",
  projects: [bike, bike2, bike3],
};

bike.builder = builder;
bike2.builder = builder;
bike3.builder = builder;

// Top-level collections — Bike/Builder have so far only been consumed as
// nested relations (Story.relatedBike, BuildersCup.participants, etc.).
// Search needs to enumerate all of them directly, the same way a real
// Sanity query would target the bike/builder document type directly.
export const mockBikes: Bike[] = [bike, bike2, bike3];
export const mockBuilders: Builder[] = [builder];

export const mockStories: Story[] = [
  {
    id: "story-panhead",
    slug: "panhead-chopper-story",
    title: "Панхед-чоппер из гаража Ironhide",
    coverImage: wideImage,
    shortDescription:
      "История постройки классического чоппера на базе Harley-Davidson Panhead 1958 года.",
    // Demonstrates the print-magazine rich text block set (see
    // types/content.ts's RichText union / cms/schemas/portableTextBlocks.ts):
    // text between images, a wide image, a full-width image, an
    // automatically-grouped inline image gallery, a pull quote, a
    // divider, and a video embed.
    content: [
      paragraph("story-panhead-p1", "Полный текст истории появится после интеграции CMS."),
      {
        _type: "richTextImage",
        _key: "story-panhead-img-wide",
        image: portraitImage,
        variant: "wide",
      },
      {
        _type: "richTextImage",
        _key: "story-panhead-img-full",
        image: wideImage,
        variant: "fullWidth",
      },
      {
        _type: "pullQuote",
        _key: "story-panhead-quote",
        text: "Мы не строим мотоциклы, которые нравятся всем — мы строим те, что не дают спать нам самим.",
        attribution: "Ironhide Garage",
      },
      { _type: "divider", _key: "story-panhead-divider" },
      paragraph(
        "story-panhead-p2",
        "Несколько кадров с разных этапов сборки — от рамы до финальной покраски.",
      ),
      // Consecutive inline images — RichText.tsx groups these into one
      // gallery automatically, no authoring change needed here.
      { _type: "richTextImage", _key: "story-panhead-img-1", image: squareImage, variant: "inline" },
      {
        _type: "richTextImage",
        _key: "story-panhead-img-2",
        image: portraitImage,
        variant: "inline",
      },
      paragraph("story-panhead-p3", "Видео с последнего заезда — прямо со стартовой решётки."),
      {
        _type: "embed",
        _key: "story-panhead-embed",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
    ] satisfies RichText,
    category: "Bike",
    author,
    publishedDate: "2026-05-01",
    gallery: [wideImage, squareImage, portraitImage],
    relatedBike: [bike],
    relatedBuilder: [builder],
    tags: ["Chopper"],
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
    tags: ["Chopper"],
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

export const mockSiteSettings: SiteSettings = {
  siteTitle: "Builders Magazine",
  siteDescription: "Цифровая платформа независимого журнала о культуре кастомных мотоциклов.",
  philosophy:
    "Builders Magazine — не корпоративный сайт, не новостной портал и не онлайн-магазин. Это " +
    "кураторская издательская платформа, построенная вокруг фотографии, историй и мастерства. " +
    "Мы говорим спокойно и уверенно, как человек, который давно в теме — без агрессивного " +
    "маркетинга и лишней рекламы.",
  mission:
    "Builders Magazine существует, чтобы рассказывать о людях, мотоциклах и мастерстве, " +
    "которые формируют культуру кастомных мотоциклов. Мы не гонимся за трендами и коммерческим " +
    "успехом — наша миссия в том, чтобы сохранять культуру, вдохновлять мастеров и " +
    "документировать выдающиеся проекты для будущих поколений.",
  contacts: {
    email: "hello@buildersmagazine.ru",
    city: "Москва, Россия",
    socialLinks: [
      { label: "Telegram", url: "https://t.me/example" },
      { label: "Instagram", url: "https://instagram.com/example" },
    ],
  },
  cooperation:
    "Мы открыты к сотрудничеству с брендами, мастерскими и организациями, которые разделяют " +
    "наши ценности. Коммерческие партнёрства никогда не влияют на редакционную независимость — " +
    "читатели должны быть уверены в честности публикуемых материалов.",
  footerText:
    "Builders Magazine — независимый печатный журнал, посвящённый культуре кастомных мотоциклов.",
  defaultSEO: {
    title: "Builders Magazine",
    description: "Цифровая платформа независимого журнала о культуре кастомных мотоциклов.",
    keywords: [
      "кастомные мотоциклы",
      "мотожурнал",
      "builders magazine",
      "мотоциклетная культура",
      "кастом байк",
    ],
    ogImage: wideImage,
    favicon: squareImage,
    twitterImage: wideImage,
    robots: "index, follow",
    siteName: "Builders Magazine",
  },
};

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
    gallery: [wideImage, squareImage],
    participants: [bike, bike2, bike3],
    winners: [bike],
  },
  {
    id: "builders-cup-2024",
    slug: "builders-cup-2024",
    name: "Builders Cup 2024",
    date: "2024-09-14",
    location: "Санкт-Петербург",
    description: [
      paragraph(
        "bc-2024-p1",
        "Первый выездной слёт Builders Cup: конкурс построек и встреча мастерских со всей страны.",
      ),
    ],
    coverImage: squareImage,
    gallery: [squareImage],
    participants: [bike2],
    winners: [bike2],
  },
];

export const mockProducts: Product[] = [
  {
    id: "product-tshirt",
    slug: "builders-tshirt",
    name: "Футболка Builders Magazine",
    shortDescription: "Плотная хлопковая футболка с принтом логотипа Builders Magazine.",
    description: [
      paragraph(
        "product-tshirt-p1",
        "Футболка из плотного хлопка с минималистичным принтом логотипа на груди. Свободный крой, " +
          "не садится после стирки. Один из первых предметов мерча журнала — печатается небольшими " +
          "партиями.",
      ),
    ],
    mainImage: squareImage,
    gallery: [squareImage, wideImage],
    price: 2500,
    currency: "RUB",
    sizes: ["S", "M", "L", "XL"],
    materials: "100% хлопок, плотность 180 г/м²",
    externalBuyUrl: "https://example.com/shop/tshirt",
    status: "published",
  },
  {
    id: "product-cap",
    slug: "builders-magazine-cap",
    name: "Кепка Builders Magazine",
    shortDescription: "Кепка с вышитым логотипом и регулируемым ремешком.",
    description: [
      paragraph(
        "product-cap-p1",
        "Классическая пятипанельная кепка с вышитым логотипом Builders Magazine спереди. " +
          "Регулируемый ремешок на затылке подходит под любой размер головы.",
      ),
    ],
    mainImage: squareImage,
    gallery: [squareImage],
    price: 1800,
    currency: "RUB",
    sizes: ["Один размер (регулируется)"],
    materials: "Хлопок, регулируемый ремешок",
    externalBuyUrl: "https://example.com/shop/cap",
    status: "published",
  },
  {
    id: "product-patch",
    slug: "ironhide-garage-patch",
    name: "Шеврон Ironhide Garage",
    shortDescription: "Вышитый шеврон мастерской Ironhide Garage на термоклею.",
    description: [
      paragraph(
        "product-patch-p1",
        "Вышитый шеврон в честь мастерской Ironhide Garage — одной из мастерских, о которых мы " +
          "писали в журнале. Термоклеевая основа, можно закрепить утюгом или пришить.",
      ),
    ],
    mainImage: squareImage,
    gallery: [squareImage],
    price: 500,
    currency: "RUB",
    materials: "Вышивка, термоклеевая основа",
    externalBuyUrl: "https://example.com/shop/patch",
    status: "published",
  },
  {
    id: "product-stickers",
    slug: "builders-magazine-stickers",
    name: "Набор наклеек",
    shortDescription: "Набор виниловых наклеек с мотивами из журнала.",
    description: [
      paragraph(
        "product-stickers-p1",
        "Набор из шести виниловых наклеек с иллюстрациями и логотипами из разных номеров " +
          "журнала. Влагостойкие, подходят для бака, шлема или ноутбука.",
      ),
    ],
    mainImage: squareImage,
    gallery: [squareImage],
    price: 300,
    currency: "RUB",
    materials: "Виниловая плёнка, влагостойкая печать",
    externalBuyUrl: "https://example.com/shop/stickers",
    status: "published",
  },
];

// Backs Social Feed blocks' mock provider path (cms/services/socialFeed.ts) —
// only "instagram" exists today (types/content.ts's SOCIAL_PROVIDERS),
// so every fixture uses that provider.
export const mockSocialPosts: SocialPost[] = [
  {
    id: "social-1",
    provider: "instagram",
    imageUrl: "/placeholders/placeholder-square.png",
    caption: "Раннее утро в мастерской.",
    permalink: "https://instagram.com/example",
  },
  {
    id: "social-2",
    provider: "instagram",
    imageUrl: "/placeholders/placeholder-wide.png",
    caption: "Финальная покраска бака.",
    permalink: "https://instagram.com/example",
  },
  {
    id: "social-3",
    provider: "instagram",
    imageUrl: "/placeholders/placeholder-portrait.png",
    caption: "С прошедшего Builders Cup.",
    permalink: "https://instagram.com/example",
  },
  {
    id: "social-4",
    provider: "instagram",
    imageUrl: "/placeholders/placeholder-square.png",
    caption: "Деталь двигателя Panhead.",
    permalink: "https://instagram.com/example",
  },
  {
    id: "social-5",
    provider: "instagram",
    imageUrl: "/placeholders/placeholder-wide.png",
    caption: "Кастомная рама в процессе сварки.",
    permalink: "https://instagram.com/example",
  },
  {
    id: "social-6",
    provider: "instagram",
    imageUrl: "/placeholders/placeholder-portrait.png",
    caption: "Портрет мастера за работой.",
    permalink: "https://instagram.com/example",
  },
];

// Homepage-as-magazine-spread: every Layout Block type used at least
// once (see types/content.ts's LayoutBlock union), in a deliberate
// editorial sequence, so the page works end to end before an editor has
// composed anything real in Sanity. Reuses the fixtures already defined
// above rather than inventing new ones. The "home-grid-2" entry exercises
// Story Grid's automatic/query data source (dataSource: "automatic",
// mirroring what a separate "Latest Stories" block would have been —
// tag-filtered here to show that path too); resolveDynamicBlocks() (called
// by getHomepage()) fills in its `stories` the same way it would for real
// Sanity content. "home-quote" demonstrates Block Settings overriding a
// block's default background/spacing/container width.
const mockHomePageBlocks: LayoutBlock[] = [
  { _type: "heroStory", _key: "home-hero", story: mockStories[0] },
  {
    _type: "storyGrid",
    _key: "home-grid-1",
    title: "Свежие истории",
    layout: "3-columns",
    dataSource: "manual",
    stories: mockStories.slice(1, 4),
  },
  {
    _type: "fullWidthPhoto",
    _key: "home-photo",
    image: wideImage,
    caption: "С последнего Builders Cup — раннее утро перед стартом.",
  },
  {
    _type: "quote",
    _key: "home-quote",
    text: "Мы не гонимся за трендами и коммерческим успехом — наша миссия в том, чтобы " +
      "сохранять культуру и вдохновлять мастеров.",
    author: editorInChief.name,
    settings: { background: "surface", spacingTop: "lg", containerWidth: "wide" },
  },
  {
    _type: "richText",
    _key: "home-richtext",
    content: [
      paragraph(
        "home-richtext-p1",
        "Материал в свободной форме — тот же набор блоков, что и в статье: изображения, врезки, цитаты.",
      ),
      {
        _type: "pullQuote",
        _key: "home-richtext-quote",
        text: "Каждая деталь имеет значение, когда собираешь мотоцикл вручную.",
        attribution: "Ironhide Garage",
      },
    ] satisfies RichText,
  },
  { _type: "featuredIssue", _key: "home-issue", issue: mockIssues[0] },
  { _type: "spacer", _key: "home-spacer", size: "lg" },
  {
    _type: "buildersCupHighlight",
    _key: "home-builders-cup",
    event: mockBuildersCupEvents[0],
  },
  {
    _type: "storyGrid",
    _key: "home-grid-2",
    title: "Культура кастома",
    layout: "2-columns",
    dataSource: "automatic",
    tag: "Chopper",
    count: 4,
    sort: "newest",
  },
  { _type: "editorialDivider", _key: "home-divider", variant: "label", label: "Builders" },
  { _type: "bikeSpotlight", _key: "home-bike-spotlight", bike: bike, heading: "Байк недели" },
  {
    _type: "builderSpotlight",
    _key: "home-builder-spotlight",
    builder: builder,
    ctaText: "Смотреть мастерскую",
    ctaUrl: "https://example.com/ironhide-garage",
  },
  {
    _type: "cta",
    _key: "home-cta",
    title: "Builders Cup 2026",
    subtitle: "Регистрация участников уже открыта",
    buttonText: "Участвовать",
    buttonUrl: "https://example.com/buy",
    backgroundImage: wideImage,
    alignment: "center",
    overlay: true,
  },
  {
    _type: "merchandise",
    _key: "home-merch",
    title: "Мерч",
    products: mockProducts.slice(0, 3),
  },
  {
    _type: "socialFeed",
    _key: "home-social",
    title: "Мы в Instagram",
    provider: "instagram",
    count: 6,
    profileUrl: "https://instagram.com/example",
  },
];

export const mockHomePage: HomePage = { blocks: mockHomePageBlocks };

// Second consumer of the same Layout Blocks system — a standalone promo
// page reachable at /ru/p/[slug] (app/[locale]/p/[slug]/page.tsx), not
// part of the site's main navigation.
export const mockLandingPages: LandingPage[] = [
  {
    id: "landing-builders-cup-2025",
    slug: "builders-cup-2025",
    title: "Builders Cup 2025 — промо",
    status: "published",
    blocks: [
      { _type: "heroStory", _key: "landing-hero", story: mockStories[4] },
      {
        _type: "buildersCupHighlight",
        _key: "landing-builders-cup",
        event: mockBuildersCupEvents[0],
      },
      {
        _type: "fullWidthPhoto",
        _key: "landing-photo",
        image: wideImage,
        caption: "Регистрация участников открыта.",
      },
      {
        _type: "quote",
        _key: "landing-quote",
        text: "Каждый год — новые мастерские, новые истории и новые правила игры.",
        author: founder.name,
      },
    ],
  },
];
