import { useCallback, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Select, Typography, type SelectOption } from "@metrom-xyz/ui";
import {
    ProtocolType,
    type LiquityV2Protocol,
    type ProtocolBase,
} from "@metrom-xyz/chains";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { useChainType } from "@/src/hooks/useChainType";
import { ProtocolLogo } from "@/src/components/protocol-logo";
import type { LiquityV2CampaignPayloadPart } from "@/src/types/campaign/liquity-v2-campaign";

import styles from "./styles.module.css";

interface LiquityBrandSelectProps {
    chainId?: number;
    value?: LiquityV2Protocol;
    onChange: (value: LiquityV2CampaignPayloadPart) => void;
}

interface OptionData {
    protocol: ProtocolBase;
}

const option = (option: SelectOption<string, OptionData>) => {
    const { label, data } = option;
    if (!data) return <></>;

    return (
        <div className={styles.option}>
            <ProtocolLogo
                size="sm"
                protocol={data.protocol}
                className={styles.icon}
            />
            <Typography>{label}</Typography>
        </div>
    );
};

const selectedPrefix = (
    option: SelectOption<string, OptionData> | null | undefined,
) => {
    if (!option || !option.data) return <></>;
    const { data } = option;

    return <ProtocolLogo size="xs" protocol={data.protocol} />;
};

export function LiquityV2BrandSelect({
    chainId,
    value,
    onChange,
}: LiquityBrandSelectProps) {
    const t = useTranslations("newCampaign.inputs");

    const chainType = useChainType();
    const brands = useProtocolsInChain({
        chainId,
        chainType,
        type: ProtocolType.LiquityV2,
        active: true,
    });

    const options = useMemo<SelectOption<string, OptionData>[]>(
        () =>
            brands.map((protocol) => ({
                label: protocol.name,
                value: protocol.slug,
                data: { protocol },
            })),
        [brands],
    );

    useEffect(() => {
        if (!chainId || !!value || brands.length > 1) return;
        onChange({ brand: brands[0] });
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
