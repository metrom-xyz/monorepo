import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { SAFE } from "@/src/commons/env";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { useChainData } from "@/src/hooks/useChainData";
import { Button } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import {
    useAccount,
    usePublicClient,
    useReadContracts,
    useSimulateContract,
    useSwitchChain,
    useWriteContract,
} from "wagmi";
import type { ApproveAndLaunchProps } from ".";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    DistributablesType,
    type UsdPricedErc20TokenAmount,
} from "@metrom-xyz/sdk";
import {
    formatUnits,
    parseUnits,
    encodeFunctionData,
    type Address,
    erc20Abi,
} from "viem";
import { buildCampaignDataBundleEvm } from "@/src/utils/campaign-bundle";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import type { BaseTransaction } from "@safe-global/safe-apps-sdk";
import { trackFathomEvent } from "@/src/utils/fathom";
import { SAFE_APP_SDK } from "@/src/commons";
import { ApproveTokensButton } from "../approve-tokens-button";
import { TokenToApproveEvm } from "./token-to-approve-evm";
import classNames from "classnames";
import type { Erc20TokenAmountWithAllowance } from "@/src/types/campaign/common";
import { useIsChainSupported } from "@/src/hooks/useIsChainSupported";

import styles from "./styles.module.css";

export function ApproveAndDeployEvm({
    payload,
    specificationHash,
    uploadingSpecification,
    disabled,
    onAllTokensApproved,
    onLaunch,
}: ApproveAndLaunchProps) {
    const [safeTxs, setSafeTxs] = useState<BaseTransaction[]>([]);
    const [deploying, setDeploying] = useState(false);
    const [tokensToApproveWithAllowance, setTokensToApproveWithAllowance] =
        useState<Erc20TokenAmountWithAllowance[]>([]);

    const t = useTranslations("newCampaign.form.approveLaunch");
    const { id: chainId } = useChainWithType();
    const connectedChainData = useChainData({ chainId });
    const deployChainSupported = useIsChainSupported({ chainId });
    const { address: connectedAddress } = useAccount();
    const payloadChainData = useChainData({ chainId: payload.chainId });
    const publicClient = usePublicClient();
    const { switchChain } = useSwitchChain();
    const { writeContractAsync } = useWriteContract();

    const allTokensApproved = !tokensToApproveWithAllowance.some(
        ({ approved }) => !approved,
    );

    const tokensToApprove: [
        UsdPricedErc20TokenAmount,
        ...UsdPricedErc20TokenAmount[],
    ] = useMemo(() => {
        switch (payload.distributables.type) {
            case DistributablesType.Tokens: {
                return payload.distributables.tokens;
            }
            case DistributablesType.FixedPoints: {
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
            // TODO: implement dynamic points
            case DistributablesType.DynamicPoints: {
                throw new Error("Not implemented");
            }
            case DistributablesType.NoDistributables: {
                throw new Error("Not supported");
            }
        }
    }, [payload.distributables]);

    const {
        data: tokensAllowances,
        isLoading: loadingTokensAllowances,
        refetch: refetchAllowances,
    } = useReadContracts({
        contracts:
            connectedAddress &&
            connectedChainData?.metromContract.address &&
            tokensToApprove.map((token) => {
                return {
                    address: token.token.address,
                    abi: erc20Abi,
                    functionName: "allowance",
                    args: [
                        connectedAddress,
                        connectedChainData.metromContract.address,
                    ],
                };
            }),
        query: {
            enabled:
                !!connectedAddress &&
                tokensToApprove.length > 0 &&
                !!connectedChainData?.metromContract.address,
        },
    });

    useEffect(() => {
        onAllTokensApproved(allTokensApproved);
    }, [allTokensApproved, onAllTokensApproved]);

    useEffect(() => {
        refetchAllowances();
    }, [tokensToApprove, refetchAllowances]);

    useEffect(() => {
        if (
            !tokensAllowances ||
            tokensAllowances.length !== tokensToApprove.length
        )
            return;

        const tokensWithAllowances: Erc20TokenAmountWithAllowance[] = [];
        for (let i = 0; i < tokensToApprove.length; i++) {
            const token = tokensToApprove[i];
            if (
                tokensAllowances[i]?.result === null ||
                tokensAllowances[i]?.result === undefined
            )
                continue;

            tokensWithAllowances.push({
                ...token,
                allowance: tokensAllowances[i].result as bigint,
                approving: false,
                approved:
                    (tokensAllowances[i].result as bigint) >= token.amount.raw,
            });
        }

        setTokensToApproveWithAllowance(
            tokensWithAllowances.sort(
                (a, b) => Number(b.approved) - Number(a.approved),
            ),
        );
    }, [tokensAllowances, tokensToApprove]);

    const [tokensCampaignArgs, pointsCampaignArgs] = useMemo(() => {
        const { kind, startDate, endDate } = payload;

        if (!allTokensApproved || !startDate || !endDate) return [[], []];

        const tokenArgs = [];
        const pointArgs = [];

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

        if (payload.isDistributing(DistributablesType.FixedPoints))
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
    }, [payload, specificationHash, allTokensApproved]);

    const {
        data: simulatedCreate,
        isLoading: simulatingCreate,
        isError: simulateCreateErrored,
        error: simulateCreateError,
    } = useSimulateContract({
        abi: metromAbi,
        address: connectedChainData?.metromContract.address,
        functionName: "createCampaigns",
        args: [tokensCampaignArgs, pointsCampaignArgs],
        query: {
            enabled:
                !SAFE &&
                (tokensCampaignArgs.length > 0 ||
                    pointsCampaignArgs.length > 0),
        },
    });

    useEffect(() => {
        if (simulateCreateErrored)
            console.error(
                `Create campaign tx simulation failed: ${simulateCreateError}`,
            );
    }, [simulateCreateError, simulateCreateErrored]);

    function handleNetworkOnSwitch() {
        switchChain(
            { chainId: payload.chainId },
            {
                onError: (err) => {
                    console.error(`Could not switch chain: ${err}`);
                },
            },
        );
    }

    const handleSafeTransaction = useCallback(
        (tx: BaseTransaction) => {
            setSafeTxs([...safeTxs, tx]);
        },
        [safeTxs],
    );

    function handleOnRewardApproving(address: Address | null) {
        setTokensToApproveWithAllowance((prev) =>
            prev.map((item) => {
                if (!address) return { ...item, approving: false };
                if (item.token.address !== address) return item;
                return { ...item, approving: true };
            }),
        );
    }

    function handleOnRewardApproved({
        token,
        amount,
    }: UsdPricedErc20TokenAmount) {
        setTokensToApproveWithAllowance((prev) =>
            prev.map((item) => {
                if (item.token.address !== token.address) return item;
                return { ...item, allowance: amount.raw, approved: true };
            }),
        );
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
        publicClient,
        simulateCreateError,
        simulateCreateErrored,
        simulatedCreate?.request,
        onLaunch,
        writeContractAsync,
    ]);

    const handleOnSafeDeploy = useCallback(() => {
        if (
            !connectedChainData ||
            (tokensCampaignArgs.length === 0 && pointsCampaignArgs.length === 0)
        ) {
            console.warn(
                "Missing parameters to deploy campaign through Safe: aborting",
            );
            return;
        }

        safeTxs.push({
            to: connectedChainData.metromContract.address,
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
        connectedChainData,
        safeTxs,
        tokensCampaignArgs,
        pointsCampaignArgs,
        onLaunch,
    ]);

    if (payload.chainId !== chainId || !deployChainSupported) {
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

    return (
        <div className={styles.container}>
            <div
                className={classNames(styles.rewards, {
                    [styles.notConnected]: !connectedAddress,
                })}
            >
                {tokensToApproveWithAllowance.map(
                    ({ token, amount, approved, approving }, index) => {
                        const prevTokenApproved =
                            index === 0
                                ? true
                                : tokensToApproveWithAllowance[index - 1]
                                      .approved;

                        return (
                            <div
                                key={token.address}
                                className={classNames(styles.rewardWrapper, {
                                    [styles.opaque]: !prevTokenApproved,
                                })}
                            >
                                <TokenToApproveEvm
                                    token={token}
                                    amount={amount}
                                    index={index}
                                    loading={loadingTokensAllowances}
                                    approving={approving}
                                    approved={approved}
                                    totalTokens={
                                        tokensToApproveWithAllowance.length
                                    }
                                />
                                {index !==
                                    tokensToApproveWithAllowance.length - 1 && (
                                    <div
                                        className={classNames(styles.divider, {
                                            [styles.approved]: approved,
                                        })}
                                    ></div>
                                )}
                            </div>
                        );
                    },
                )}
            </div>
            <div className={styles.buttonsWrapper}>
                {allTokensApproved && connectedAddress && (
                    <Button
                        icon={ArrowRightIcon}
                        iconPlacement="right"
                        disabled={disabled || simulateCreateErrored}
                        loading={
                            uploadingSpecification ||
                            simulatingCreate ||
                            deploying
                        }
                        onClick={
                            SAFE ? handleOnSafeDeploy : handleOnStandardDeploy
                        }
                        className={{ root: styles.button }}
                    >
                        {t("deploy")}
                    </Button>
                )}
                <ApproveTokensButton
                    tokensToApprove={tokensToApproveWithAllowance}
                    onApproved={handleOnRewardApproved}
                    onApproving={handleOnRewardApproving}
                    onSafeTx={handleSafeTransaction}
                />
            </div>
        </div>
    );
}
