import { routing } from "@/src/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function NotFoundCatchAll({
    params,
}: {
    params: { locale: string };
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    setRequestLocale(locale);

    notFound();
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}
