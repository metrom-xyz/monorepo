import { useChainType } from "@/src/hooks/useChainType";
import { usePools } from "@/src/hooks/usePools";
import type { AmmPoolLiquidityCampaignPayloadPart } from "@/src/types/campaign/amm-pool-liquidity-campaign";
import type { DexProtocol } from "@metrom-xyz/chains";
import type { AmmPool, Erc20Token } from "@metrom-xyz/sdk";
import { Select, type SelectOption } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";
import { usePrevious } from "react-use";
import { ListHeader } from "./list-header";
import { ListFooter } from "./list-footer";
import { Pool } from "./pool";
import { Picker } from "./picker";
import type { FormErrors } from "@/src/context/form-errors";

import styles from "./styles.module.css";

interface PoolSelectProps {
    chainId?: number;
    dex?: DexProtocol;
    pool?: AmmPool;
    resetTrigger?: unknown;
    onChange: (value: AmmPoolLiquidityCampaignPayloadPart) => void;
    onError: (errors: FormErrors) => void;
}

interface OptionData {
    chainId: number;
    tokens: Erc20Token[];
    usdTvl: number;
    fee?: number;
}

const option = (option: SelectOption<string, OptionData>) => {
    const { label, data } = option;
    if (!data) return <></>;

    return <Pool {...data} label={label} />;
};

const selectedPrefix = (
    option: SelectOption<string, OptionData> | null | undefined,
) => {
    if (!option || !option.data) return <></>;
    const { data } = option;

    return (
        <PoolRemoteLogo
            size="xxs"
            chain={data.chainId}
            tokens={data.tokens.map((token) => ({
                address: token.address,
                defaultText: token.symbol,
            }))}
        />
    );
};

export function PoolSelect({
    chainId,
    dex,
    pool,
    resetTrigger,
    onChange,
    onError,
}: PoolSelectProps) {
    const [baseTokenFilter, setBaseTokenFilter] = useState<
        Erc20Token | undefined
    >(undefined);

    const t = useTranslations("newCampaign.inputs.poolSelect");
    const chainType = useChainType();
    const { pools, loading } = usePools({
        chainId,
        chainType,
        dex: dex?.slug,
        enabled: dex?.supportsFetchAllPools,
    });

    const prevResetTrigger = usePrevious(resetTrigger);

    useEffect(() => {
        if (resetTrigger === prevResetTrigger || !prevResetTrigger) return;
        onChange({ pool: undefined });
    }, [resetTrigger, prevResetTrigger, onChange]);

    const options: SelectOption<string, OptionData>[] = useMemo(() => {
        if (loading || !pools) return [];

        return pools
            .filter((pool) => {
                if (!baseTokenFilter) return true;
                return pool.tokens
                    .map(({ address }) => address.toLowerCase())
                    .includes(baseTokenFilter.address.toLowerCase());
            })
            .map((pool) => ({
                label: pool.tokens.map((token) => token.symbol).join(" / "),
                value: pool.id,
                data: {
                    chainId: pool.chainId,
                    tokens: pool.tokens,
                    usdTvl: pool.usdTvl,
                    fee: pool.fee,
                },
            }));
    }, [baseTokenFilter, loading, pools]);

    const handleOnSelectChange = useCallback(
        (option: SelectOption<string, OptionData>) => {
            if (!pools) return;

            const selected = pools.find(({ id }) => id === option.value);
            if (!selected) return;

            onChange({ pool: selected });
        },
        [pools, onChange],
    );

    const handleOnPickerChange = useCallback(
        (pool?: AmmPool) => {
            onChange({ pool });
        },
        [onChange],
    );

    return dex && dex.supportsFetchAllPools ? (
        <Select
            size="lg"
            label={t("label")}
            search
            loading={loading}
            disabled={!dex}
            options={options}
            value={pool?.id as string}
            messages={{ noResults: t("noPools") }}
            onChange={handleOnSelectChange}
            renderOption={option}
            renderSelectedPrefix={selectedPrefix}
            noPrefixPadding
            listHeader={
                <ListHeader
                    chainId={chainId}
                    baseTokenFilter={baseTokenFilter}
                    onBaseTokenChange={setBaseTokenFilter}
                />
            }
            listFooter={<ListFooter />}
            className={styles.root}
        />
    ) : (
        <Picker
            disabled={!dex}
            chainId={chainId}
            dex={dex}
            pool={pool}
            onChange={handleOnPickerChange}
            onError={onError}
        />
    );
}
