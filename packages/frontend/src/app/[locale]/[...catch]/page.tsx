import { routing, type Locale } from "@/src/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

interface Params {
    locale: Locale;
}

interface NotFoundCatchAllProps {
    params: Promise<Params>;
}

export default async function NotFoundCatchAll({
    params,
}: NotFoundCatchAllProps) {
    const { locale } = await params;

    if (!routing.locales.includes(locale)) notFound();

    setRequestLocale(locale);
    notFound();
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}
