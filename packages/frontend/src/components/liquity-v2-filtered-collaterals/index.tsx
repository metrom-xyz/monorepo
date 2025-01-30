import type { NamedCampaign } from "@/src/types";
import { TargetType, type Erc20Token } from "@metrom-xyz/sdk";
import { RemoteLogo } from "../remote-logo";
import type { RemoteLogoProps } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

interface LiquityV2FilteredCollateralsProps {
    size?: RemoteLogoProps["size"];
    campaign: NamedCampaign;
}

const collator = new Intl.Collator();

export function LiquityV2FilteredCollaterals({
    size,
    campaign,
}: LiquityV2FilteredCollateralsProps) {
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
            {collateralTokens
                .sort((a, b) =>
                    collator.compare(
                        a.symbol.toLowerCase(),
                        b.symbol.toLowerCase(),
                    ),
                )
                .map((token) => (
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
