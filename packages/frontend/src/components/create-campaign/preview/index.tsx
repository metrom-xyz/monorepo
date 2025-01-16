import { Button, Typography, TextField, ErrorText } from "@metrom-xyz/ui";
import { type CampaignPreviewPayload } from "@/src/types";
import {
    useChainId,
    usePublicClient,
    useSimulateContract,
    useWriteContract,
} from "wagmi";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MetromLightLogo } from "@/src/assets/metrom-light-logo";
import { useRouter } from "@/src/i18n/routing";
import { useChainData } from "@/src/hooks/useChainData";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { ApproveTokensButton } from "./approve-tokens-button";
import { Rewards } from "./rewards";
import { Header } from "./header";
import { formatTokenAmount, formatUsdAmount } from "@/src/utils/format";
import { getCampaignPreviewApr } from "@/src/utils/campaign";
import { trackFathomEvent } from "@/src/utils/fathom";
import {
    type Hex,
    zeroHash,
    parseUnits,
    formatUnits,
    encodeAbiParameters,
} from "viem";
import {
    DistributablesType,
    SERVICE_URLS,
    type Specification,
    type UsdPricedErc20TokenAmount,
} from "@metrom-xyz/sdk";
import { ENVIRONMENT } from "@/src/commons/env";
import { Kpi } from "./kpi";
import { AprChip } from "../../apr-chip";

import styles from "./styles.module.css";

interface CampaignPreviewProps {
    payload: CampaignPreviewPayload;
    onBack: () => void;
    onCreateNew: () => void;
}

export function CampaignPreview({
    payload,
    onBack,
    onCreateNew,
}: CampaignPreviewProps) {
    const t = useTranslations("campaignPreview");
    const [deploying, setDeploying] = useState(false);
    const [uploadingSpecification, setUploadingSpecification] = useState(false);
    const [created, setCreated] = useState(false);
    const [tokensApproved, setTokensApproved] = useState(false);
    const [specificationHash, setSpecificationHash] = useState<Hex>(zeroHash);
    const [error, setError] = useState("");

    const feedback = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const chainId = useChainId();
    const chainData = useChainData(chainId);
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();

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
        const { pool, startDate, endDate } = payload;

        if (!tokensApproved || !pool || !startDate || !endDate) return [[], []];

        let tokenArgs = [];
        let pointArgs = [];

        if (payload.isDistributing(DistributablesType.Tokens))
            tokenArgs.push({
                from: startDate.unix(),
                to: endDate.unix(),
                kind: 1,
                data: encodeAbiParameters(
                    [{ name: "poolAddress", type: "address" }],
                    [pool.address],
                ),
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
                kind: 1,
                data: encodeAbiParameters(
                    [{ name: "poolAddress", type: "address" }],
                    [pool.address],
                ),
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
                tokensCampaignArgs.length > 0 || pointsCampaignArgs.length > 0,
        },
    });

    useEffect(() => {
        const uploadSpecification = async () => {
            setUploadingSpecification(true);

            const { restrictions, kpiSpecification } = payload;

            let specification: Specification = {
                kpi: kpiSpecification,
            };
            if (restrictions)
                specification[restrictions.type] = restrictions?.list;

            try {
                const response = await fetch(
                    `${SERVICE_URLS[ENVIRONMENT].dataManager}/data/temporary`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(specification),
                    },
                );

                if (!response.ok) throw new Error(await response.text());

                const { hash } = (await response.json()) as { hash: Hex };
                setSpecificationHash(`0x${hash}`);
            } catch (error) {
                console.error(
                    `Could not upload specification to data-manager: ${JSON.stringify(specification)}`,
                    error,
                );
                setError("errors.specification");
            } finally {
                setUploadingSpecification(false);
            }
        };

        if (
            (payload.kpiSpecification || payload.restrictions) &&
            tokensApproved
        )
            uploadSpecification();
    }, [
        payload,
        payload.kpiSpecification,
        payload.restrictions,
        tokensApproved,
    ]);

    function handleOnRewardsApproved() {
        setTokensApproved(true);
    }

    const handleOnDeploy = useCallback(() => {
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
                    console.warn("creation transaction reverted");
                    return;
                }

                setCreated(true);
                trackFathomEvent("CLICK_DEPLOY_CAMPAIGN");
            } catch (error) {
                console.warn("could not create kpi token", error);
            } finally {
                setDeploying(false);
            }
        };
        void create();
    }, [
        publicClient,
        simulateCreateError,
        simulateCreateErrored,
        simulatedCreate,
        writeContractAsync,
    ]);

    function handleGoToAllCampaigns() {
        router.push("/");
    }

    const pointsCampaign = payload.isDistributing(DistributablesType.Points);
    const tokensCampaign = payload.isDistributing(DistributablesType.Tokens);

    // TODO: add notification toast in case of errors
    if (!created) {
        return (
            <div ref={feedback} className={styles.root}>
                <Header
                    backDisabled={simulatingCreate || deploying}
                    payload={payload}
                    onBack={onBack}
                />
                <div className={styles.content}>
                    {!!payload.kpiSpecification && tokensCampaign && (
                        <Kpi
                            poolUsdTvl={payload.pool.usdTvl}
                            rewards={payload.distributables.tokens}
                            specification={payload.kpiSpecification}
                        />
                    )}
                    <div className={styles.contentGrid}>
                        <TextField
                            boxed
                            size="xl"
                            label={t("tvl")}
                            value={formatUsdAmount(payload.pool.usdTvl)}
                        />
                        {tokensCampaign && (
                            <TextField
                                boxed
                                size="xl"
                                label={t("apr")}
                                value={
                                    <AprChip
                                        size="lg"
                                        apr={getCampaignPreviewApr(payload)}
                                        kpi={!!payload.kpiSpecification}
                                    />
                                }
                            />
                        )}
                        {pointsCampaign && (
                            <TextField
                                boxed
                                size="xl"
                                label={t("points")}
                                value={formatTokenAmount({
                                    amount: payload.distributables.points,
                                })}
                            />
                        )}
                    </div>
                    {tokensCampaign && (
                        <Rewards
                            rewards={payload.distributables.tokens}
                            startDate={payload.startDate}
                            endDate={payload.endDate}
                        />
                    )}
                    <div className={styles.deployButtonContainer}>
                        {error && (
                            <ErrorText size="xs" weight="medium">
                                {t(error)}
                            </ErrorText>
                        )}
                        {tokensApproved && (
                            <Button
                                icon={ArrowRightIcon}
                                iconPlacement="right"
                                disabled={!!error || simulateCreateErrored}
                                loading={
                                    uploadingSpecification ||
                                    simulatingCreate ||
                                    deploying
                                }
                                className={{ root: styles.deployButton }}
                                onClick={handleOnDeploy}
                            >
                                {t("deploy")}
                            </Button>
                        )}
                        <ApproveTokensButton
                            tokenAmounts={tokensToApprove}
                            onApproved={handleOnRewardsApproved}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.feedback}>
            <MetromLightLogo className={styles.metromLogo} />
            <Typography uppercase weight="medium">
                {t("congratulations")}
            </Typography>
            <Typography size="xl2" weight="medium">
                {t("launched")}
            </Typography>
            <div className={styles.feedbackActionsContainer}>
                <Button
                    onClick={handleGoToAllCampaigns}
                    variant="secondary"
                    className={{ root: styles.feedbackButton }}
                >
                    {t("allCampaigns")}
                </Button>
                <Button
                    onClick={onCreateNew}
                    className={{ root: styles.feedbackButton }}
                >
                    {t("newCampaign")}
                </Button>
            </div>
        </div>
    );
}
