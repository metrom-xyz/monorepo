// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    imports: {
        autoImport: false,
    },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    css: [
        "@fontsource-variable/inter",
        "@metrom-xyz/ui/index.css",
        "~/assets/css/main.css",
    ],
    image: {
        format: ["webp"],
    },
    modules: ["@nuxtjs/i18n", "@nuxt/image", "@nuxt/eslint"],
});
