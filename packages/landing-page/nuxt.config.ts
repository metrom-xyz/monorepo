// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    nitro: {
        static: true,
    },
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
    fathom: {
        siteId: process.env.FATHOM_SITE_ID,
    },
    modules: ["@nuxtjs/i18n", "@nuxt/image", "@nuxt/eslint", "nuxt-fathom"],
});
