import { useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Select, Typography, type SelectOption } from "@metrom-xyz/ui";
import { type LiquityV2Protocol } from "@metrom-xyz/chains";
import { useChainType } from "@/src/hooks/useChainType";
import { CampaignKind, type LiquityV2Collateral } from "@metrom-xyz/sdk";
import { RemoteLogo } from "@/src/components/remote-logo";
import type { Address } from "viem";
import { formatUsdAmount } from "@/src/utils/format";
import type { LiquityV2CampaignPayloadPart } from "@/src/types/campaign/liquity-v2-campaign";
import { useLiquityV2Collaterals } from "@/src/hooks/useLiquityV2Collaterals";

import styles from "./styles.module.css";

interface LiquityV2CollateralSelectProps {
    chainId?: number;
    brand?: LiquityV2Protocol;
    kind?: CampaignKind;
    value?: LiquityV2Collateral;
    onChange: (value: LiquityV2CampaignPayloadPart) => void;
}

interface OptionData {
    chainId: number;
    address: Address;
    usdValue?: number;
}

const option = (option: SelectOption<string, OptionData>) => {
    const { label, data } = option;
    if (!data) return <></>;

    return (
        <div className={styles.option}>
            <div className={styles.token}>
                <RemoteLogo
                    size="xs"
                    chain={data.chainId}
                    address={data.address}
                />
                <Typography>{label}</Typography>
            </div>
            <Typography size="sm" variant="secondary">
                {formatUsdAmount({ amount: data.usdValue })}
            </Typography>
        </div>
    );
};

const selectedPrefix = (
    option: SelectOption<string, OptionData> | null | undefined,
) => {
    if (!option || !option.data) return <></>;
    const { data } = option;

    return (
        <RemoteLogo size="xxs" chain={data.chainId} address={data.address} />
    );
};

export function LiquityV2CollateralSelect({
    chainId,
    brand,
    kind,
    value,
    onChange,
}: LiquityV2CollateralSelectProps) {
    const t = useTranslations("newCampaign.inputs");

    const chainType = useChainType();
    const { loading, collaterals } = useLiquityV2Collaterals({
        chainId,
        chainType,
        brand: brand?.slug,
    });

    const options = useMemo<SelectOption<string, OptionData>[]>(() => {
        if (loading || !collaterals) return [];

        return collaterals.map((collateral) => ({
            label: collateral.symbol,
            value: collateral.address,
            data: {
                chainId: collateral.chainId,
                address: collateral.address,
                usdValue:
                    kind === CampaignKind.LiquityV2Debt
                        ? collateral.usdMintedDebt
                        : collateral.usdStabilityPoolDebt,
            },
        }));
    }, [loading, collaterals, kind]);

    const handleOnChange = useCallback(
        (option: SelectOption<string, OptionData>) => {
            if (!collaterals) return;

            const selected = collaterals.find(
                ({ address }) => address === option.value,
            );
            if (!selected) return;
            onChange({ collateral: selected });
        },
        [collaterals, onChange],
    );

    return (
        <Select
            size="lg"
            label={t("collateral")}
            search
            disabled={!kind}
            options={options}
            loading={loading}
            value={value?.address as string}
            onChange={handleOnChange}
            messages={{ noResults: t("noCollaterals") }}
            renderOption={option}
            renderSelectedPrefix={selectedPrefix}
            noPrefixPadding
            listHeader={
                <div className={styles.header}>
                    <Typography
                        size="xs"
                        weight="medium"
                        variant="tertiary"
                        uppercase
                    >
                        {t("token")}
                    </Typography>
                    <Typography
                        size="xs"
                        weight="medium"
                        variant="tertiary"
                        uppercase
                    >
                        {kind === CampaignKind.LiquityV2Debt
                            ? t("debt")
                            : t("deposits")}
                    </Typography>
                </div>
            }
            className={styles.root}
        />
    );
}
