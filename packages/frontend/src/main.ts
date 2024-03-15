import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "./main.css";

import { createApp } from "vue";
import {
    CarrotVueAdapter,
    type CarrotWagmiConfig,
} from "@carrot-kpi/vue-adapter";
import App from "./App.vue";
import { router } from "./router";
import { i18n } from "./i18n";
import { createConfig, http, injected } from "@wagmi/core";
import { createPinia } from "pinia";
import { METROM_CHAIN, SUPPORTED_CHAIN } from "./commons";
import { ChainId } from "./types";

const wagmiConfig: CarrotWagmiConfig = createConfig({
    chains: [METROM_CHAIN[ChainId.Gnosis]],
    transports: {
        [SUPPORTED_CHAIN[ChainId.Gnosis].id]: http(),
    },
    connectors: [injected()],
});

const pinia = createPinia();

const app = createApp(App, {});

app.use(router);
app.use(i18n);
app.use(CarrotVueAdapter, {
    type: "host",
    wagmiConfig,
    pinia,
});

app.mount("#app");
