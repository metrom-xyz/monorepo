import { useTranslations } from "next-intl";
import {
    type Claim,
    type Erc20Token,
    type UsdPricedErc20Token,
} from "@metrom-xyz/sdk";
import { useMemo } from "react";
import { type Address } from "viem";
import { SkeletonTokenClaim, TokenClaim } from "./token-claim";
import type { ChainWithRewardsData } from "..";
import { Card, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";

import styles from "./token-claim/styles.module.css";

type ChainOverviewProps = {
    claimingAll?: boolean;
    onClaim: (token: Erc20Token) => void;
} & Omit<
    ChainWithRewardsData,
    "reimbursements" | "chainData" | "totalUsdValue"
>;

export interface TokenClaims {
    token: UsdPricedErc20Token;
    claims: Claim[];
    totalAmount: number;
}

export function ChainClaims({
    onClaim,
    chain,
    claims,
    claimingAll,
}: ChainOverviewProps) {
    const t = useTranslations("rewards.claims");

    const perToken = useMemo(() => {
        const reduced = claims.reduce(
            (acc, claim) => {
                if (!acc[claim.token.address]) {
                    acc[claim.token.address] = {
                        token: claim.token,
                        claims: [],
                        totalAmount: 0,
                    };
                }
                acc[claim.token.address].claims.push(claim);
                acc[claim.token.address].totalAmount += claim.amount.formatted;
                return acc;
            },
            {} as Record<Address, TokenClaims>,
        );
        return Object.values(reduced);
    }, [claims]);

    if (perToken.length === 0)
        return (
            <Card className={classNames(styles.root, styles.noClaimsCard)}>
                <Typography weight="medium" uppercase>
                    {t("empty.title")}
                </Typography>
            </Card>
        );

    return perToken.map((tokenClaims) => {
        return (
            <TokenClaim
                key={tokenClaims.token.address}
                chainId={chain.id}
                tokenClaims={tokenClaims}
                disabled={claimingAll}
                onClaim={onClaim}
            />
        );
    });
}

export function SkeletonChainClaims() {
    return (
        <>
            <SkeletonTokenClaim />
            <SkeletonTokenClaim />
        </>
    );
}
