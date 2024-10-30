import { defineConfig } from "vite";
import { peerDependencies, devDependencies } from "./package.json";

export default defineConfig({
    build: {
        ssr: true,
        cssCodeSplit: false,
        emptyOutDir: true,
        lib: {
            entry: "src/index.ts",
            formats: ["es"],
        },
        rollupOptions: {
            input: {
                index: "./src/index.ts",
                server: "./src/server.ts",
            },
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
