import { Select, Typography, type SelectOption } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { type DexProtocol, ProtocolType } from "@metrom-xyz/chains";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { useCallback, useEffect, type FunctionComponent } from "react";
import type { AmmPoolLiquidityCampaignPayloadPart } from "@/src/types/campaign/amm-pool-liquidity-campaign";
import { useChainType } from "@/src/hooks/useChainType";
import type { SVGIcon } from "@/src/types/common";
import { usePrevious } from "react-use";

import styles from "./styles.module.css";

interface DexSelectProps {
    chainId?: number;
    value?: DexProtocol;
    resetTrigger?: unknown;
    onChange: (value: AmmPoolLiquidityCampaignPayloadPart) => void;
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

export function DexSelect({
    chainId,
    value,
    resetTrigger,
    onChange,
}: DexSelectProps) {
    const t = useTranslations("newCampaign.inputs");
    const chainType = useChainType();
    const dexes = useProtocolsInChain({
        chainId,
        chainType,
        type: ProtocolType.Dex,
        active: true,
    });
    const prevResetTrigger = usePrevious(resetTrigger);

    useEffect(() => {
        if (resetTrigger === prevResetTrigger || !prevResetTrigger) return;
        onChange({ dex: undefined });
    }, [resetTrigger, prevResetTrigger, onChange]);

    const options: SelectOption<string, OptionData>[] = dexes.map(
        (protocol) => ({
            label: protocol.name,
            value: protocol.slug,
            data: {
                logo: protocol.logo,
            },
        }),
    );

    const handleOnChange = useCallback(
        (option: SelectOption<string, OptionData>) => {
            const selected = dexes.find(({ slug }) => slug === option.value);
            if (!selected) return;
            onChange({ dex: selected });
        },
        [dexes, onChange],
    );

    return (
        <Select
            size="lg"
            label={t("dex")}
            search
            disabled={!chainId}
            options={options}
            value={value?.slug as string}
            onChange={handleOnChange}
            messages={{ noResults: t("noDexes") }}
            renderOption={option}
            renderSelectedPrefix={selectedPrefix}
            className={styles.root}
        />
    );
}
