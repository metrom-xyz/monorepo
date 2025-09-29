import tseslint from "typescript-eslint";
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
});

export default defineConfig(
    { ignores: ["dist/**"] },
    ...compat.config({
        parserOptions: {
            tsconfigRootDir: import.meta.dirname,
        },
        extends: ["prettier"],
    }),
    eslint.configs.recommended,
    tseslint.configs.recommended,
);
