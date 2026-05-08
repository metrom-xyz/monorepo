import { useChainType } from "@/src/hooks/useChainType";
import type { Erc4626VaultCampaignPayloadPart } from "@/src/types/campaign/erc4626-vault-campaign";
import type { Erc4626Vault } from "@metrom-xyz/sdk";
import {
    Select,
    Skeleton,
    Typography,
    type SelectOption,
} from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo } from "react";
import { usePrevious } from "react-use";
import { useErc4626Vaults } from "@/src/hooks/useErc4626Vaults";
import { RemoteLogo } from "@/src/components/remote-logo";
import type { Address } from "viem";
import type { Erc4626VaultProtocol } from "@metrom-xyz/chains";
import { formatUsdAmount } from "@/src/utils/format";

import styles from "./styles.module.css";

interface Erc4626VaultSelectProps {
    chainId?: number;
    brand?: Erc4626VaultProtocol;
    vault?: Erc4626Vault;
    resetTrigger?: unknown;
    onChange: (value: Erc4626VaultCampaignPayloadPart) => void;
}

interface OptionData {
    chainId: number;
    usdValue: number;
}

const option = (option: SelectOption<string, OptionData>) => {
    const { label, value, data } = option;
    if (!data) return <></>;

    return (
        <div className={styles.option}>
            <div className={styles.vault}>
                <RemoteLogo
                    chain={data.chainId}
                    address={value as Address}
                    size="xxs"
                />
                <div className={styles.vaultNameWrapper}>
                    <Typography truncate>{label}</Typography>
                </div>
            </div>
            <Typography size="sm" variant="secondary">
                {formatUsdAmount({ amount: data.usdValue })}
            </Typography>
        </div>
    );
};

const loadingOption = () => {
    return (
        <div className={styles.option}>
            <div className={styles.vault}>
                <RemoteLogo loading size="xxs" className={styles.skeleton} />
                <Skeleton width={180} className={styles.skeleton} />
            </div>
            <Skeleton size="sm" width={64} className={styles.skeleton} />
        </div>
    );
};

const selectedPrefix = (
    option: SelectOption<string, OptionData> | null | undefined,
) => {
    if (!option || !option.data) return <></>;
    const { value, data } = option;

    return (
        <RemoteLogo
            chain={data.chainId}
            address={value as Address}
            size="xxs"
        />
    );
};

export function Erc4626VaultSelect({
    chainId,
    brand,
    vault,
    resetTrigger,
    onChange,
}: Erc4626VaultSelectProps) {
    const t = useTranslations("newCampaign.inputs.erc4626VaultSelect");
    const chainType = useChainType();
    const { vaults, loading } = useErc4626Vaults({
        chainId,
        chainType,
        brand: brand?.slug,
    });

    const prevResetTrigger = usePrevious(resetTrigger);

    useEffect(() => {
        if (resetTrigger === prevResetTrigger || !prevResetTrigger) return;
        onChange({ vault: undefined });
    }, [resetTrigger, prevResetTrigger, onChange]);

    const options: SelectOption<string, OptionData>[] = useMemo(() => {
        if (loading || !vaults || !chainId) return [];

        return vaults.map((vault) => ({
            label: vault.name,
            value: vault.address,
            data: {
                chainId,
                usdValue: vault.usdTvl,
            },
        }));
    }, [loading, vaults, chainId]);

    const handleOnSelectChange = useCallback(
        (option: SelectOption<string, OptionData>) => {
            if (!vaults) return;

            const selected = vaults.find(
                ({ address }) => address === option.value,
            );
            if (!selected) return;

            onChange({ vault: selected });
        },
        [vaults, onChange],
    );

    return (
        <Select
            size="lg"
            label={t("label")}
            search
            loading={loading}
            disabled={!brand}
            options={options}
            value={vault?.address as string}
            messages={{ noResults: t("noVaults") }}
            onChange={handleOnSelectChange}
            renderOption={option}
            renderLoadingOption={loadingOption}
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
                        {t("label")}
                    </Typography>
                    <Typography
                        size="xs"
                        weight="medium"
                        variant="tertiary"
                        uppercase
                    >
                        {t("tvl")}
                    </Typography>
                </div>
            }
            className={styles.root}
        />
    );
}
