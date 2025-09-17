import { defineConfig } from "vite";

export default defineConfig({
    build: {
        cssCodeSplit: false,
        emptyOutDir: true,
        lib: {
            entry: "src/index.ts",
            cssFileName: "style",
            formats: ["es"],
        },
        rollupOptions: {
            external: [
                /^@fontsource\/ibm-plex-mono($|\/)/,
                /^@fontsource\/ibm-plex-sans($|\/)/,
                /^react($|\/)/,
                /^react-dom($|\/)/,
                /^sonner($|\/)/,
            ],
            output: {
                preserveModules: true,
                preserveModulesRoot: "src",
                entryFileNames: "[name].js",
            },
        },
    },
});
