"use client";

import { GithubLogo } from "@/src/assets/logos/socials/github";
import { XLogo } from "@/src/assets/logos/socials/x";
import { DiscordLogo } from "@/src/assets/logos/socials/discord";
import { TelegramLogo } from "@/src/assets/logos/socials/telegram";
import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { trackUmamiEvent } from "@/src/utils/umami";
import { MetromLogo } from "@/src/assets/logos/metrom/metrom-logo";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";

import styles from "./styles.module.css";

export function Footer() {
    const t = useTranslations("footer");

    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <div className={styles.socials}>
                    <a
                        aria-label={t("socials.github")}
                        href="https://github.com/metrom-xyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackUmamiEvent("click-github-link")}
                        className={styles.socialLink}
                    >
                        <GithubLogo className={styles.socialIcon} />
                    </a>
                    <a
                        aria-label={t("socials.x")}
                        href="https://x.com/metromxyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackUmamiEvent("click-x-link")}
                        className={styles.socialLink}
                    >
                        <XLogo className={styles.socialIcon} />
                    </a>
                    <a
                        aria-label={t("socials.discord")}
                        href="https://discord.com/invite/uRer2D4Pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackUmamiEvent("click-discord-link")}
                        className={styles.socialLink}
                    >
                        <DiscordLogo className={styles.socialIcon} />
                    </a>
                    <a
                        aria-label={t("socials.telegram")}
                        href="https://t.me/metrom_xyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackUmamiEvent("click-telegram-link")}
                        className={styles.socialLink}
                    >
                        <TelegramLogo className={styles.socialIcon} />
                    </a>
                </div>
                <div>
                    <MetromLogo className={styles.logo} />
                </div>
            </div>
            <div className={styles.support}>
                <a
                    href="https://discord.com/invite/uRer2D4Pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.supportLink}
                >
                    <Typography size="xs" weight="semibold">
                        {t("support")}
                    </Typography>
                    <ArrowRightIcon className={styles.linkIcon} />
                </a>
                <a
                    href="https://docs.metrom.xyz"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackUmamiEvent("click-documentation-link")}
                    className={styles.supportLink}
                >
                    <Typography size="xs" weight="semibold">
                        {t("documentation")}
                    </Typography>
                    <ArrowRightIcon className={styles.linkIcon} />
                </a>
                <a
                    href="mailto:hello@metrom.xyz"
                    className={styles.supportLink}
                >
                    <Typography size="xs" weight="semibold">
                        {t("contactUs")}
                    </Typography>
                    <ArrowRightIcon className={styles.linkIcon} />
                </a>
            </div>
        </div>
    );
}
