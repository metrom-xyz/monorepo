import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import { peerDependencies, devDependencies } from "./package.json";

export default defineConfig({
    plugins: [react(), dts({ tsconfigPath: "./tsconfig.json" })],
    build: {
        emptyOutDir: true,
        lib: {
            entry: { index: "src/index.tsx" },
            cssFileName: "styles",
            formats: ["es"],
        },
        rollupOptions: {
            external: [
                ...Object.keys(peerDependencies),
                ...Object.keys(devDependencies),
                "react/jsx-runtime",
            ],
        },
    },
});
