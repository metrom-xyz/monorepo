import { InfoIcon } from "@/src/assets/info";
import { Typography } from "@metrom-xyz/ui";
import { formatPercentage } from "@/src/utils/format";
import { useTranslations } from "next-intl";
import { useChainData } from "@/src/hooks/useChainData";
import { useChainId } from "wagmi";
import classNames from "classnames";

import styles from "./styles.module.css";

interface ReimbursementFeeProps {
    radius?: "md" | "xl2";
}

export function ReimbursementFee({ radius = "md" }: ReimbursementFeeProps) {
    const t = useTranslations("newCampaign.form.reimbursementFee");

    const chainId = useChainId();
    const chainData = useChainData(chainId);

    if (!chainData?.reimbursementFeeEnabled) return null;

    return (
        <div className={classNames(styles.root, { [styles[radius]]: true })}>
            <InfoIcon className={styles.icon} />
            <div className={styles.rightContent}>
                <Typography
                    uppercase
                    weight="medium"
                    size="sm"
                    className={styles.text}
                >
                    {t("title", {
                        // TODO: fetch fee from contracts
                        fee: formatPercentage({
                            percentage: 5,
                        }),
                    })}
                </Typography>
                <Typography weight="medium" size="sm" className={styles.text}>
                    {t("description")}
                </Typography>
            </div>
        </div>
    );
}
