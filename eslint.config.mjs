import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";

// Architecture Rule (docs/04_TECH_STACK.md):
// UI components must never communicate directly with the CMS.
// Pages must never contain GROQ queries.
// All data access must go through the cms/services layer.
const cmsBoundaryRule = {
  files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "hooks/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@/cms/queries", "@/cms/queries/*", "**/cms/queries", "**/cms/queries/*"],
            message:
              "Do not import cms/queries directly from UI code. Fetch data through cms/services instead.",
          },
          {
            group: ["@/cms/schemas", "@/cms/schemas/*", "**/cms/schemas", "**/cms/schemas/*"],
            message:
              "Do not import cms/schemas directly from UI code. Use the typed models in types/ instead.",
          },
          {
            group: ["@/cms/mappers", "@/cms/mappers/*", "**/cms/mappers", "**/cms/mappers/*"],
            message:
              "Do not import cms/mappers directly from UI code. Consume already-mapped data from cms/services instead.",
          },
          {
            group: ["@/cms/sanity", "@/cms/sanity/*", "**/cms/sanity", "**/cms/sanity/*"],
            message:
              "Do not import the Sanity client wrapper directly from UI code. Fetch data through cms/services instead.",
          },
          {
            group: ["@sanity/client"],
            message:
              "Do not import @sanity/client directly from UI code. Fetch data through cms/services instead.",
          },
          {
            group: ["**/mock-data", "**/services/mock-data", "@/cms/services/mock-data"],
            message:
              "mock-data is private to cms/services — do not import it directly. Fetch data through the exported service functions instead.",
          },
        ],
      },
    ],
  },
};

// mock-data.ts is an implementation detail of cms/services, not of the
// query/mapper/schema/client layers either — those get their data from
// Sanity, not from mock-data. Only cms/services/*.ts may import it. This
// is a separate, non-overlapping file scope from cmsBoundaryRule above
// (ESLint flat config: the same rule set on two configs matching the
// same file has the later one win outright, not merge — so this stays a
// distinct rule object rather than folded into cmsBoundaryRule's scope).
const mockDataBoundaryRule = {
  files: [
    "cms/queries/**/*.ts",
    "cms/mappers/**/*.ts",
    "cms/schemas/**/*.ts",
    "cms/sanity/**/*.ts",
  ],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["**/mock-data", "**/services/mock-data", "@/cms/services/mock-data"],
            message: "mock-data is private to cms/services — do not import it directly.",
          },
        ],
      },
    ],
  },
};

// components/ui/Image.tsx takes a MediaAsset, not a flat `alt` prop, so
// jsx-a11y/alt-text can't see the alt text it forwards to next/image.
// Alt text is enforced structurally instead: MediaAsset.altText
// (types/content.ts) is a required field, not optional.
const mediaAssetAltTextRule = {
  files: ["**/*.{ts,tsx}"],
  rules: {
    "jsx-a11y/alt-text": ["error", { img: [] }],
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  cmsBoundaryRule,
  mockDataBoundaryRule,
  mediaAssetAltTextRule,
  eslintConfigPrettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Sanity Studio is a separate app (its own package.json/node_modules —
    // see ARCHITECTURE.md / docs/11_SANITY_SETUP.md), excluded from the
    // root tsconfig.json too. Beyond its build output (generated,
    // minified, multiple MB — enough to OOM the default Node heap on its
    // own), linting its *source* files here would also fail: Next.js's
    // type-aware lint rules resolve against the root tsconfig, which no
    // longer includes studio/*.ts, and those files import the `sanity`
    // package that's only installed in studio/node_modules anyway.
    "studio/**",
  ]),
]);

export default eslintConfig;
