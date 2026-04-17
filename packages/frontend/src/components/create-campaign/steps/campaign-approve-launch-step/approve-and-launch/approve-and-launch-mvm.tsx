import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { useChainData } from "@/src/hooks/useChainData";
import { Button } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import type { ApproveAndLaunchProps } from ".";
import { useCallback, useEffect, useState } from "react";
import { DistributablesType } from "@metrom-xyz/sdk";
import { type Address, zeroHash } from "viem";
import { buildCampaignDataBundleMvm } from "@/src/utils/campaign-bundle";
import { trackFathomEvent } from "@/src/utils/fathom";
import {
    useClients,
    useSignAndSubmitTransaction,
    useSimulateTransaction,
} from "@aptos-labs/react";
import { useAccount } from "@/src/hooks/useAccount";
import {
    Hex,
    Network,
    U32,
    U64,
    type InputGenerateTransactionPayloadData,
} from "@aptos-labs/ts-sdk";
import { ConnectButtonMvm } from "@/src/components/connect-button/mvm";
import { WalletIcon } from "@/src/assets/wallet-icon";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { chainIdToAptosNetwork } from "@/src/utils/chain";

import styles from "./styles.module.css";

export function ApproveAndDeployMvm({
    payload,
    specificationHash,
    uploadingSpecification,
    disabled,
    onAllTokensApproved,
    onLaunch,
}: ApproveAndLaunchProps) {
    const t = useTranslations("newCampaign.form.approveLaunch");
    const { id: chainId } = useChainWithType();
    const chainData = useChainData({ chainId });
    const payloadChainData = useChainData({ chainId: payload.chainId });
    const { address } = useAccount();
    const { changeNetwork, connected } = useWallet();
    const { aptos } = useClients();

    const [deploying, setDeploying] = useState(false);
    const [txPayload, setTxPayload] =
        useState<InputGenerateTransactionPayloadData>();

    // No token approval needed for Aptos
    useEffect(() => {
        onAllTokensApproved(true);
    }, [onAllTokensApproved]);

    useEffect(() => {
        const build = async () => {
            if (!chainData || !address) return null;

            const data = buildCampaignDataBundleMvm(payload);
            if (data === null) return null;

            const specHash =
                specificationHash === zeroHash
                    ? null
                    : Hex.fromHexInput(specificationHash).toUint8Array();

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

            if (payload.isDistributing(DistributablesType.FixedPoints)) {
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

                onLaunch();
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
        onLaunch,
    ]);

    const handleNetworkOnSwitch = useCallback(async () => {
        const network = chainIdToAptosNetwork(payload.chainId);
        if (!network || !connected || payload.chainId === chainId) return;

        try {
            await changeNetwork(network as string as Network);
        } catch (error) {
            console.error("Error switching network", error);
        }
    }, [payload.chainId, connected, chainId, changeNetwork]);

    if (payload.chainId !== chainId) {
        return (
            <div className={styles.buttonsWrapper}>
                <Button
                    onClick={handleNetworkOnSwitch}
                    className={{ root: styles.button }}
                >
                    {t("switchChain", { chain: payloadChainData?.name || "" })}
                </Button>
            </div>
        );
    }

    if (!connected)
        return (
            <div className={styles.buttonsWrapper}>
                <ConnectButtonMvm
                    customComponent={
                        <Button
                            icon={WalletIcon}
                            iconPlacement="right"
                            className={{ root: styles.button }}
                        >
                            {t("connectWallet")}
                        </Button>
                    }
                />
            </div>
        );

    return (
        <div className={styles.buttonsWrapper}>
            <Button
                icon={ArrowRightIcon}
                iconPlacement="right"
                disabled={
                    disabled ||
                    simulateCreateErrored ||
                    (!!simulatedCreate && !simulatedCreate.success)
                }
                loading={
                    uploadingSpecification || simulatingCreate || deploying
                }
                onClick={handleOnStandardDeploy}
                className={{ root: styles.button }}
            >
                {t("deploy")}
            </Button>
        </div>
    );
}
