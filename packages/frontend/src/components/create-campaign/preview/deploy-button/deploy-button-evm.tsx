import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { SAFE } from "@/src/commons/env";
import { useChainId } from "@/src/hooks/useChainId";
import { useChainData } from "@/src/hooks/useChainData";
import { Button } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { usePublicClient, useSimulateContract, useWriteContract } from "wagmi";
import type { DeployButtonProps } from ".";
import { useCallback, useMemo, useState } from "react";
import {
    DistributablesType,
    type UsdPricedErc20TokenAmount,
} from "@metrom-xyz/sdk";
import { formatUnits, parseUnits, encodeFunctionData } from "viem";
import { buildCampaignDataBundleEvm } from "@/src/utils/campaign";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import type { BaseTransaction } from "@safe-global/safe-apps-sdk";
import { trackFathomEvent } from "@/src/utils/fathom";
import { SAFE_APP_SDK } from "@/src/commons";
import { ApproveTokensButton } from "../approve-tokens-button";

import styles from "./styles.module.css";

export function DeployButtonEvm({
    payload,
    specificationHash,
    uploadingSpecification,
    disabled,
    onCreate,
}: DeployButtonProps) {
    const t = useTranslations("campaignPreview");
    const chainId = useChainId();
    const chainData = useChainData({ chainId });
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();

    const [tokensApproved, setTokensApproved] = useState(false);
    const [safeTxs, setSafeTxs] = useState<BaseTransaction[]>([]);
    const [deploying, setDeploying] = useState(false);

    const tokensToApprove: [
        UsdPricedErc20TokenAmount,
        ...UsdPricedErc20TokenAmount[],
    ] = useMemo(() => {
        switch (payload.distributables.type) {
            case DistributablesType.Tokens: {
                return payload.distributables.tokens;
            }
            case DistributablesType.Points: {
                const { amount, token } = payload.distributables.fee;
                const adjustedFeeAmountRaw = (amount.raw * 115n) / 100n;
                const adjustedFeeAmountFormatted = Number(
                    formatUnits(adjustedFeeAmountRaw, token.decimals),
                );
                return [
                    {
                        token,
                        amount: {
                            raw: adjustedFeeAmountRaw,
                            formatted: adjustedFeeAmountFormatted,
                            usdValue:
                                adjustedFeeAmountFormatted * token.usdPrice,
                        },
                    },
                ];
            }
        }
    }, [payload.distributables]);

    const [tokensCampaignArgs, pointsCampaignArgs] = useMemo(() => {
        const { kind, startDate, endDate } = payload;

        if (!tokensApproved || !startDate || !endDate) return [[], []];

        let tokenArgs = [];
        let pointArgs = [];

        const data = buildCampaignDataBundleEvm(payload);
        if (data === null) return [[], []];

        if (payload.isDistributing(DistributablesType.Tokens))
            tokenArgs.push({
                from: startDate.unix(),
                to: endDate.unix(),
                kind,
                data,
                specificationHash,
                rewards: payload.distributables.tokens.map((token) => ({
                    token: token.token.address,
                    amount: token.amount.raw,
                })),
            });

        if (payload.isDistributing(DistributablesType.Points))
            pointArgs.push({
                from: startDate.unix(),
                to: endDate.unix(),
                kind,
                data,
                specificationHash,
                points: parseUnits(
                    payload.distributables.points.toString(),
                    18,
                ),
                feeToken: payload.distributables.fee.token.address,
            });

        return [tokenArgs, pointArgs];
    }, [payload, specificationHash, tokensApproved]);

    const {
        data: simulatedCreate,
        isLoading: simulatingCreate,
        isError: simulateCreateErrored,
        error: simulateCreateError,
    } = useSimulateContract({
        abi: metromAbi,
        address: chainData?.metromContract.address,
        functionName: "createCampaigns",
        args: [tokensCampaignArgs, pointsCampaignArgs],
        query: {
            enabled:
                !SAFE &&
                (tokensCampaignArgs.length > 0 ||
                    pointsCampaignArgs.length > 0),
        },
    });

    const handleSafeTransaction = useCallback(
        (tx: BaseTransaction) => {
            setSafeTxs([...safeTxs, tx]);
        },
        [safeTxs],
    );

    function handleOnRewardsApproved() {
        setTokensApproved(true);
    }

    const handleOnStandardDeploy = useCallback(() => {
        if (simulateCreateErrored) {
            console.warn(
                `Could not deploy the campaign: ${simulateCreateError}`,
            );
            return;
        }

        if (!writeContractAsync || !publicClient || !simulatedCreate?.request)
            return;

        const create = async () => {
            setDeploying(true);
            try {
                const tx = await writeContractAsync(simulatedCreate.request);
                const receipt = await publicClient.waitForTransactionReceipt({
                    hash: tx,
                });

                if (receipt.status === "reverted") {
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
        publicClient,
        simulateCreateError,
        simulateCreateErrored,
        simulatedCreate?.request,
        onCreate,
        writeContractAsync,
    ]);

    const handleOnSafeDeploy = useCallback(() => {
        if (
            !chainData ||
            (tokensCampaignArgs.length === 0 && pointsCampaignArgs.length === 0)
        ) {
            console.warn(
                "Missing parameters to deploy campaign through Safe: aborting",
            );
            return;
        }

        safeTxs.push({
            to: chainData.metromContract.address,
            data: encodeFunctionData({
                abi: metromAbi,
                functionName: "createCampaigns",
                args: [tokensCampaignArgs, pointsCampaignArgs],
            }),
            value: "0",
        });

        const create = async () => {
            setDeploying(true);
            try {
                await SAFE_APP_SDK.txs.send({ txs: safeTxs });

                onCreate();
                trackFathomEvent("CLICK_DEPLOY_CAMPAIGN");
            } catch (error) {
                console.warn("Could not create campaign", error);
            } finally {
                setDeploying(false);
            }
        };

        void create();
    }, [chainData, safeTxs, tokensCampaignArgs, pointsCampaignArgs, onCreate]);

    return (
        <>
            {tokensApproved && (
                <Button
                    icon={ArrowRightIcon}
                    iconPlacement="right"
                    disabled={disabled || simulateCreateErrored}
                    loading={
                        uploadingSpecification || simulatingCreate || deploying
                    }
                    className={{ root: styles.button }}
                    onClick={SAFE ? handleOnSafeDeploy : handleOnStandardDeploy}
                >
                    {t("deploy")}
                </Button>
            )}
            <ApproveTokensButton
                tokenAmounts={tokensToApprove}
                onApproved={handleOnRewardsApproved}
                onSafeTx={handleSafeTransaction}
            />
        </>
    );
}
