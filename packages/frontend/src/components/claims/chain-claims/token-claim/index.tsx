import classNames from "classnames";
import { Typography, Button, RemoteLogo, Skeleton } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import {
    useAccount,
    usePublicClient,
    useSimulateContract,
    useSwitchChain,
    useWriteContract,
} from "wagmi";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { parseUnits } from "viem";
import { useCallback, useState } from "react";
import type { TokenClaims } from "..";
import { useChainData } from "@/src/hooks/useChainData";
import { formatTokenAmount } from "@/src/utils/format";
import { trackFathomEvent } from "@/src/utils/fathom";

import styles from "./styles.module.css";

interface TokenClaimProps {
    chainId: number;
    chainClaims: TokenClaims;
}

export function TokenClaim({ chainId, chainClaims }: TokenClaimProps) {
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
                : chainClaims.claims.map((claim) => {
                      return {
                          campaignId: claim.campaignId,
                          proof: claim.proof,
                          token: claim.token.address,
                          amount: parseUnits(
                              claim.amount.toFixed(claim.token.decimals),
                              claim.token.decimals,
                          ),
                          receiver: account,
                      };
                  }),
        ],
        query: {
            refetchOnMount: false,
            enabled: !!account && chainClaims.claims.length > 0,
        },
    });

    const handleClaim = useCallback(() => {
        if (!writeContractAsync || !publicClient || !simulatedClaimAll?.request)
            return;
        const create = async () => {
            setClaiming(true);
            try {
                await switchChainAsync({ chainId });

                const tx = await writeContractAsync(simulatedClaimAll.request);
                const receipt = await publicClient.waitForTransactionReceipt({
                    hash: tx,
                });

                if (receipt.status === "reverted") {
                    console.warn("Claim transaction reverted");
                    return;
                }

                setClaimed(true);
                trackFathomEvent("CLICK_CLAIM_SINGLE");
            } catch (error) {
                console.warn("Could not claim", error);
            } finally {
                setClaiming(false);
            }
        };
        void create();
    }, [
        chainId,
        publicClient,
        simulatedClaimAll,
        switchChainAsync,
        writeContractAsync,
    ]);

    return (
        <div className={classNames(styles.root)}>
            <div className={styles.leftWrapper}>
                <RemoteLogo
                    size="lg"
                    chain={chainId}
                    address={chainClaims.token.address}
                    defaultText={chainClaims.token.symbol}
                />
                <Typography variant="lg" weight="medium">
                    {chainClaims.token.symbol}
                </Typography>
                <Typography variant="lg" weight="medium">
                    {formatTokenAmount(chainClaims.totalAmount)}
                </Typography>
            </div>
            <Button
                variant="secondary"
                size="small"
                disabled={simulateClaimAllError || claimed}
                loading={simulatingClaimAll || claiming}
                onClick={handleClaim}
            >
                {t("claimByToken", { tokenSymbol: chainClaims.token.symbol })}
            </Button>
        </div>
    );
}

export function SkeletonTokenClaim() {
    return (
        <div className={classNames(styles.root)}>
            <div className={styles.leftWrapper}>
                <RemoteLogo loading size="lg" />
                <Skeleton width={60} variant="lg" />
                <Skeleton width={70} variant="lg" />
            </div>
            <Button variant="secondary" size="small" loading />
        </div>
    );
}
