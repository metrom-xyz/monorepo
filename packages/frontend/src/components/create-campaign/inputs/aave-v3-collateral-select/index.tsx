import { useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Select, Typography, type SelectOption } from "@metrom-xyz/ui";
import type { AaveV3CampaignPayloadPart } from "@/src/types/campaign/aave-v3-campaign";
import { type AaveV3Protocol } from "@metrom-xyz/chains";
import { useChainType } from "@/src/hooks/useChainType";
import { useAaveV3Collaterals } from "@/src/hooks/useAaveV3Collaterals";
import {
    type AaveV3Collateral,
    type AaveV3Market,
    CampaignKind,
} from "@metrom-xyz/sdk";
import { RemoteLogo } from "@/src/components/remote-logo";
import type { Address } from "viem";
import { getAaveV3UsdTarget } from "@/src/utils/aave-v3";
import { formatUsdAmount } from "@/src/utils/format";

import styles from "./styles.module.css";

interface AaveV3CollateralSelectProps {
    chainId?: number;
    brand?: AaveV3Protocol;
    market?: AaveV3Market;
    kind?: CampaignKind;
    value?: AaveV3Collateral;
    onChange: (value: AaveV3CampaignPayloadPart) => void;
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

export function AaveV3CollateralSelect({
    chainId,
    brand,
    market,
    kind,
    value,
    onChange,
}: AaveV3CollateralSelectProps) {
    const t = useTranslations("newCampaign.inputs");

    const chainType = useChainType();
    const { loading, collaterals } = useAaveV3Collaterals({
        chainId,
        chainType,
        market: market?.address,
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
                usdValue: getAaveV3UsdTarget({ collateral, kind }),
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
                        {kind === CampaignKind.AaveV3Borrow
                            ? t("debt")
                            : t("deposits")}
                    </Typography>
                </div>
            }
            className={styles.root}
        />
    );
}
