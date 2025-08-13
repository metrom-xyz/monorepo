import classNames from "classnames";
import { Button, Skeleton, Card } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import type { TokenClaims } from "..";
import { RemoteLogo } from "@/src/components/remote-logo";
import type { Erc20Token } from "@metrom-xyz/sdk";
import { APTOS } from "@/src/commons/env";
import { TokenClaimEvm } from "./token-claim-evm";
import { TokenClaimMvm } from "./token-claim-mvm";

import styles from "./styles.module.css";

export interface TokenClaimProps {
    chainId: number;
    tokenClaims: TokenClaims;
    claimingAll?: boolean;
    onClaim: (token: Erc20Token) => void;
}

export function TokenClaim(props: TokenClaimProps) {
    if (APTOS) return <TokenClaimMvm {...props} />;
    return <TokenClaimEvm {...props} />;
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
            <Button variant="secondary" size="sm" loading>
                {t("loading")}
            </Button>
        </Card>
    );
}
