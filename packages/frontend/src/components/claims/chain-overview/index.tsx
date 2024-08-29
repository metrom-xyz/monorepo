import classNames from "@/src/utils/classes";
import type { ChainWithClaimsData } from "..";
import { Typography } from "@/src/ui/typography";
import { CHAIN_DATA, SUPPORTED_CHAIN_ICONS } from "@/src/commons";
import { type SupportedChain } from "@metrom-xyz/sdk";
import { Button } from "@/src/ui/button";
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

import styles from "./styles.module.css";

interface ChainOverviewProps {
    className?: string;
    chainWithClaimsData: ChainWithClaimsData;
}

export function ChainOverview({
    className,
    chainWithClaimsData,
}: ChainOverviewProps) {
    const t = useTranslations("claims");
    const { address: account } = useAccount();
    const publicClient = usePublicClient();
    const { switchChainAsync } = useSwitchChain();
    const { writeContractAsync } = useWriteContract();

    const [claiming, setClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);

    const ChainIcon =
        SUPPORTED_CHAIN_ICONS[chainWithClaimsData.chain.id as SupportedChain];

    const {
        data: simulatedClaimAll,
        isLoading: simulatingClaimAll,
        isError: simulateClaimAllError,
    } = useSimulateContract({
        chainId: chainWithClaimsData.chain.id,
        abi: metromAbi,
        address:
            CHAIN_DATA[chainWithClaimsData.chain.id as SupportedChain].contract
                .address,
        functionName: "claimRewards",
        args: [
            !account
                ? []
                : chainWithClaimsData.claims.map((claim) => {
                      return {
                          campaignId: claim.campaignId,
                          proof: claim.proof,
                          token: claim.token.address,
                          amount: parseUnits(
                              claim.amount.toString(),
                              claim.token.decimals,
                          ),
                          receiver: account,
                      };
                  }),
        ],
        query: {
            enabled: account && chainWithClaimsData.claims.length > 0,
        },
    });

    const handleClaimAll = useCallback(() => {
        if (!writeContractAsync || !publicClient || !simulatedClaimAll?.request)
            return;
        const create = async () => {
            setClaiming(true);
            try {
                await switchChainAsync({
                    chainId: chainWithClaimsData.chain.id,
                });

                const tx = await writeContractAsync(simulatedClaimAll.request);
                const receipt = await publicClient.waitForTransactionReceipt({
                    hash: tx,
                });

                if (receipt.status === "reverted") {
                    console.warn("Claim transaction reverted");
                    return;
                }

                setClaimed(true);
            } catch (error) {
                console.warn("Could not claim", error);
            } finally {
                setClaiming(false);
            }
        };
        void create();
    }, [
        chainWithClaimsData.chain.id,
        publicClient,
        simulatedClaimAll,
        switchChainAsync,
        writeContractAsync,
    ]);

    return (
        <div className={classNames(styles.root, className)}>
            <div className={styles.chainNameWrapper}>
                <ChainIcon className={styles.chainIcon} />
                <Typography variant="xl4">
                    {chainWithClaimsData.chain.name}
                </Typography>
            </div>
            <Button
                size="xsmall"
                disabled={simulateClaimAllError || claimed}
                loading={simulatingClaimAll || claiming}
                onClick={handleClaimAll}
            >
                {t("claimAll")}
            </Button>
        </div>
    );
}
