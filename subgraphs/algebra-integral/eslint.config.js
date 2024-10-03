import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default [
    {
        ignores: ["generated/**", "build/**"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    prettier,
    {
        rules: {
            "prefer-const": "off",
            "@typescript-eslint/ban-types": "off",
        },
    },
];
