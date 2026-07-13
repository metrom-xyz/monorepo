import pluginQuery from "@tanstack/eslint-plugin-query";
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettierConfig from "eslint-config-prettier/flat";

export default defineConfig(
    ...nextVitals,
    prettierConfig,
    ...pluginQuery.configs["flat/recommended"],
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: import.meta.dirname,
            },
        },
        settings: {
            next: {
                rootDir: import.meta.dirname,
            },
        },
        rules: {
            "@tanstack/query/exhaustive-deps": "off",
            "react-hooks/set-state-in-effect": "off",
            "react-hooks/preserve-manual-memoization": "off",
        },
    },
);
