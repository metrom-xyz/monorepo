import { useChainType } from "@/src/hooks/useChainType";
import { usePools } from "@/src/hooks/usePools";
import type { AmmPoolLiquidityCampaignPayloadPart } from "@/src/types/campaign/amm-pool-liquidity-campaign";
import type { SupportedDex } from "@metrom-xyz/chains";
import type { AmmPool, Erc20Token } from "@metrom-xyz/sdk";
import { Select, Typography, type SelectOption } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";
import { usePrevious } from "react-use";
import { ListHeader } from "./list-header";
import { formatPercentage, formatUsdAmount } from "@/src/utils/format";
import { ListFooter } from "./list-footer";

import styles from "./styles.module.css";

interface PoolSelectProps {
    chainId?: number;
    dex?: SupportedDex;
    value?: AmmPool;
    resetTrigger?: unknown;
    onChange: (value: AmmPoolLiquidityCampaignPayloadPart) => void;
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

    return (
        <div className={styles.option}>
            <div className={styles.pool}>
                <PoolRemoteLogo
                    size="xs"
                    chain={data.chainId}
                    tokens={data.tokens.map((token) => ({
                        address: token.address,
                        defaultText: token.symbol,
                    }))}
                />
                <Typography>{label}</Typography>
                <Typography size="xs" variant="tertiary" className={styles.fee}>
                    {formatPercentage({
                        percentage: data.fee,
                        keepDust: true,
                    })}
                </Typography>
            </div>
            <Typography size="sm">
                {formatUsdAmount({ amount: data.usdTvl })}
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
    value,
    resetTrigger,
    onChange,
}: PoolSelectProps) {
    const [baseTokenFilter, setBaseTokenFilter] = useState<
        Erc20Token | undefined
    >(undefined);

    const t = useTranslations("newCampaign.inputs");
    const chainType = useChainType();
    const { pools, loading } = usePools({
        chainId,
        chainType,
        dex,
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

    const handleOnChange = useCallback(
        (option: SelectOption<string, OptionData>) => {
            if (!pools) return;

            const selected = pools.find(({ id }) => id === option.value);
            if (!selected) return;

            onChange({ pool: selected });
        },
        [pools, onChange],
    );

    return (
        <Select
            size="lg"
            label={t("pool")}
            search
            loading={loading}
            disabled={!dex}
            options={options}
            value={value?.id as string}
            messages={{ noResults: t("noPools") }}
            onChange={handleOnChange}
            renderOption={option}
            renderSelectedPrefix={selectedPrefix}
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
    );
}
