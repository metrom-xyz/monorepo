import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import pkg from "./package.json";

export default defineConfig({
    plugins: [vue()],
    build: {
        sourcemap: true,
        emptyOutDir: true,
        copyPublicDir: false,
        lib: {
            entry: ["src/index.ts"],
            formats: ["es"],
        },
        outDir: "./dist",
        rollupOptions: {
            output: {
                preserveModules: true,
                preserveModulesRoot: "src",
            },
            external: Object.keys(pkg.dependencies || {})
                .concat(Object.keys(pkg.peerDependencies || {}))
                .concat(Object.keys(pkg.devDependencies || {})),
        },
    },
});
