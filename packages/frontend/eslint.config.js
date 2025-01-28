import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
});

const eslintConfig = [
    ...compat.config({
        extends: [
            "next",
            "plugin:prettier/recommended",
            "plugin:@tanstack/eslint-plugin-query/recommended",
        ],
        rules: { "prettier/prettier": ["error", { endOfLine: "auto" }] },
    }),
];

export default eslintConfig;
