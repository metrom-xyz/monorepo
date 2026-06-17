import classNames from "classnames";
import { Button, Skeleton, Card } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import type { TokenClaims } from "..";
import { RemoteLogo } from "@/src/components/remote-logo";
import { ChainType } from "@metrom-xyz/sdk";
import { TokenClaimEvm } from "./token-claim-evm";
import { TokenClaimMvm } from "./token-claim-mvm";
import { useChainType } from "@/src/hooks/useChainType";
import { TokenClaimSvm } from "./token-claim-svm";
import { TokenClaimSui } from "./token-claim-sui";

import styles from "./styles.module.css";

export interface TokenClaimProps {
    chainId: number;
    tokenClaims: TokenClaims;
    claimingAll?: boolean;
    onClaim: () => void;
}

export function TokenClaim(props: TokenClaimProps) {
    const chainType = useChainType();

    switch (chainType) {
        case ChainType.Evm:
            return <TokenClaimEvm {...props} />;
        case ChainType.Aptos:
            return <TokenClaimMvm {...props} />;
        case ChainType.Svm:
            return <TokenClaimSvm {...props} />;
        case ChainType.Sui:
            return <TokenClaimSui {...props} />;
        default:
            return null;
    }
}

export function SkeletonTokenClaim() {
    const t = useTranslations("rewards.claims");

    return (
        <Card className={classNames(styles.root)}>
            <div className={classNames(styles.leftWrapper, styles.loading)}>
                <RemoteLogo loading />
                <Skeleton width={60} size="lg" />
                <div
                    className={classNames(styles.amountWrapper, styles.loading)}
                >
                    <Skeleton width={70} size="lg" />
                    <Skeleton width={40} size="sm" />
                </div>
            </div>
            <Button variant="secondary" size="sm" loading iconPlacement="right">
                {t("loading")}
            </Button>
        </Card>
    );
}
