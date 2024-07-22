import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./config";

export default createMiddleware({
    locales,
    defaultLocale,
});

export const config = {
    matcher: ["/", "/(en)/:path*"],
};
