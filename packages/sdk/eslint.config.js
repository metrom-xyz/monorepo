import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";

import tsParser from "@typescript-eslint/parser";
import tsEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";

export default [
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parser: tsParser,
        },
        plugins: {
            tsEslint,
            prettier,
        },
        ignores: ["node_modules", "dist", ".turbo", "storybook-static"],
    },
];
