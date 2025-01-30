import type { NamedCampaign } from "@/src/types";
import { TargetType, type Erc20Token } from "@metrom-xyz/sdk";
import { RemoteLogo } from "../remote-logo";
import type { RemoteLogoProps } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

interface LiquityFilteredCollateralsProps {
    size?: RemoteLogoProps["size"];
    campaign: NamedCampaign;
}

export function LiquityFilteredCollaterals({
    size,
    campaign,
}: LiquityFilteredCollateralsProps) {
    const debt = campaign.isTargeting(TargetType.LiquityV2Debt);
    const collateral = campaign.isTargeting(TargetType.LiquityV2Collateral);

    let collateralTokens: Erc20Token[] = [];
    if (debt)
        collateralTokens = campaign.target.debts.map(
            ({ usdDebt, ...rest }) => ({ ...rest }),
        );
    if (collateral)
        collateralTokens = campaign.target.collaterals.map(
            ({ token }) => token,
        );

    return (
        <div className={styles.root}>
            {collateralTokens.map((token) => (
                <RemoteLogo
                    key={token.address}
                    size={size}
                    chain={campaign.chainId}
                    address={token.address}
                    className={styles.logo}
                />
            ))}
        </div>
    );
}
