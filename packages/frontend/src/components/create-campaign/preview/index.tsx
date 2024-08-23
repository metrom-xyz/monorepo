import { Button } from "@/src/ui/button";
import type { CampaignPayload } from "@/src/types";
import { NewCampaignIcon } from "@/src/assets/new-campaign-icon";
import {
    useAccount,
    useChainId,
    usePublicClient,
    useSimulateContract,
    useWriteContract,
} from "wagmi";
import numeral from "numeral";
import { parseUnits } from "viem";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { CHAIN_DATA } from "@/src/commons";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { WalletIcon } from "@/src/assets/wallet-icon";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { TextField } from "@/src/ui/text-field";
import { Rewards } from "./rewards";
import { Header } from "./header";

import styles from "./styles.module.css";

interface CampaignPreviewProps {
    malformedPayload: boolean;
    payload: CampaignPayload;
    onBack: () => void;
}

export function CampaignPreview({
    malformedPayload,
    payload,
    onBack,
}: CampaignPreviewProps) {
    const t = useTranslations("campaignPreview");
    const [creating, setCreating] = useState(false);

    const { openConnectModal } = useConnectModal();
    const chain: SupportedChain = useChainId();
    const publicClient = usePublicClient();
    const { address: connectedAddress } = useAccount();
    const { writeContractAsync } = useWriteContract();

    const {
        data: simulatedCreate,
        isLoading: simulatingCreate,
        isError: simulateCreateError,
        error,
    } = useSimulateContract({
        abi: metromAbi,
        address: CHAIN_DATA[chain].contract.address,
        functionName: "createCampaigns",
        args: [
            payload.pool &&
            payload.startDate &&
            payload.endDate &&
            payload.rewards &&
            payload.rewards.length > 0
                ? [
                      {
                          pool: payload.pool.address,
                          from: payload.startDate.unix(),
                          to: payload.endDate.unix(),
                          // TODO: add specification
                          specification:
                              "0x0000000000000000000000000000000000000000000000000000000000000000",
                          rewards: payload.rewards.map((reward) => ({
                              token: reward.token.address,
                              amount: parseUnits(
                                  reward.amount.toString(),
                                  reward.token.decimals,
                              ),
                          })),
                      },
                  ]
                : [],
        ],
        query: {
            enabled:
                !malformedPayload &&
                !!payload.pool &&
                !!payload.startDate &&
                !!payload.endDate &&
                !!payload.rewards &&
                payload.rewards.length > 0,
        },
    });

    const handleOnDeploy = useCallback(() => {
        if (!writeContractAsync || !publicClient || !simulatedCreate?.request)
            return;
        const create = async () => {
            setCreating(true);
            try {
                const tx = await writeContractAsync(simulatedCreate.request);
                const receipt = await publicClient.waitForTransactionReceipt({
                    hash: tx,
                });
                if (receipt.status === "reverted") {
                    console.warn("creation transaction reverted");
                    return;
                }
            } catch (error) {
                console.warn("could not create kpi token", error);
            } finally {
                setCreating(false);
            }
        };
        void create();
    }, [publicClient, simulatedCreate, writeContractAsync]);

    return (
        <div className={styles.root}>
            <Header payload={payload} onBack={onBack} />
            <div className={styles.content}>
                <div className={styles.contentGrid}>
                    <TextField
                        boxed
                        label={t("tvl")}
                        value={numeral(payload.pool?.tvl).format("($ 0.00 a)")}
                    />
                    {/* TODO: add apr */}
                    <TextField boxed label={t("apr")} value={"0.0%"} />
                </div>
                <Rewards rewards={payload.rewards} />
                <div className={styles.deployButtonContainer}>
                    {!connectedAddress ? (
                        <Button
                            icon={WalletIcon}
                            iconPlacement="right"
                            disabled={malformedPayload}
                            className={{ root: styles.deployButton }}
                            onClick={openConnectModal}
                        >
                            {t("connectWallet")}
                        </Button>
                    ) : (
                        <Button
                            icon={NewCampaignIcon}
                            iconPlacement="right"
                            disabled={malformedPayload || simulateCreateError}
                            loading={simulatingCreate || creating}
                            className={{ root: styles.deployButton }}
                            onClick={handleOnDeploy}
                        >
                            {t("deploy")}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
