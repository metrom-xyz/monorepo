import { UserConfig, defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const ALLOWED_ENVIRONMENTS = ["development", "staging", "production"];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    if (!ALLOWED_ENVIRONMENTS.includes(mode)) {
        throw new Error(
            `Invalid environment "${mode}" specified. Allowed values are: ${ALLOWED_ENVIRONMENTS.join(
                ", ",
            )}`,
        );
    }
    return {
        plugins: [vue()],
        define: {
            __ENVIRONMENT__: JSON.stringify(mode),
        },
    };
}) as UserConfig;
