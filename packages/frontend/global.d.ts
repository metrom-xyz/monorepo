import en from "./messages/en.json";
import type { Locale } from "./src/i18n/routing";

declare module "next-intl" {
    interface AppConfig {
        Locale: Locale;
        Messages: typeof en;
    }
}
