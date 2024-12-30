import { defineConfig } from "vite";
import { peerDependencies, devDependencies } from "./package.json";

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
                ...Object.keys(peerDependencies),
                ...Object.keys(devDependencies),
                "react/jsx-runtime",
            ],
            output: {
                preserveModules: true,
                preserveModulesRoot: "src",
                entryFileNames: "[name].js",
            },
        },
    },
});
