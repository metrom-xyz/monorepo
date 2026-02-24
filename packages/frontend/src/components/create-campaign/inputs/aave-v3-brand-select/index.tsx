import { useCallback, useEffect, useMemo, type FunctionComponent } from "react";
import { useTranslations } from "next-intl";
import { Select, Typography, type SelectOption } from "@metrom-xyz/ui";
import type { AaveV3CampaignPayloadPart } from "@/src/types/campaign/aave-v3-campaign";
import { ProtocolType, type AaveV3Protocol } from "@metrom-xyz/chains";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { useChainType } from "@/src/hooks/useChainType";
import type { SVGIcon } from "@/src/types/common";

import styles from "./styles.module.css";

interface AaveV3BrandSelectProps {
    chainId?: number;
    value?: AaveV3Protocol;
    onChange: (value: AaveV3CampaignPayloadPart) => void;
}

interface OptionData {
    logo: FunctionComponent<SVGIcon>;
}

const option = (option: SelectOption<string, OptionData>) => {
    const { label, data } = option;
    if (!data) return <></>;

    return (
        <div className={styles.option}>
            <data.logo className={styles.icon} />
            <Typography>{label}</Typography>
        </div>
    );
};

const selectedPrefix = (
    option: SelectOption<string, OptionData> | null | undefined,
) => {
    if (!option || !option.data) return <></>;
    const { data } = option;

    return <data.logo className={styles.prefixIcon} />;
};

export function AaveV3BrandSelect({
    chainId,
    value,
    onChange,
}: AaveV3BrandSelectProps) {
    const t = useTranslations("newCampaign.inputs");

    const chainType = useChainType();
    const brands = useProtocolsInChain({
        chainId,
        chainType,
        type: ProtocolType.AaveV3,
        active: true,
    });

    const options = useMemo<SelectOption<string, OptionData>[]>(
        () =>
            brands.map((protocol) => ({
                label: protocol.name,
                value: protocol.slug,
                data: {
                    logo: protocol.logo,
                },
            })),
        [brands],
    );

    useEffect(() => {
        if (!chainId || !!value || brands.length > 1) return;
        onChange({
            brand: brands[0],
        });
    }, [chainId, brands, value, onChange]);

    const handleOnChange = useCallback(
        (option: SelectOption<string, OptionData>) => {
            const selected = brands.find(({ slug }) => slug === option.value);
            if (!selected) return;
            onChange({ brand: selected });
        },
        [brands, onChange],
    );

    return (
        <Select
            size="lg"
            label={t("platform")}
            search
            disabled={!chainId}
            options={options}
            value={value?.slug as string}
            onChange={handleOnChange}
            messages={{ noResults: t("noPlatforms") }}
            renderOption={option}
            renderSelectedPrefix={selectedPrefix}
            noPrefixPadding
            className={styles.root}
        />
    );
}
