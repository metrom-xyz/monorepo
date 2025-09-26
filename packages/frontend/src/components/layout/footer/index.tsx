"use client";

import { GithubLogo } from "@/src/assets/logos/socials/github";
import { XLogo } from "@/src/assets/logos/socials/x";
import { DiscordLogo } from "@/src/assets/logos/socials/discord";
import { TelegramLogo } from "@/src/assets/logos/socials/telegram";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { trackFathomEvent } from "@/src/utils/fathom";
import { MetromLogo } from "@/src/assets/logos/metrom/metrom-logo";

import styles from "./styles.module.css";

export function Footer() {
    const t = useTranslations("footer");

    return (
        <div className={styles.root}>
            <div className={styles.leftContent}>
                <div className={styles.socials}>
                    <a
                        aria-label={t("socials.github")}
                        href="https://github.com/metrom-xyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackFathomEvent("CLICK_GITHUB_LINK")}
                        className={styles.socialLink}
                    >
                        <GithubLogo className={styles.socialIcon} />
                    </a>
                    <a
                        aria-label={t("socials.x")}
                        href="https://x.com/metromxyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackFathomEvent("CLICK_X_LINK")}
                        className={styles.socialLink}
                    >
                        <XLogo className={styles.socialIcon} />
                    </a>
                    <a
                        aria-label={t("socials.discord")}
                        href="https://discord.com/invite/uRer2D4Pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackFathomEvent("CLICK_DISCORD_LINK")}
                        className={styles.socialLink}
                    >
                        <DiscordLogo className={styles.socialIcon} />
                    </a>
                    <a
                        aria-label={t("socials.telegram")}
                        href="https://t.me/metrom_xyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackFathomEvent("CLICK_TELEGRAM_LINK")}
                        className={styles.socialLink}
                    >
                        <TelegramLogo className={styles.socialIcon} />
                    </a>
                </div>
                <MetromLogo className={styles.logo} />
            </div>
            <div className={styles.support}>
                <a
                    href="https://discord.com/invite/uRer2D4Pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.supportLink}
                >
                    <Typography>{t("support")}</Typography>
                </a>
                <a
                    href="https://docs.metrom.xyz"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackFathomEvent("CLICK_DOCUMENTATION_LINK")}
                    className={styles.supportLink}
                >
                    <Typography>{t("documentation")}</Typography>
                </a>
                <a
                    href="mailto:hello@metrom.xyz"
                    className={styles.supportLink}
                >
                    <Typography>{t("contactUs")}</Typography>
                </a>
            </div>
        </div>
    );
}
