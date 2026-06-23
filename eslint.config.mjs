import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier/flat";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = [
  {
    ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts", "public/**"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  eslintConfigPrettier,

  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  /**
   * Blueprint guardrail (§1.1, §6.1): the server-safe layers — app routes and
   * the content module — must never import client-only animation/3D libraries.
   * GSAP lives in components/experience/choreography and components/ui;
   * Three.js lives in components/experience/canvas.
   */
  {
    files: ["app/**/*.{ts,tsx}", "content/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "gsap",
              message:
                "GSAP is client-only. Animation belongs in components/experience/choreography (Blueprint §6.1).",
            },
            {
              name: "three",
              message:
                "Three.js is client-only. 3D belongs in components/experience/canvas (Blueprint §2).",
            },
          ],
          patterns: [
            {
              group: ["gsap/*", "three/*", "@react-three/*"],
              message:
                "Client-only animation/3D imports are not allowed in app/ or content/ (Blueprint §1.1).",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
