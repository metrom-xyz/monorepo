import { Typography, Button, Card } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { formatAmount, formatUsdAmount } from "@/src/utils/format";
import { trackFathomEvent } from "@/src/utils/fathom";
import { RemoteLogo } from "@/src/components/remote-logo";
import { ClaimSuccess } from "../../notification/claim-success";
import { ClaimFail } from "../../notification/claim-fail";
import { useChainData } from "@/src/hooks/useChainData";
import { useAccount } from "@/src/hooks/useAccount";
import type { TokenClaimProps } from ".";
import {
    type MoveFunctionId,
    type InputGenerateTransactionPayloadData,
} from "@aptos-labs/ts-sdk";
import {
    useClients,
    useSignAndSubmitTransaction,
    useSimulateTransaction,
} from "@aptos-labs/react";
import { buildRewardsFunctionArgs } from "@/src/utils/aptos";

import styles from "./styles.module.css";

export function TokenClaimMvm({
    onClaim,
    chainId,
    tokenClaims,
    claimingAll,
}: TokenClaimProps) {
    const t = useTranslations("rewards.claims");
    const { address: account } = useAccount();
    const chainData = useChainData({ chainId });
    const { aptos } = useClients();

    const [claiming, setClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);

    const claimRewardsTxPayload:
        | InputGenerateTransactionPayloadData
        | undefined = useMemo(() => {
        if (!account || !chainData) return undefined;

        const { metromContract: metrom } = chainData;
        const moveFunction: MoveFunctionId = `${metrom.address}::metrom::claim_rewards`;

        return {
            function: moveFunction,
            functionArguments: buildRewardsFunctionArgs(
                account,
                tokenClaims.claims,
            ),
        };
    }, [account, chainData, tokenClaims.claims]);

    const {
        data: simulatedClaim,
        isLoading: simulatingClaim,
        isError: simulatedClaimErrored,
    } = useSimulateTransaction({
        data: claimRewardsTxPayload,
        options: {
            estimateGasUnitPrice: true,
            estimateMaxGasAmount: true,
        },
    });

    useEffect(() => {
        if (simulatingClaim || (simulatedClaim && simulatedClaim.success))
            return;

        console.warn(
            `Claim simulation failed with error ${simulatedClaim?.vm_status}`,
            simulatedClaim,
        );
    }, [simulatingClaim, simulatedClaim]);

    const { signAndSubmitTransactionAsync } = useSignAndSubmitTransaction();

    const handleStandardClaim = useCallback(() => {
        if (
            !claimRewardsTxPayload ||
            simulatedClaimErrored ||
            !simulatedClaim?.success
        )
            return;

        const claim = async () => {
            setClaiming(true);
            try {
                const tx = await signAndSubmitTransactionAsync({
                    data: claimRewardsTxPayload,
                });
                const receipt = await aptos.waitForTransaction({
                    transactionHash: tx.hash,
                });

                if (!receipt.success) {
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
                toast.custom((toastId) => <ClaimFail toastId={toastId} />);
                console.warn("Could not claim", error);
            } finally {
                setClaiming(false);
            }
        };
        void claim();
    }, [
        aptos,
        chainId,
        simulatedClaim,
        simulatedClaimErrored,
        tokenClaims.token,
        tokenClaims.totalAmount,
        claimRewardsTxPayload,
        signAndSubmitTransactionAsync,
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
                    <Typography size="sm" weight="medium" light>
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
                disabled={
                    simulatedClaimErrored ||
                    !simulatedClaim?.success ||
                    claimed ||
                    claimingAll
                }
                loading={simulatingClaim || claiming || claimingAll}
                iconPlacement="right"
                onClick={handleStandardClaim}
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
