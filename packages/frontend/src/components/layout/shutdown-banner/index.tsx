"use client";

import { ErrorIcon } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";

import styles from "./styles.module.css";

const LEARN_MORE_LINK = "https://x.com/metromxyz/status/2100906227450458534";

export function ShutdownBanner() {
    const t = useTranslations("shutdownBanner");

    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <div className={styles.message}>
                    <ErrorIcon className={styles.icon} />
                    <p className={styles.title}>{t("title")}</p>
                    <span className={styles.divider} />
                    <p className={styles.text}>{t("message")}</p>
                </div>
                <a
                    href={LEARN_MORE_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                >
                    {t("learnMore")}
                    <ArrowRightIcon className={styles.linkIcon} />
                </a>
            </div>
        </div>
    );
}
