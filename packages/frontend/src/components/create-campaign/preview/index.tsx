import { Button, Typography, TextField, ErrorText } from "@metrom-xyz/ui";
import {
    AaveV3CampaignPreviewPayload,
    AmmPoolLiquidityCampaignPreviewPayload,
    EmptyTargetCampaignPreviewPayload,
    type CampaignPreviewPayload,
} from "@/src/types/campaign";
import { buildSpecificationBundle } from "@/src/utils/campaign-bundle";
import type { LocalizedMessage } from "@/src/types/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
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
import { useCampaignTargetValueName } from "@/src/hooks/useCampaignTargetValueName";
import {
    useAaveV3CollateralUsdNetSupply,
    type UseAaveV3CollateralUsdNetSupplyParams,
} from "@/src/hooks/useAaveV3CollateralUsdNetSupply";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { MetromSquareLogo } from "@/src/assets/logos/metrom/metrom-square-logo";

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
    const targetValueName = useCampaignTargetValueName({ kind: payload.kind });
    const router = useRouter();
    const chain = useChainWithType();

    const feedback = useRef<HTMLDivElement>(null);

    const [uploadingSpecification, setUploadingSpecification] = useState(false);
    const [created, setCreated] = useState(false);
    const [tokensApproved, setTokensApproved] = useState(false);
    const [specificationHash, setSpecificationHash] = useState<Hex>(zeroHash);
    const [error, setError] = useState<ErrorMessage>("");

    const ammPoolLiquidityCampaign =
        payload instanceof AmmPoolLiquidityCampaignPreviewPayload;
    const aaveV3Campaign = payload instanceof AaveV3CampaignPreviewPayload;

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

    const aaveV3CollateralUsdNetSupplyParams: UseAaveV3CollateralUsdNetSupplyParams =
        useMemo(() => {
            if (!aaveV3Campaign)
                return {
                    chainId: chain.id,
                    chainType: chain.type,
                    enabled: false,
                };

            return {
                chainId: chain.id,
                chainType: chain.type,
                brand: payload.brand.slug,
                market: payload.market.address,
                collateral: payload.collateral.address,
                blacklistedCrossBorrowCollaterals:
                    payload.blacklistedCollaterals?.map(
                        ({ address }) => address,
                    ),
                enabled: true,
            };
        }, [aaveV3Campaign, chain.id, chain.type, payload]);

    const { loading: loadingLiquidityInRange, liquidityInRange } =
        useLiquidityInRange(liquidityInRangeParams);
    const { loading: loadingLiquidityByAddresses, liquidityByAddresses } =
        useLiquidityByAddresses(liquidityByAddressesParams);
    const {
        loading: loadingAaveV3CollateralUsdNetSupply,
        usdNetSupply: aaveV3CollateralUsdNetSupply,
    } = useAaveV3CollateralUsdNetSupply(aaveV3CollateralUsdNetSupplyParams);

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

    const fixedPoints = payload.isDistributing(DistributablesType.FixedPoints);
    const tokens = payload.isDistributing(DistributablesType.Tokens);
    const emptyTargetCampaign =
        payload instanceof EmptyTargetCampaignPreviewPayload;
    const kpi = !!payload.kpiSpecification && tokens;

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
                            label={targetValueName}
                            value={formatUsdAmount({
                                amount: payload.getTargetValue()?.usd,
                            })}
                        />
                        {!emptyTargetCampaign && tokens && (
                            <TextField
                                boxed
                                size="xl2"
                                label={t("apr")}
                                loading={
                                    loadingLiquidityInRange ||
                                    loadingLiquidityByAddresses ||
                                    loadingAaveV3CollateralUsdNetSupply
                                }
                                value={
                                    <AprChip
                                        size="lg"
                                        apr={getCampaignPreviewApr(
                                            payload,
                                            liquidityInRange,
                                            liquidityByAddresses,
                                            aaveV3CollateralUsdNetSupply,
                                        )}
                                        kpi={!!payload.kpiSpecification}
                                    />
                                }
                            />
                        )}
                        {fixedPoints && (
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
                    {tokens && (
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
                            kind={payload.kind}
                            targetUsdValue={payload.getTargetValue()?.usd}
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
            <MetromSquareLogo className={styles.metromLogo} />
            <Typography
                uppercase
                weight="medium"
                className={styles.feedbackText}
            >
                {t("congratulations")}
            </Typography>
            <Typography size="xl2" weight="medium">
                {SAFE ? t("launched.safe.1") : t("launched.standard")}
            </Typography>
            {SAFE && (
                <Typography size="xl" weight="medium">
                    {t("launched.safe.2")}
                </Typography>
            )}
            <div className={styles.feedbackActionsContainer}>
                <Button
                    onClick={handleGoToAllCampaigns}
                    variant="secondary"
                    className={{ root: styles.feedbackButton }}
                >
                    {t("discover")}
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
