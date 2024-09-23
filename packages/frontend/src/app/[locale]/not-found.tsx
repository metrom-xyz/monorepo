"use client";

import Link from "next/link";
import { Layout as DefaultLayout } from "@/src/components/layout";
import { useTranslations } from "next-intl";
import { Button, Typography } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

export default function NotFound() {
    const t = useTranslations("notFound");

    return (
        <DefaultLayout>
            <div className={styles.notFound}>
                <Typography variant="xl5" weight="bold">
                    404
                </Typography>
                <Typography variant="xl4" weight="medium">
                    {t("title")}
                </Typography>
                <Link href="/">
                    <Button size="small">{t("button")}</Button>
                </Link>
            </div>
        </DefaultLayout>
    );
}
