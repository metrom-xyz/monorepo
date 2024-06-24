import { defineConfig } from "vite";
import { peerDependencies } from "./package.json";

export default defineConfig({
    build: {
        sourcemap: true,
        emptyOutDir: false,
        copyPublicDir: false,
        lib: {
            entry: ["/tailwind.preset.ts"],
            formats: ["es"],
        },
        outDir: "./dist",
        rollupOptions: {
            external: Object.keys(peerDependencies),
        },
    },
});
