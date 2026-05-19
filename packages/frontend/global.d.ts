import en from "./messages/en.json";
import type { Locale } from "./src/i18n/routing";
import type { RegisteredEvents } from "./src/utils/umami";

declare module "next-intl" {
    interface AppConfig {
        Locale: Locale;
        Messages: typeof en;
    }
}

declare global {
    interface Window {
        umami: {
            track: (event: RegisteredEvents, data?: object) => void;
        };
    }
}
