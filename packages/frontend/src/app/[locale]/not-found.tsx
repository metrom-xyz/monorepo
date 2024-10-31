"use client";

import { Layout as DefaultLayout } from "@/src/components/layout";
import { PageNotFound } from "@/src/components/page-not-found";
import { routing } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export default function NotFound({
    params: { locale },
}: {
    params: { locale: string };
}) {
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    unstable_setRequestLocale(locale);

    const t = useTranslations("notFound");

    return (
        <DefaultLayout>
            <PageNotFound message={t("title")} />
        </DefaultLayout>
    );
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}
