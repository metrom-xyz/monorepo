"use client";

import { PageNotFound } from "@/src/components/page-not-found";
import { useTranslations } from "next-intl";

export default function NotFound() {
    const t = useTranslations("notFound");

    return <PageNotFound message={t("title")} />;
}
