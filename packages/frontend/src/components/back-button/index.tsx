import { Button } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { useRouter } from "@/src/i18n/routing";
import { useCallback } from "react";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

interface BackButtonProps {
    pathname?: string;
}

export function BackButton({ pathname }: BackButtonProps) {
    const t = useTranslations("backButton");
    const { back, push } = useRouter();

    const handleBackOnClick = useCallback(() => {
        if (pathname) push({ pathname });
        else back();
    }, [pathname, push, back]);

    return (
        <Button
            variant="secondary"
            icon={ArrowRightIcon}
            border={false}
            onClick={handleBackOnClick}
            className={{
                root: styles.button,
                icon: styles.icon,
            }}
        >
            {t("back")}
        </Button>
    );
}
