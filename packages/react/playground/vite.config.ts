import react from "@vitejs/plugin-react-swc";
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
    root: import.meta.dirname,
    plugins: [react()],
    resolve: {
        alias: {
            "@metrom-xyz/react": resolve(
                import.meta.dirname,
                "../src/index.ts",
            ),
        },
    },
});
