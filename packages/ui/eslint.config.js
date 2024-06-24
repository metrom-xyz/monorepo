import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";

export default tseslint.config(
    {
        ignores: ["node_modules/", "dist/", ".turbo/", "storybook-static/"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            prettier,
        },
    },
);
