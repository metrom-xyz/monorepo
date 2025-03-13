import { Button, Typography, TextField, ErrorText } from "@metrom-xyz/ui";
import {
    AmmPoolLiquidityCampaignPreviewPayload,
    type CampaignPreviewPayload,
} from "@/src/types/common";
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
import { formatAmount, formatUsdAmount } from "@/src/utils/format";
import {
    buildCampaignDataBundle,
    buildSpecificationBundle,
    getCampaignPreviewApr,
} from "@/src/utils/campaign";
import { trackFathomEvent } from "@/src/utils/fathom";
import {
    DistributablesType,
    SERVICE_URLS,
    type Specification,
    type UsdPricedErc20TokenAmount,
} from "@metrom-xyz/sdk";
import { ENVIRONMENT, SAFE } from "@/src/commons/env";
import { Kpi } from "./kpi";
import { AprChip } from "../../apr-chip";
import { Range } from "./range";
import { formatUnits, parseUnits, zeroHash, type Hex } from "viem";
import { encodeFunctionData } from "viem/utils";
import { type BaseTransaction } from "@safe-global/safe-apps-sdk";
import { useLiquidityInRange } from "@/src/hooks/useLiquidityInRange";
import { safeSdk } from "@/src/commons";

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
    const router = useRouter();
    const chainId = useChainId();
    const chainData = useChainData(chainId);
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();

    const feedback = useRef<HTMLDivElement>(null);

    const [deploying, setDeploying] = useState(false);
    const [uploadingSpecification, setUploadingSpecification] = useState(false);
    const [created, setCreated] = useState(false);
    const [tokensApproved, setTokensApproved] = useState(false);
    const [specificationHash, setSpecificationHash] = useState<Hex>(zeroHash);
    const [error, setError] = useState("");
    const [safeTxs, setSafeTxs] = useState<BaseTransaction[]>([]);

    const ammPoolLiquidityCampaign =
        payload instanceof AmmPoolLiquidityCampaignPreviewPayload;

    const liquidityInRangeParams = useMemo(() => {
        if (!ammPoolLiquidityCampaign || !payload.priceRangeSpecification)
            return { enabled: false };

        return {
            pool: payload.pool,
            from: payload.priceRangeSpecification.from.tick,
            to: payload.priceRangeSpecification.to.tick,
            enabled: true,
        };
    }, [ammPoolLiquidityCampaign, payload]);

    const { loading: loadingLiquidityInRange, liquidityInRange } =
        useLiquidityInRange(liquidityInRangeParams);

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

        const data = buildCampaignDataBundle(payload);
        if (!data) return [[], []];

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

    useEffect(() => {
        const specification = buildSpecificationBundle(payload);

        const uploadSpecification = async (bundle: Specification) => {
            setUploadingSpecification(true);

            try {
                const response = await fetch(
                    `${SERVICE_URLS[ENVIRONMENT].dataManager}/data/temporary`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(bundle),
                    },
                );

                if (!response.ok) throw new Error(await response.text());

                const { hash } = (await response.json()) as { hash: Hex };
                setSpecificationHash(`0x${hash}`);
            } catch (error) {
                console.error(
                    `Could not upload specification to data-manager: ${JSON.stringify(bundle)}`,
                    error,
                );
                setError("errors.specification");
            } finally {
                setUploadingSpecification(false);
            }
        };

        if (Object.keys(specification).length > 0 && tokensApproved)
            uploadSpecification(specification);
    }, [
        payload,
        payload.kpiSpecification,
        payload.restrictions,
        tokensApproved,
    ]);

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
                    console.warn("creation transaction reverted");
                    return;
                }

                setCreated(true);
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
                await safeSdk.txs.send({ txs: safeTxs });

                setCreated(true);
                trackFathomEvent("CLICK_DEPLOY_CAMPAIGN");
            } catch (error) {
                console.warn("Could not create campaign", error);
            } finally {
                setDeploying(false);
            }
        };

        void create();
    }, [chainData, safeTxs, tokensCampaignArgs, pointsCampaignArgs]);

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
                    {ammPoolLiquidityCampaign &&
                        !!payload.priceRangeSpecification && (
                            <Range
                                pool={payload.pool}
                                specification={payload.priceRangeSpecification}
                            />
                        )}
                    {ammPoolLiquidityCampaign &&
                        !!payload.kpiSpecification &&
                        tokensCampaign && (
                            <Kpi
                                poolUsdTvl={payload.pool.usdTvl}
                                from={payload.startDate}
                                to={payload.endDate}
                                rewards={payload.distributables.tokens}
                                specification={payload.kpiSpecification}
                            />
                        )}
                    <div className={styles.contentGrid}>
                        {ammPoolLiquidityCampaign && (
                            <TextField
                                boxed
                                size="xl"
                                label={t("tvl")}
                                value={formatUsdAmount(payload.pool.usdTvl)}
                            />
                        )}
                        {tokensCampaign && (
                            <TextField
                                boxed
                                size="xl"
                                label={t("apr")}
                                loading={loadingLiquidityInRange}
                                value={
                                    <AprChip
                                        size="lg"
                                        apr={getCampaignPreviewApr(
                                            payload,
                                            liquidityInRange,
                                        )}
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
                                value={formatAmount({
                                    amount: payload.distributables.points,
                                })}
                            />
                        )}
                    </div>
                    {tokensCampaign && (
                        <Rewards
                            rewards={payload.distributables}
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
                                onClick={
                                    SAFE
                                        ? handleOnSafeDeploy
                                        : handleOnStandardDeploy
                                }
                            >
                                {t("deploy")}
                            </Button>
                        )}
                        <ApproveTokensButton
                            tokenAmounts={tokensToApprove}
                            onApproved={handleOnRewardsApproved}
                            onSafeTx={handleSafeTransaction}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.feedback}>
            <MetromLightLogo className={styles.metromLogo} />
            <Typography
                uppercase
                weight="medium"
                className={styles.feedbackText}
            >
                {t("congratulations")}
            </Typography>
            <Typography
                size="xl2"
                weight="medium"
                className={styles.feedbackText}
            >
                {SAFE ? t("launched.safe.1") : t("launched.standard")}
            </Typography>
            {SAFE && (
                <Typography size="xl2" weight="medium">
                    {t("launched.safe.2")}
                </Typography>
            )}
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
