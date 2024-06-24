import { fileURLToPath } from "node:url";
import { mergeConfig, defineConfig, configDefaults } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            passWithNoTests: true,
            environment: "jsdom",
            exclude: [...configDefaults.exclude],
            root: fileURLToPath(new URL("./", import.meta.url)),
        },
    }),
);
