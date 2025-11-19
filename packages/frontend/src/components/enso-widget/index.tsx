import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { Widget } from "@metrom-xyz/enso-shortcuts-widget";
import { ENSO_FINANCE_API_KEY } from "@/src/commons/env";
import { trackFathomEvent } from "@/src/utils/fathom";
import { useAppKit } from "@reown/appkit/react";
import { ENSO_WIDGET_REFERRAL_CODE } from "@/src/commons";

import styles from "./styles.module.css";

export function EnsoWidget() {
    const t = useTranslations("enso");

    const { open } = useAppKit();

    async function handleWidgetOnConnect() {
        await open();
    }

    function handleWidgetOnSuccess() {
        trackFathomEvent("ENSO_WIDGET_TX_SUCCESS");
    }

    return (
        <div className={styles.root}>
            <div className={styles.title}>
                <Typography size="lg" weight="medium" uppercase>
                    {t("title")}
                </Typography>
                <Typography weight="medium" variant="tertiary">
                    {t("subtitle")}
                </Typography>
            </div>
            <Widget
                apiKey={ENSO_FINANCE_API_KEY}
                tokenIn="0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
                chainId={1}
                tokenOut="0x2b4b2a06c0fdebd8de1545abdffa64ec26416796"
                outChainId={1}
                onConnectWallet={handleWidgetOnConnect}
                onSuccess={handleWidgetOnSuccess}
                referralCode={ENSO_WIDGET_REFERRAL_CODE}
            />
        </div>
    );
}
