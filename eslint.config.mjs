import eslintPlugin from "@eslint/js";
import tseslint from "typescript-eslint";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  eslintPlugin.configs.recommended,

  ...tseslint.configs.recommended,

  ...compat.extends(
    "prettier", // eslint-config-prettier
    "plugin:prettier/recommended",
  ),
  {
    files: ["src/**/*.{ts,mts,cts}"],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-console": "warn",
    },
  },

  {
    ignores: ["node_modules/", "dist/", ".env"],
  },
);
