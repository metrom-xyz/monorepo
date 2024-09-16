import { defineConfig } from "vite";
import { peerDependencies } from "./package.json";

export default defineConfig({
    build: {
        cssCodeSplit: false,
        emptyOutDir: false,
        lib: {
            entry: "src/index.ts",
            formats: ["es"],
        },
        rollupOptions: {
            external: Object.keys(peerDependencies),
            output: {
                preserveModules: true,
                preserveModulesRoot: "src",
                entryFileNames: "[name].js",
            },
        },
    },
});
