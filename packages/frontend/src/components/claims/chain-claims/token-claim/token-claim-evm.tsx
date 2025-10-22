import { Typography, Button, Card } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import {
    usePublicClient,
    useSimulateContract,
    useSwitchChain,
    useWriteContract,
} from "wagmi";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { formatAmount, formatUsdAmount } from "@/src/utils/format";
import { trackFathomEvent } from "@/src/utils/fathom";
import { RemoteLogo } from "@/src/components/remote-logo";
import { ClaimSuccess } from "../../notification/claim-success";
import { ClaimFail } from "../../notification/claim-fail";
import { type WriteContractErrorType, encodeFunctionData } from "viem";
import { SAFE } from "@/src/commons/env";
import { SAFE_APP_SDK } from "@/src/commons";
import { useChainData } from "@/src/hooks/useChainData";
import { useAccount } from "@/src/hooks/useAccount";
import type { TokenClaimProps } from ".";
import { ChainType } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

export function TokenClaimEvm({
    onClaim,
    chainId,
    tokenClaims,
    claimingAll,
}: TokenClaimProps) {
    const t = useTranslations("rewards.claims");
    const { address: account } = useAccount();
    const publicClient = usePublicClient();
    const { switchChainAsync } = useSwitchChain();
    const { writeContractAsync } = useWriteContract();
    const chainData = useChainData({ chainId, chainType: ChainType.Evm });

    const [claiming, setClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);

    const claimRewardsArgs = useMemo(() => {
        if (!account) return [];

        return tokenClaims.claims.map((claim) => {
            return {
                campaignId: claim.campaignId,
                proof: claim.proof,
                token: claim.token.address,
                amount: claim.amount.raw,
                receiver: account,
            };
        });
    }, [account, tokenClaims.claims]);

    const {
        data: simulatedClaim,
        isLoading: simulatingClaim,
        isError: simulateClaimError,
    } = useSimulateContract({
        chainId,
        abi: metromAbi,
        address: chainData?.metromContract.address,
        functionName: "claimRewards",
        args: [claimRewardsArgs],
        query: {
            refetchOnMount: false,
            enabled: !SAFE && !!account && tokenClaims.claims.length > 0,
        },
    });

    const handleStandardClaim = useCallback(() => {
        if (!writeContractAsync || !publicClient || !simulatedClaim?.request)
            return;
        const claim = async () => {
            setClaiming(true);
            try {
                await switchChainAsync({ chainId });

                const tx = await writeContractAsync(simulatedClaim.request);
                const receipt = await publicClient.waitForTransactionReceipt({
                    hash: tx,
                });

                if (receipt.status === "reverted") {
                    console.warn("Claim transaction reverted");
                    throw new Error("Transaction reverted");
                }

                toast.custom((toastId) => (
                    <ClaimSuccess
                        toastId={toastId}
                        chain={chainId}
                        token={tokenClaims.token}
                        amount={tokenClaims.totalAmount}
                    />
                ));
                setClaimed(true);
                onClaim(tokenClaims.token);
                trackFathomEvent("CLICK_CLAIM_SINGLE");
            } catch (error) {
                if (
                    !(error as WriteContractErrorType).message.includes(
                        "User rejected",
                    )
                )
                    toast.custom((toastId) => <ClaimFail toastId={toastId} />);

                console.warn("Could not claim", error);
            } finally {
                setClaiming(false);
            }
        };
        void claim();
    }, [
        chainId,
        publicClient,
        simulatedClaim,
        tokenClaims.token,
        tokenClaims.totalAmount,
        onClaim,
        writeContractAsync,
        switchChainAsync,
    ]);

    const handleSafeClaim = useCallback(() => {
        if (!chainData) {
            console.warn(
                "Missing parameters to claim rewards through Safe: aborting",
            );
            return;
        }

        const claim = async () => {
            setClaiming(true);
            try {
                await SAFE_APP_SDK.txs.send({
                    txs: [
                        {
                            to: chainData.metromContract.address,
                            data: encodeFunctionData({
                                abi: metromAbi,
                                functionName: "claimRewards",
                                args: [claimRewardsArgs],
                            }),
                            value: "0",
                        },
                    ],
                });

                toast.custom((toastId) => (
                    <ClaimSuccess
                        toastId={toastId}
                        chain={chainId}
                        token={tokenClaims.token}
                        amount={tokenClaims.totalAmount}
                        safe
                    />
                ));
                setClaimed(true);
                onClaim(tokenClaims.token);
                trackFathomEvent("CLICK_CLAIM_SINGLE");
            } catch (error) {
                console.warn("Could not claim", error);
            } finally {
                setClaiming(false);
            }
        };

        void claim();
    }, [
        chainData,
        claimRewardsArgs,
        chainId,
        tokenClaims.token,
        tokenClaims.totalAmount,
        onClaim,
    ]);

    return (
        <Card className={styles.root}>
            <div className={styles.leftWrapper}>
                <RemoteLogo
                    chain={chainId}
                    address={tokenClaims.token.address}
                    defaultText={tokenClaims.token.symbol}
                />
                <Typography size="lg" weight="medium">
                    {tokenClaims.token.symbol}
                </Typography>
                <div className={styles.amountWrapper}>
                    <Typography size="lg" weight="medium">
                        {formatAmount({ amount: tokenClaims.totalAmount })}
                    </Typography>
                    <Typography size="sm" weight="medium" variant="tertiary">
                        {formatUsdAmount({
                            amount:
                                tokenClaims.totalAmount *
                                tokenClaims.token.usdPrice,
                        })}
                    </Typography>
                </div>
            </div>
            <Button
                variant="secondary"
                size="sm"
                disabled={simulateClaimError || claimed || claimingAll}
                loading={simulatingClaim || claiming || claimingAll}
                iconPlacement="right"
                onClick={SAFE ? handleSafeClaim : handleStandardClaim}
            >
                {simulatingClaim
                    ? t("loading")
                    : claiming || claimingAll
                      ? t("claimingByToken")
                      : t("claimByToken")}
            </Button>
        </Card>
    );
}
