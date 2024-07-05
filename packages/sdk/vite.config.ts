import { defineConfig } from "vite";
import pkg from "./package.json";

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
            external: Object.keys(pkg.dependencies || {}).concat(
                Object.keys(pkg.devDependencies || {}),
            ),
        },
    },
});
