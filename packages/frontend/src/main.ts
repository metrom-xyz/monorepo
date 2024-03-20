import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "./main.css";

import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { i18n } from "./i18n";
import { createPinia } from "pinia";
import { createConfig, injected } from "@wagmi/core";
import { SUPPORTED_CHAINS, SUPPORTED_CHAIN_TRANSPORT } from "./commons";
import { VevmAdapter } from "vevm";

const wagmiConfig = createConfig({
    chains: SUPPORTED_CHAINS,
    transports: SUPPORTED_CHAIN_TRANSPORT,
    connectors: [injected()],
});

const pinia = createPinia();

const app = createApp(App, {});

app.use(router);
app.use(i18n);
app.use(pinia);
app.use(VevmAdapter, {
    wagmiConfig,
});

app.mount("#app");
