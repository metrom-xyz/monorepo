import { useTranslations } from "next-intl";
import {
    useAccount,
    useChainId,
    usePublicClient,
    useSimulateContract,
    useWriteContract,
} from "wagmi";
import { parseUnits } from "viem";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { Button } from "@/src/ui/button";
import { WalletIcon } from "@/src/assets/wallet-icon";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useCallback, useEffect, useState } from "react";
import { ApproveRewards } from "./approve-rewards";
import type { CampaignPayload } from "@/src/types";
import { NewCampaignIcon } from "@/src/assets/new-campaign-icon";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { CHAIN_DATA } from "@/src/commons";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { View } from "..";

import styles from "./styles.module.css";

interface SubmitButtonProps {
    malformedPayload: boolean;
    view: View;
    payload: CampaignPayload;
    onPreviewClick: () => void;
}

export function SubmitButton({
    malformedPayload,
    view,
    payload,
    onPreviewClick,
}: SubmitButtonProps) {
    const t = useTranslations("newCampaign.submit");
    const [approved, setApproved] = useState(false);
    const [creating, setCreating] = useState(false);

    const { openConnectModal } = useConnectModal();
    const chain: SupportedChain = useChainId();
    const publicClient = usePublicClient();
    const { address: connectedAddress } = useAccount();
    const { writeContractAsync } = useWriteContract();

    useEffect(() => {
        setApproved(false);
    }, [payload.rewards?.length]);

    const {
        data: simulatedCreate,
        isLoading: simulatingCreate,
        isError: simulateCreateError,
    } = useSimulateContract({
        abi: metromAbi,
        address: CHAIN_DATA[chain].contract.address,
        functionName: "createCampaigns",
        args: [
            payload.pool &&
            payload.startDate &&
            payload.endDate &&
            payload.rewards
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
                !!payload.pool &&
                !!payload.startDate &&
                !!payload.endDate &&
                !!payload.rewards,
        },
    });

    const handleOnApprove = useCallback(() => {
        setApproved(true);
    }, []);

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

    if (!connectedAddress)
        return (
            <Button
                icon={WalletIcon}
                iconPlacement="right"
                disabled={malformedPayload}
                className={{ root: styles.button }}
                onClick={openConnectModal}
            >
                {t("connectWallet")}
            </Button>
        );

    if (!approved && payload?.rewards && payload.rewards.length > 0)
        return (
            <ApproveRewards
                onApprove={handleOnApprove}
                rewards={payload?.rewards}
                spender={CHAIN_DATA[chain].contract.address}
            />
        );

    if (view === View.preview)
        return (
            <Button
                icon={NewCampaignIcon}
                iconPlacement="right"
                disabled={malformedPayload || simulateCreateError}
                loading={simulatingCreate || creating}
                className={{ root: styles.button }}
                onClick={handleOnDeploy}
            >
                {t("deploy")}
            </Button>
        );

    return (
        <Button
            icon={ArrowRightIcon}
            iconPlacement="right"
            disabled={malformedPayload}
            className={{ root: styles.button }}
            onClick={onPreviewClick}
        >
            {t("preview")}
        </Button>
    );
}
