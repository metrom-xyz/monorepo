import {
    type CampaignPayloadErrors,
    LiquityV2CampaignPreviewPayload,
    type LiquityV2CampaignPayload,
    type LiquityV2CampaignPayloadPart,
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
import { DistributablesType } from "@metrom-xyz/sdk";
import { StartDateStep } from "../../steps/start-date-step";
import { EndDateStep } from "../../steps/end-date-step";
import { RewardsStep } from "../../steps/rewards-step";
import { RestrictionsStep } from "../../steps/restrictions-step";
import { Button } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { LiquityV2BrandStep } from "../../steps/liquity-v2-brand-step";
import { LiquityV2ActionStep } from "../../steps/liquity-v2-action-step";
import { LiquityV2CollateralStep } from "../../steps/liquity-v2-collateral-step";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "@/src/i18n/routing";
import { useCampaignSetup } from "@/src/hooks/useCampaignSetup";
import { decodeCampaignSetup } from "@/src/utils/campaign";
import { toast } from "sonner";
import { SetupFail } from "../notifications/setup-fail";
import { SetupSuccess } from "../notifications/setup-success";

import styles from "./styles.module.css";

function validatePayload(
    payload: LiquityV2CampaignPayload,
): LiquityV2CampaignPreviewPayload | null {
    const {
        brand,
        action,
        collateral,
        startDate,
        endDate,
        distributables,
        kpiSpecification,
        restrictions,
    } = payload;

    if (
        !brand ||
        !collateral ||
        !action ||
        !startDate ||
        !endDate ||
        !distributables
    )
        return null;

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

    return new LiquityV2CampaignPreviewPayload(
        brand,
        action,
        collateral,
        startDate,
        endDate,
        distributables as CampaignPreviewDistributables,
        kpiSpecification,
        restrictions,
    );
}

interface LiquityV2ForksFormProps {
    unsupportedChain: boolean;
    onPreviewClick: (payload: LiquityV2CampaignPreviewPayload | null) => void;
}

const initialPayload: LiquityV2CampaignPayload = {
    distributables: { type: DistributablesType.Tokens },
};

export function LiquityV2ForksForm({
    unsupportedChain,
    onPreviewClick,
}: LiquityV2ForksFormProps) {
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
            if (
                decodedSetup.kind !== CampaignKind.LiquityV2Debt &&
                decodedSetup.kind !== CampaignKind.LiquityV2StabilityPool
            )
                return;

            const payload = decodedSetup as LiquityV2CampaignPayload;
            if (!payload.brand?.chainId) return;

            const { brand } = payload;

            if (brand.chainId !== chainId)
                await switchChainAsync({ chainId: brand.chainId });

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
        if (!loadingSetup && !!setupError)
            toast.custom((toastId) => <SetupFail toastId={toastId} />);

        if (!loadingSetup && !setupError && !!setup)
            toast.custom((toastId) => <SetupSuccess toastId={toastId} />);
    }, [loadingSetup, setupError, setup]);

    const previewPayload = useMemo(() => {
        if (Object.values(errors).some((error) => !!error)) return null;
        return validatePayload(payload);
    }, [payload, errors]);

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

    useEffect(() => {
        setPayload(initialPayload);
    }, [chainId]);

    const handlePayloadOnChange = useCallback(
        (part: LiquityV2CampaignPayloadPart) => {
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
                <LiquityV2BrandStep
                    loading={loading}
                    disabled={unsupportedChain}
                    brand={payload.brand}
                    onBrandChange={handlePayloadOnChange}
                />
                <LiquityV2ActionStep
                    autoCompleting={!!setup}
                    loading={loading}
                    disabled={!payload.brand || unsupportedChain}
                    action={payload.action}
                    brand={payload.brand}
                    onActionChange={handlePayloadOnChange}
                />
                <LiquityV2CollateralStep
                    loading={loading}
                    disabled={!payload.action || unsupportedChain}
                    brand={payload.brand}
                    action={payload.action}
                    collateral={payload.collateral}
                    onCollateralChange={handlePayloadOnChange}
                />
                <StartDateStep
                    loading={loading}
                    disabled={!payload.collateral || unsupportedChain}
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
                {/* TODO: add support for KPIs to liquity campaign, how? */}
                {/* <KpiStep
                    disabled={
                        !payload.tokens ||
                        payload.rewardType === RewardType.Points ||
                        unsupportedChain
                    }
                    pool={payload.pool}
                    rewards={payload.tokens}
                    kpiSpecification={payload.kpiSpecification}
                    onKpiChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                /> */}
                <RestrictionsStep
                    loading={loading}
                    disabled={missingDistributables || unsupportedChain}
                    restrictions={payload.restrictions}
                    onRestrictionsChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
            </div>
            <Button
                loading={loading}
                icon={ArrowRightIcon}
                iconPlacement="right"
                disabled={!previewPayload}
                className={{ root: styles.button }}
                onClick={handlePreviewOnClick}
            >
                {t("submit.preview")}
            </Button>
        </div>
    );
}
