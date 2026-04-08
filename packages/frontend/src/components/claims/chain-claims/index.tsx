import { useTranslations } from "next-intl";
import {
    ChainType,
    type Erc20Token,
    type UsdPricedErc20Token,
} from "@metrom-xyz/sdk";
import { useMemo } from "react";
import { type Address } from "viem";
import { SkeletonTokenClaim, TokenClaim } from "./token-claim";
import { Accordion, Card, Typography } from "@metrom-xyz/ui";
import classNames from "classnames";
import type { ClaimWithRemaining } from "@/src/types/campaign";
import type { ChainWithRewardsData } from "..";
import { CampaignTitle } from "./campaign-title";

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
    claims: ClaimWithRemaining[];
    totalAmount: number;
}

interface CampaignClaims {
    chainId: number;
    chainType: ChainType;
    tokensClaims: Record<Address, TokenClaims>;
}

export function ChainClaims({
    onClaim,
    claims,
    claimingAll,
}: ChainOverviewProps) {
    const t = useTranslations("rewards.claims");

    const perCampaignPerToken = useMemo(() => {
        const reduced = claims.reduce(
            (acc, claim) => {
                const { campaignId, chainId, chainType } = claim;

                if (!acc[campaignId])
                    acc[campaignId] = {
                        chainId,
                        chainType,
                        tokensClaims: {},
                    };

                if (!acc[campaignId].tokensClaims[claim.token.address])
                    acc[campaignId].tokensClaims[claim.token.address] = {
                        token: claim.token,
                        claims: [],
                        totalAmount: 0,
                    };

                acc[campaignId].tokensClaims[claim.token.address].claims.push(
                    claim,
                );
                acc[campaignId].tokensClaims[claim.token.address].totalAmount +=
                    claim.remaining.formatted;

                return acc;
            },
            {} as Record<Address, CampaignClaims>,
        );

        return Object.entries(reduced).map(
            ([campaignId, { chainId, chainType, tokensClaims }]) => ({
                campaignId,
                chainId,
                chainType,
                tokensClaims: Object.values(tokensClaims),
            }),
        );
    }, [claims]);

    if (perCampaignPerToken.length === 0)
        return (
            <Card className={classNames(styles.root, styles.noClaimsCard)}>
                <Typography weight="medium" uppercase>
                    {t("empty.title")}
                </Typography>
            </Card>
        );

    return perCampaignPerToken.map(
        ({ campaignId, chainId, chainType, tokensClaims }) => {
            return (
                <div key={campaignId}>
                    <Accordion
                        title={
                            <CampaignTitle
                                campaignId={campaignId as Address}
                                chainId={chainId}
                                chainType={chainType}
                            />
                        }
                    >
                        {tokensClaims.map((tokenClaims) => (
                            <TokenClaim
                                key={tokenClaims.token.address}
                                chainId={chainId}
                                tokenClaims={tokenClaims}
                                claimingAll={claimingAll}
                                onClaim={onClaim}
                            />
                        ))}
                    </Accordion>
                </div>
            );
        },
    );
}

export function SkeletonChainClaims() {
    return (
        <>
            <SkeletonTokenClaim />
            <SkeletonTokenClaim />
        </>
    );
}
