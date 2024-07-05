import { defineConfig } from "vite";

export default defineConfig({
    build: {
        sourcemap: true,
        emptyOutDir: true,
        lib: {
            entry: {
                index: "src/index.ts",
            },
            formats: ["es"],
        },
        outDir: "./dist",
        rollupOptions: {
            output: {
                preserveModules: true,
                preserveModulesRoot: "src",
            },
        },
    },
});
