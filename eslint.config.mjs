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
        ],
      },
    ],
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  cmsBoundaryRule,
  eslintConfigPrettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
