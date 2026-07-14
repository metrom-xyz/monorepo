import eslintConfigPrettier from "eslint-config-prettier/flat";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import pluginQuery from "@tanstack/eslint-plugin-query";
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";

export default defineConfig(
    { ignores: ["dist/**"] },
    eslintConfigPrettier,
    ...pluginQuery.configs["flat/recommended"],
    reactHooks.configs.flat["recommended-latest"],
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            "@tanstack/query/exhaustive-deps": "off",
        },
    },
);
