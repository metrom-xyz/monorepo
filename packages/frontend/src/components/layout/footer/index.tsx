import { GithubLogo } from "@/src/assets/logos/socials/github";
import { XLogo } from "@/src/assets/logos/socials/x";
import { DiscordLogo } from "@/src/assets/logos/socials/discord";
import { TelegramLogo } from "@/src/assets/logos/socials/telegram";
import { Typography } from "@/src/ui/typography";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

export function Footer() {
    const t = useTranslations("footer");

    return (
        <div className={styles.root}>
            <div className={styles.socials}>
                <a
                    href="https://github.com/metrom-xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <GithubLogo className={styles.socialIcon} />
                </a>
                <a
                    href="https://x.com/metromxyz"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <XLogo className={styles.socialIcon} />
                </a>
                <a
                    href="https://discord.com/invite/uRer2D4Pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <DiscordLogo className={styles.socialIcon} />
                </a>
                <a
                    href="https://t.me/metrom_xyz"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <TelegramLogo className={styles.socialIcon} />
                </a>
            </div>
            <div className={styles.support}>
                <a
                    href="https://discord.com/invite/uRer2D4Pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Typography weight="medium">{t("support")}</Typography>
                </a>
                <a
                    href="https://metrom.gitbook.io/metrom"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Typography light>{t("documentation")}</Typography>
                </a>
                <a href="mailto:hello@metrom.xyz">
                    <Typography light>{t("contactUs")}</Typography>
                </a>
            </div>
        </div>
    );
}
