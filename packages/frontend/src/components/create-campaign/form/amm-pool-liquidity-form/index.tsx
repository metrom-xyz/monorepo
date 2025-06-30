import {
    type AmmPoolLiquidityCampaignPayload,
    type CampaignPayloadErrors,
    AmmPoolLiquidityCampaignPreviewPayload,
    type AmmPoolLiquidityCampaignPayloadPart,
    type CampaignPreviewDistributables,
    CampaignKind,
} from "@/src/types/campaign";
import { useTranslations } from "next-intl";
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
} from "react";
import { useChainId, useSwitchChain } from "wagmi";
import {
    AmmPoolLiquidityType,
    DistributablesType,
    SupportedAmm,
} from "@metrom-xyz/sdk";
import { PoolStep } from "../../steps/pool-step";
import { StartDateStep } from "../../steps/start-date-step";
import { EndDateStep } from "../../steps/end-date-step";
import { RewardsStep } from "../../steps/rewards-step";
import { KpiStep } from "../../steps/kpi-step";
import { RangeStep } from "../../steps/range-step";
import { RestrictionsStep } from "../../steps/restrictions-step";
import { DexStep } from "../../steps/dex-step";
import { Button } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import {
    AMM_SUPPORTS_RANGE_INCENTIVES,
    AMM_SUPPORTS_TOKENS_RATIO,
} from "@/src/commons";
import { WeightingStep } from "../../steps/weighting";
import { usePathname } from "@/i18n/routing";
import dayjs from "dayjs";
import { useCampaignSetup } from "@/src/hooks/useCampaignSetup";
import { toast } from "sonner";
import { SetupFail } from "../notifications/setup-fail";
import { SetupSuccess } from "../notifications/setup-success";
import { useRouter, useSearchParams } from "next/navigation";

import styles from "./styles.module.css";
import { decodeCampaignSetup } from "@/src/utils/campaign";

function validatePayload(
    payload: AmmPoolLiquidityCampaignPayload,
): AmmPoolLiquidityCampaignPreviewPayload | null {
    const {
        dex,
        pool,
        startDate,
        endDate,
        distributables,
        weighting,
        kpiSpecification,
        priceRangeSpecification,
        restrictions,
    } = payload;

    if (!dex || !pool || !startDate || !endDate || !distributables) return null;

    if (
        distributables.type === DistributablesType.Points &&
        (!distributables.fee || !distributables.type)
    )
        return null;
    if (
        distributables.type === DistributablesType.Tokens &&
        (!distributables.tokens || distributables.tokens.length === 0)
    )
        return null;

    return new AmmPoolLiquidityCampaignPreviewPayload(
        dex,
        pool,
        weighting,
        priceRangeSpecification,
        startDate,
        endDate,
        distributables as CampaignPreviewDistributables,
        kpiSpecification,
        restrictions,
    );
}

interface AmmPoolLiquidityFormProps {
    unsupportedChain: boolean;
    onPreviewClick: (
        payload: AmmPoolLiquidityCampaignPreviewPayload | null,
    ) => void;
}

const initialPayload: AmmPoolLiquidityCampaignPayload = {
    distributables: { type: DistributablesType.Tokens },
};

export function AmmPoolLiquidityForm({
    unsupportedChain,
    onPreviewClick,
}: AmmPoolLiquidityFormProps) {
    const t = useTranslations("newCampaign");

    const chainId = useChainId();
    const router = useRouter();
    const pathname = usePathname();
    const { switchChainAsync, isPending: switchingChain } = useSwitchChain();
    const searchParams = useSearchParams();
    const {
        loading: loadingSetup,
        error: setupError,
        setup,
    } = useCampaignSetup({
        hash: searchParams.get("setup"),
        enabled: !!searchParams.get("setup"),
    });

    const [payload, setPayload] = useState(initialPayload);
    const [errors, setErrors] = useState<CampaignPayloadErrors>({});

    // This hook auto fills the form state when a campaign setup is available.
    useLayoutEffect(() => {
        // Remove the 'setup' parameter from the URL after parsing.
        // This ensures the form behaves correctly after autocomplete completes.
        const params = new URLSearchParams(searchParams.toString());

        if (setupError) {
            params.delete("setup");
            router.replace(`${pathname}?${params.toString()}`, {
                scroll: false,
            });
        }

        if (!setup) return;

        const autocompletePayload = async () => {
            const decodedSetup = decodeCampaignSetup(setup);
            if (decodedSetup.kind !== CampaignKind.AmmPoolLiquidity) return;

            const payload = decodedSetup as AmmPoolLiquidityCampaignPayload;
            if (!payload.dex?.chainId) return;

            const { dex } = payload;

            if (dex.chainId !== chainId)
                await switchChainAsync({ chainId: dex.chainId });

            params.delete("setup");
            router.replace(`${pathname}?${params.toString()}`, {
                scroll: false,
            });

            setPayload(payload);
        };

        autocompletePayload();
    }, [
        loadingSetup,
        setupError,
        searchParams,
        chainId,
        setup,
        pathname,
        router,
        switchChainAsync,
    ]);

    useEffect(() => {
        if (!loadingSetup && setupError)
            toast.custom((toastId) => <SetupFail toastId={toastId} />);

        if (!loadingSetup && !setupError && !!setup)
            toast.custom((toastId) => <SetupSuccess toastId={toastId} />);
    }, [loadingSetup, setupError, setup]);

    const previewPayload = useMemo(() => {
        if (Object.values(errors).some((error) => !!error)) return null;
        return validatePayload(payload);
    }, [payload, errors]);

    const noDistributables = useMemo(() => {
        return (
            !payload.distributables ||
            payload.distributables.type === DistributablesType.Points ||
            !payload.distributables.tokens ||
            payload.distributables.tokens.length === 0
        );
    }, [payload.distributables]);

    const missingDistributables = useMemo(() => {
        if (!payload.distributables) return true;

        const { type } = payload.distributables;

        if (type === DistributablesType.Points)
            return (
                !payload.distributables.fee || !payload.distributables.points
            );
        if (type === DistributablesType.Tokens)
            return (
                !payload.distributables.tokens ||
                payload.distributables.tokens.length === 0
            );

        return true;
    }, [payload.distributables]);

    const tokensRatioSupported = useMemo(() => {
        return (
            !!payload.pool &&
            AMM_SUPPORTS_TOKENS_RATIO[payload.pool.amm as SupportedAmm] &&
            payload.pool.liquidityType === AmmPoolLiquidityType.Concentrated
        );
    }, [payload.pool]);

    useEffect(() => {
        setPayload(initialPayload);
    }, [chainId]);

    const handlePayloadOnChange = useCallback(
        (part: AmmPoolLiquidityCampaignPayloadPart) => {
            setPayload((prev) => ({ ...prev, ...part }));
        },
        [],
    );

    const handlePayloadOnError = useCallback(
        (errors: CampaignPayloadErrors) => {
            setErrors((state) => ({ ...state, ...errors }));
        },
        [],
    );

    function handlePreviewOnClick() {
        onPreviewClick(previewPayload);
    }

    const loading = loadingSetup || switchingChain;

    return (
        <div className={styles.root}>
            <div className={styles.stepsWrapper}>
                <DexStep
                    loading={loading}
                    disabled={unsupportedChain}
                    dex={payload.dex}
                    onDexChange={handlePayloadOnChange}
                />
                <PoolStep
                    loading={loading}
                    disabled={!payload.dex || unsupportedChain}
                    dex={payload.dex}
                    pool={payload.pool}
                    onPoolChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
                <StartDateStep
                    loading={loading}
                    disabled={!payload.pool || unsupportedChain}
                    startDate={payload.startDate}
                    endDate={payload.endDate}
                    onStartDateChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
                <EndDateStep
                    loading={loading}
                    disabled={!payload.startDate || unsupportedChain}
                    startDate={payload.startDate}
                    endDate={payload.endDate}
                    onEndDateChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
                <RewardsStep
                    loading={loading}
                    disabled={!payload.endDate || unsupportedChain}
                    distributables={payload.distributables}
                    startDate={payload.startDate}
                    endDate={payload.endDate}
                    onDistributablesChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
                {tokensRatioSupported && (
                    <WeightingStep
                        pool={payload.pool}
                        distributablesType={payload.distributables?.type}
                        disabled={noDistributables || unsupportedChain}
                        weighting={payload.weighting}
                        onWeightingChange={handlePayloadOnChange}
                        onError={handlePayloadOnError}
                    />
                )}
                <KpiStep
                    loading={loading}
                    disabled={noDistributables || unsupportedChain}
                    pool={payload.pool}
                    distributables={
                        payload.distributables?.type ===
                        DistributablesType.Tokens
                            ? payload.distributables
                            : undefined
                    }
                    startDate={payload.startDate}
                    endDate={payload.endDate}
                    kpiSpecification={payload.kpiSpecification}
                    onKpiChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
                {payload.pool &&
                    AMM_SUPPORTS_RANGE_INCENTIVES[
                        payload.pool.amm as SupportedAmm
                    ] &&
                    payload.pool.liquidityType ===
                        AmmPoolLiquidityType.Concentrated && (
                        <RangeStep
                            autoCompleting={!!setup}
                            disabled={noDistributables || unsupportedChain}
                            distributablesType={payload.distributables?.type}
                            pool={payload.pool}
                            priceRangeSpecification={
                                payload.priceRangeSpecification
                            }
                            onRangeChange={handlePayloadOnChange}
                            onError={handlePayloadOnError}
                        />
                    )}
                <RestrictionsStep
                    loading={loading}
                    disabled={missingDistributables || unsupportedChain}
                    restrictions={payload.restrictions}
                    onRestrictionsChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
            </div>
            <Button
                icon={ArrowRightIcon}
                iconPlacement="right"
                loading={loading}
                disabled={!previewPayload}
                className={{ root: styles.button }}
                onClick={handlePreviewOnClick}
            >
                {t("submit.preview")}
            </Button>
        </div>
    );
}
