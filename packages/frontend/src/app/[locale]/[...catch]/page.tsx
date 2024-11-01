import { routing } from "@/src/i18n/routing";
import { unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export default function NotFoundCatchAll({
    params: { locale },
}: {
    params: { locale: string };
}) {
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    unstable_setRequestLocale(locale);

    notFound();
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}
