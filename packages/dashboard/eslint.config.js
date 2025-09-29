import { FlatCompat } from "@eslint/eslintrc";
import pluginQuery from "@tanstack/eslint-plugin-query";
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
});

export default defineConfig(
    ...compat.config({
        parserOptions: {
            tsconfigRootDir: import.meta.dirname,
        },
        extends: ["next", "next/typescript", "prettier"],
        settings: {
            next: {
                rootDir: "packages/dashboard/",
            },
        },
    }),
    ...pluginQuery.configs["flat/recommended"],
    eslint.configs.recommended,
    tseslint.configs.recommended,
);
