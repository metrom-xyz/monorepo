import { Select, Typography, type SelectOption } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { type Erc4626VaultProtocol, ProtocolType } from "@metrom-xyz/chains";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { useCallback, useEffect, useMemo, type FunctionComponent } from "react";
import type { Erc4626VaultCampaignPayloadPart } from "@/src/types/campaign/erc4626-vault-campaign";
import { useChainType } from "@/src/hooks/useChainType";
import type { SVGIcon } from "@/src/types/common";
import { usePrevious } from "react-use";

import styles from "./styles.module.css";

interface Erc4626VaultBrandSelectProps {
    chainId?: number;
    value?: Erc4626VaultProtocol;
    resetTrigger?: unknown;
    onChange: (value: Erc4626VaultCampaignPayloadPart) => void;
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

export function Erc4626VaultBrandSelect({
    chainId,
    value,
    resetTrigger,
    onChange,
}: Erc4626VaultBrandSelectProps) {
    const t = useTranslations("newCampaign.inputs");
    const chainType = useChainType();
    const erc4626Vaults = useProtocolsInChain({
        chainId,
        chainType,
        type: ProtocolType.Erc4626Vault,
        active: true,
    });
    const prevResetTrigger = usePrevious(resetTrigger);

    useEffect(() => {
        if (resetTrigger === prevResetTrigger || !prevResetTrigger) return;
        onChange({ brand: undefined });
    }, [resetTrigger, prevResetTrigger, onChange]);

    const options = useMemo<SelectOption<string, OptionData>[]>(
        () =>
            erc4626Vaults.map((protocol) => ({
                label: protocol.name,
                value: protocol.slug,
                data: {
                    logo: protocol.logo,
                },
            })),
        [erc4626Vaults],
    );

    useEffect(() => {
        if (!!value || options.length > 1) return;
        const selected = erc4626Vaults.find(
            ({ slug }) => slug === options[0].value,
        );
        if (!selected) return;
        onChange({ brand: selected });
    }, [options, erc4626Vaults, value, onChange]);

    const handleOnChange = useCallback(
        (option: SelectOption<string, OptionData>) => {
            const selected = erc4626Vaults.find(
                ({ slug }) => slug === option.value,
            );
            if (!selected) return;
            onChange({ brand: selected });
        },
        [erc4626Vaults, onChange],
    );

    return (
        <Select
            size="lg"
            label={t("vaultBrand")}
            search
            disabled={!chainId}
            options={options}
            value={value?.slug as string}
            onChange={handleOnChange}
            messages={{ noResults: t("noDexes") }}
            renderOption={option}
            renderSelectedPrefix={selectedPrefix}
            noPrefixPadding
            className={styles.root}
        />
    );
}
