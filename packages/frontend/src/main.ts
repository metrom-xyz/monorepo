import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "./main.css";

import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { i18n } from "./i18n";
import { createPinia } from "pinia";

const pinia = createPinia();

const app = createApp(App, {});

app.use(router);
app.use(i18n);
app.use(pinia);

app.mount("#app");
