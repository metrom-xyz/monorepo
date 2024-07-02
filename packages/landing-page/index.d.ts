declare module "nuxt/schema" {
    interface PublicRuntimeConfig {
        environment: "development" | "staging" | "production";
    }
}

export {};
