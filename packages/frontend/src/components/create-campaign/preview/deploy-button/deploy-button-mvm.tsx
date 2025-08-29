import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { useChainId } from "@/src/hooks/use-chain-id";
import { useChainData } from "@/src/hooks/useChainData";
import { Button } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import type { DeployButtonProps } from ".";
import { useCallback, useEffect, useState } from "react";
import { DistributablesType } from "@metrom-xyz/sdk";
import { type Address, hexToBytes, zeroHash } from "viem";
import { buildCampaignDataBundleMvm } from "@/src/utils/campaign";
import { trackFathomEvent } from "@/src/utils/fathom";
import {
    useClients,
    useSignAndSubmitTransaction,
    useSimulateTransaction,
} from "@aptos-labs/react";
import { useAccount } from "@/src/hooks/use-account";
import {
    U32,
    U64,
    type InputGenerateTransactionPayloadData,
} from "@aptos-labs/ts-sdk";

import styles from "./styles.module.css";

export function DeployButtonMvm({
    payload,
    specificationHash,
    uploadingSpecification,
    disabled,
    onCreate,
}: DeployButtonProps) {
    const t = useTranslations("campaignPreview");
    const chainId = useChainId();
    const chainData = useChainData({ chainId });
    const { address } = useAccount();
    const { aptos } = useClients();

    const [deploying, setDeploying] = useState(false);
    const [txPayload, setTxPayload] =
        useState<InputGenerateTransactionPayloadData>();

    useEffect(() => {
        const build = async () => {
            if (!chainData || !address) return null;

            const data = buildCampaignDataBundleMvm(payload);
            if (data === null) return null;

            const specHash =
                specificationHash === zeroHash
                    ? null
                    : hexToBytes(specificationHash);

            if (payload.isDistributing(DistributablesType.Tokens)) {
                const rewardTokens: Address[] = [];
                const rewardAmounts: U64[] = [];

                payload.distributables.tokens.forEach(({ token, amount }) => {
                    rewardTokens.push(token.address);
                    rewardAmounts.push(new U64(amount.raw));
                });

                setTxPayload({
                    function: `${chainData.metromContract.address}::metrom::create_rewards_campaign`,
                    functionArguments: [
                        new U64(payload.startDate.unix()),
                        new U64(payload.endDate.unix()),
                        new U32(payload.kind),
                        data,
                        specHash,
                        rewardTokens,
                        rewardAmounts,
                    ],
                });
            }

            if (payload.isDistributing(DistributablesType.Points)) {
                setTxPayload({
                    function: `${chainData.metromContract.address}::metrom::create_points_campaign`,
                    functionArguments: [
                        new U64(payload.startDate.unix()),
                        new U64(payload.endDate.unix()),
                        new U32(payload.kind),
                        data,
                        specHash,
                        new U64(payload.distributables.points),
                        payload.distributables.fee.token.address,
                    ],
                });
            }
        };

        build();
    }, [payload, specificationHash, address, chainData]);

    const {
        data: simulatedCreate,
        isLoading: simulatingCreate,
        isError: simulateCreateErrored,
        error: simulateCreateError,
    } = useSimulateTransaction({
        data: txPayload,
    });

    const { signAndSubmitTransactionAsync } = useSignAndSubmitTransaction();

    const handleOnStandardDeploy = useCallback(() => {
        if (simulateCreateErrored || !simulatedCreate?.success) {
            console.warn(
                `Could not deploy the campaign: ${simulateCreateError}`,
            );
            return;
        }

        if (!signAndSubmitTransactionAsync || !txPayload) return;

        const create = async () => {
            setDeploying(true);
            try {
                const tx = await signAndSubmitTransactionAsync({
                    data: txPayload,
                });
                const receipt = await aptos.waitForTransaction({
                    transactionHash: tx.hash,
                });

                if (!receipt.success) {
                    console.warn("Creation transaction reverted");
                    return;
                }

                onCreate();
                trackFathomEvent("CLICK_DEPLOY_CAMPAIGN");
            } catch (error) {
                console.warn("Could not create campaign", error);
            } finally {
                setDeploying(false);
            }
        };
        void create();
    }, [
        aptos,
        simulatedCreate,
        simulateCreateError,
        simulateCreateErrored,
        txPayload,
        signAndSubmitTransactionAsync,
        onCreate,
    ]);

    return (
        <Button
            icon={ArrowRightIcon}
            iconPlacement="right"
            disabled={
                disabled || simulateCreateErrored || !simulatedCreate?.success
            }
            loading={uploadingSpecification || simulatingCreate || deploying}
            className={{ root: styles.button }}
            onClick={handleOnStandardDeploy}
        >
            {t("deploy")}
        </Button>
    );
}
