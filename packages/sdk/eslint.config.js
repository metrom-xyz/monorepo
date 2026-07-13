import eslintConfigPrettier from "eslint-config-prettier/flat";
import tseslint from "typescript-eslint";
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";

export default defineConfig(
    { ignores: ["dist/**"] },
    eslintConfigPrettier,
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
);
