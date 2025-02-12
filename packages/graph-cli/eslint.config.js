import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
    {
        ignores: ["dist/**"],
        languageOptions: {
            globals: globals.node,
        },
    },
    eslint.configs.recommended,
    prettier,
];
