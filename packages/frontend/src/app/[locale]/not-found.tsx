"use client";

import { Layout as DefaultLayout } from "@/src/components/layout";
import { PageNotFound } from "@/src/components/page-not-found";
import { useTranslations } from "next-intl";

export default function NotFound() {
    const t = useTranslations("notFound");

    return (
        <DefaultLayout>
            <PageNotFound message={t("title")} />
        </DefaultLayout>
    );
}
