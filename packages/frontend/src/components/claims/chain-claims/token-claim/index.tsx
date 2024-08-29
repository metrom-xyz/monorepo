import classNames from "@/src/utils/classes";
import { Typography } from "@/src/ui/typography";
import { CHAIN_DATA } from "@/src/commons";
import { type SupportedChain } from "@metrom-xyz/sdk";
import { Button } from "@/src/ui/button";
import { useTranslations } from "next-intl";
import {
    useAccount,
    usePublicClient,
    useSimulateContract,
    useWriteContract,
} from "wagmi";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { parseUnits } from "viem";
import { useCallback, useState } from "react";
import { RemoteLogo } from "@/src/ui/remote-logo";
import numeral from "numeral";
import type { TokenClaims } from "..";

import styles from "./styles.module.css";

interface TokenClaimProps {
    chainId: number;
    chainClaims: TokenClaims;
}

export function TokenClaim({ chainId, chainClaims }: TokenClaimProps) {
    const t = useTranslations("claims");
    const { address: account } = useAccount();
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();

    const [claiming, setClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);

    const {
        data: simulatedClaimAll,
        isLoading: simulatingClaimAll,
        isError: simulateClaimAllError,
    } = useSimulateContract({
        abi: metromAbi,
        address: CHAIN_DATA[chainId as SupportedChain].contract.address,
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
                              claim.amount.toString(),
                              claim.token.decimals,
                          ),
                          receiver: account,
                      };
                  }),
        ],
        query: {
            enabled: account && chainClaims.claims.length > 0,
        },
    });

    const handleClaim = useCallback(() => {
        if (!writeContractAsync || !publicClient || !simulatedClaimAll?.request)
            return;
        const create = async () => {
            setClaiming(true);
            try {
                const tx = await writeContractAsync(simulatedClaimAll.request);
                const receipt = await publicClient.waitForTransactionReceipt({
                    hash: tx,
                });

                if (receipt.status === "reverted") {
                    console.warn("creation transaction reverted");
                    return;
                }

                setClaimed(true);
            } catch (error) {
                console.warn("could not create kpi token", error);
            } finally {
                setClaiming(false);
            }
        };
        void create();
    }, [publicClient, simulatedClaimAll, writeContractAsync]);

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
                    {numeral(chainClaims.totalAmount).format("(0.00[00]a")}
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
