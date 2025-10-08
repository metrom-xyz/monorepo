import { Button, Typography, TextField, ErrorText } from "@metrom-xyz/ui";
import {
    AmmPoolLiquidityCampaignPreviewPayload,
    EmptyTargetCampaignPreviewPayload,
    type CampaignPreviewPayload,
} from "@/src/types/campaign";
import { buildSpecificationBundle } from "@/src/utils/campaign-bundle";
import type { LocalizedMessage } from "@/src/types/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MetromLightLogo } from "@/src/assets/logos/metrom/metrom-light-logo";
import { useRouter } from "@/src/i18n/routing";
import { Rewards } from "./rewards";
import { Header } from "./header";
import { formatAmount, formatUsdAmount } from "@/src/utils/format";
import { getCampaignPreviewApr } from "@/src/utils/campaign";
import {
    DistributablesType,
    SERVICE_URLS,
    type Specification,
} from "@metrom-xyz/sdk";
import { ENVIRONMENT, SAFE } from "@/src/commons/env";
import { Kpi } from "./kpi";
import { AprChip } from "../../apr-chip";
import { Range } from "./range";
import { zeroHash, type Hex } from "viem";
import { useLiquidityInRange } from "@/src/hooks/useLiquidityInRange";
import { Weighting } from "./weighting";
import { Restrictions } from "./restrictions";
import { useLiquidityByAddresses } from "@/src/hooks/useLiquidityByAddresses";
import { DeployButton } from "./deploy-button";

import styles from "./styles.module.css";

interface CampaignPreviewProps {
    payload: CampaignPreviewPayload;
    onBack: () => void;
    onCreateNew: () => void;
}

type ErrorMessage = LocalizedMessage<"campaignPreview">;

export function CampaignPreview({
    payload,
    onBack,
    onCreateNew,
}: CampaignPreviewProps) {
    const t = useTranslations("campaignPreview");
    const router = useRouter();

    const feedback = useRef<HTMLDivElement>(null);

    const [uploadingSpecification, setUploadingSpecification] = useState(false);
    const [created, setCreated] = useState(false);
    const [tokensApproved, setTokensApproved] = useState(false);
    const [specificationHash, setSpecificationHash] = useState<Hex>(zeroHash);
    const [error, setError] = useState<ErrorMessage>("");

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

    const liquidityByAddressesParams = useMemo(() => {
        if (
            !ammPoolLiquidityCampaign ||
            !payload.restrictions ||
            payload.restrictions.list.length === 0
        )
            return { enabled: false };

        return {
            pool: payload.pool,
            type: payload.restrictions.type,
            addresses: payload.restrictions.list,
            enabled: true,
        };
    }, [ammPoolLiquidityCampaign, payload]);

    const { loading: loadingLiquidityInRange, liquidityInRange } =
        useLiquidityInRange(liquidityInRangeParams);
    const { loading: loadingLiquidityByAddresses, liquidityByAddresses } =
        useLiquidityByAddresses(liquidityByAddressesParams);

    const pointsCampaign = payload.isDistributing(DistributablesType.Points);
    const tokensCampaign = payload.isDistributing(DistributablesType.Tokens);
    const emptyTargetCampaign =
        payload instanceof EmptyTargetCampaignPreviewPayload;
    const kpi = !!payload.kpiSpecification && tokensCampaign;

    // There's no need to approve tokens for Aptos
    useEffect(() => {
        if (tokensApproved) return;
        setTokensApproved(true);
    }, [tokensApproved]);

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

    function handleOnCreate() {
        setCreated(true);
    }

    function handleGoToAllCampaigns() {
        router.push("/");
    }

    const range = ammPoolLiquidityCampaign && !!payload.priceRangeSpecification;
    const weighting = ammPoolLiquidityCampaign && !!payload.weighting;
    const restrictions =
        !!payload.restrictions && payload.restrictions.list.length > 0;

    // TODO: add notification toast in case of errors
    if (!created) {
        return (
            <div ref={feedback} className={styles.root}>
                <Header
                    backDisabled={false}
                    // FIXME: disable when loading
                    // backDisabled={simulatingCreate || deploying}
                    payload={payload}
                    onBack={onBack}
                />
                <div className={styles.content}>
                    <div className={styles.contentGrid}>
                        <TextField
                            boxed
                            size="xl"
                            label={t("tvl")}
                            value={formatUsdAmount({
                                amount: payload.getTargetLiquidity()?.usd,
                            })}
                        />
                        {!emptyTargetCampaign && tokensCampaign && (
                            <TextField
                                boxed
                                size="xl2"
                                label={t("apr")}
                                loading={
                                    loadingLiquidityInRange ||
                                    loadingLiquidityByAddresses
                                }
                                value={
                                    <AprChip
                                        size="lg"
                                        apr={getCampaignPreviewApr(
                                            payload,
                                            liquidityInRange,
                                            liquidityByAddresses,
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
                    {weighting && (
                        <Weighting
                            pool={payload.pool}
                            weighting={payload.weighting}
                        />
                    )}
                    {kpi && (
                        <Kpi
                            usdTvl={payload.getTargetLiquidity()?.usd}
                            from={payload.startDate}
                            to={payload.endDate}
                            distributables={payload.distributables}
                            specification={payload.kpiSpecification}
                        />
                    )}
                    {range && (
                        <Range
                            pool={payload.pool}
                            specification={payload.priceRangeSpecification}
                        />
                    )}
                    {restrictions && (
                        <Restrictions restrictions={payload.restrictions} />
                    )}
                    <div className={styles.deployButtonContainer}>
                        {error && (
                            <ErrorText size="xs" weight="medium">
                                {t(error)}
                            </ErrorText>
                        )}
                        <DeployButton
                            payload={payload}
                            specificationHash={specificationHash}
                            uploadingSpecification={uploadingSpecification}
                            disabled={!!error}
                            onCreate={handleOnCreate}
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
                <Typography
                    size="xl"
                    weight="medium"
                    className={styles.feedbackText}
                >
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
