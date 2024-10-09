import classNames from "classnames";
import { Typography, Button, Skeleton } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import {
    useAccount,
    usePublicClient,
    useSimulateContract,
    useSwitchChain,
    useWriteContract,
} from "wagmi";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useCallback, useState } from "react";
import type { TokenClaims } from "..";
import { toast } from "sonner";
import { useChainData } from "@/src/hooks/useChainData";
import { formatTokenAmount } from "@/src/utils/format";
import { trackFathomEvent } from "@/src/utils/fathom";
import { RemoteLogo } from "@/src/components/remote-logo";
import { ClaimSuccess } from "../../notification/claim-success";
import { ClaimFail } from "../../notification/claim-fail";
import type { WriteContractErrorType } from "viem";

import styles from "./styles.module.css";

interface TokenClaimProps {
    chainId: number;
    tokenClaims: TokenClaims;
}

export function TokenClaim({ chainId, tokenClaims }: TokenClaimProps) {
    const t = useTranslations("claims");
    const { address: account } = useAccount();
    const publicClient = usePublicClient();
    const { switchChainAsync } = useSwitchChain();
    const { writeContractAsync } = useWriteContract();
    const chainData = useChainData(chainId);

    const [claiming, setClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);

    const {
        data: simulatedClaimAll,
        isLoading: simulatingClaimAll,
        isError: simulateClaimAllError,
    } = useSimulateContract({
        chainId,
        abi: metromAbi,
        address: chainData?.metromContract.address,
        functionName: "claimRewards",
        args: [
            !account
                ? []
                : tokenClaims.claims.map((claim) => {
                      return {
                          campaignId: claim.campaignId,
                          proof: claim.proof,
                          token: claim.token.address,
                          amount: claim.amount.raw,
                          receiver: account,
                      };
                  }),
        ],
        query: {
            refetchOnMount: false,
            enabled: !!account && tokenClaims.claims.length > 0,
        },
    });

    const handleClaim = useCallback(() => {
        if (!writeContractAsync || !publicClient || !simulatedClaimAll?.request)
            return;
        const claim = async () => {
            setClaiming(true);
            try {
                await switchChainAsync({ chainId });

                const tx = await writeContractAsync(simulatedClaimAll.request);
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
        simulatedClaimAll,
        tokenClaims.token,
        tokenClaims.totalAmount,
        switchChainAsync,
        writeContractAsync,
    ]);

    return (
        <div className={styles.root}>
            <div className={styles.leftWrapper}>
                <RemoteLogo
                    chain={chainId}
                    address={tokenClaims.token.address}
                    defaultText={tokenClaims.token.symbol}
                />
                <Typography variant="lg" weight="medium">
                    {tokenClaims.token.symbol}
                </Typography>
                <Typography variant="lg" weight="medium">
                    {formatTokenAmount({ amount: tokenClaims.totalAmount })}
                </Typography>
            </div>
            <Button
                variant="secondary"
                size="small"
                disabled={simulateClaimAllError || claimed}
                loading={simulatingClaimAll || claiming}
                iconPlacement="right"
                onClick={handleClaim}
            >
                {simulatingClaimAll
                    ? t("loading")
                    : claiming
                      ? t("claimingByToken", {
                            tokenSymbol: tokenClaims.token.symbol,
                        })
                      : t("claimByToken", {
                            tokenSymbol: tokenClaims.token.symbol,
                        })}
            </Button>
        </div>
    );
}

export function SkeletonTokenClaim() {
    return (
        <div className={classNames(styles.root)}>
            <div className={styles.leftWrapper}>
                <RemoteLogo loading />
                <Skeleton width={60} variant="lg" />
                <Skeleton width={70} variant="lg" />
            </div>
            <Button variant="secondary" size="small" loading />
        </div>
    );
}
