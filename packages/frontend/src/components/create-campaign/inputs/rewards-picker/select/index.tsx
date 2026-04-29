import { useWatchBalances } from "@/src/hooks/use-watch-balances";
import type { OnChainAmount, WhitelistedErc20Token } from "@metrom-xyz/sdk";
import { Select, Typography, type SelectOption } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { RemoteLogo } from "@/src/components/remote-logo";
import { useAccount } from "@/src/hooks/useAccount";
import { formatAmount, formatUsdAmount } from "@/src/utils/format";
import { ListFooter } from "./list-footer";
import type { WhitelistedErc20TokenAmount } from "@/src/types/common";
import classNames from "classnames";

import styles from "./styles.module.css";

interface RewardsPickerTokensSelectProps {
    label?: string;
    chainId?: number;
    tokens?: WhitelistedErc20Token[];
    unavailables?: WhitelistedErc20TokenAmount[];
    value?: SelectOption<string, RewardsPickerSelectOptionData>;
    loading?: boolean;
    className?: string;
    onChange: (
        value: SelectOption<string, RewardsPickerSelectOptionData>,
    ) => void;
}

export interface RewardsPickerSelectOptionData {
    chainId: number;
    token: WhitelistedErc20Token;
    balance: OnChainAmount | null;
}

const option = (
    option: SelectOption<string, RewardsPickerSelectOptionData>,
) => {
    const { label, data } = option;
    if (!data) return <></>;

    const { balance, token } = data;

    return (
        <div className={styles.option}>
            <div className={styles.name}>
                <RemoteLogo
                    size="xs"
                    chain={data.chainId}
                    address={data.token.address}
                />
                <Typography>{label}</Typography>
            </div>
            <div className={styles.balance}>
                <Typography size="sm">
                    {balance !== null
                        ? formatAmount({ amount: balance.formatted })
                        : "-"}
                </Typography>
                <Typography size="xs" variant="secondary">
                    {balance !== null
                        ? formatUsdAmount({
                              amount: balance.formatted * token.usdPrice,
                          })
                        : "-"}
                </Typography>
            </div>
        </div>
    );
};

const selectedPrefix = (
    option:
        | SelectOption<string, RewardsPickerSelectOptionData>
        | null
        | undefined,
) => {
    if (!option || !option.data) return <></>;
    const { data } = option;

    return (
        <RemoteLogo
            size="xxs"
            chain={data.chainId}
            address={data.token.address}
        />
    );
};

export function RewardsPickerTokensSelect({
    label,
    chainId,
    tokens,
    unavailables,
    value,
    loading,
    className,
    onChange,
}: RewardsPickerTokensSelectProps) {
    const t = useTranslations("newCampaign.inputs.rewardsPicker");
    const { address } = useAccount();
    const { tokensWithBalance, loading: loadingBalances } =
        useWatchBalances<WhitelistedErc20Token>({ chainId, address, tokens });

    const options: SelectOption<string, RewardsPickerSelectOptionData>[] =
        useMemo(() => {
            if (loadingBalances || !tokens || !tokensWithBalance || !chainId)
                return [];

            return tokensWithBalance.map(({ token, balance }) => {
                return {
                    label: token.symbol,
                    value: token.address,
                    data: {
                        chainId,
                        token,
                        balance,
                    },
                };
            });
        }, [loadingBalances, tokens, tokensWithBalance, chainId]);

    const optionDisabled = useCallback(
        (option: SelectOption<string, RewardsPickerSelectOptionData>) => {
            if (!unavailables || unavailables.length === 0) return false;

            return !!unavailables.find(
                ({ token }) =>
                    token.address.toLowerCase() === option.value.toLowerCase(),
            );
        },
        [unavailables],
    );

    return (
        <Select
            label={label || t("label")}
            size="lg"
            loading={loading || loadingBalances}
            disabled={!tokens}
            options={options}
            value={value?.value as string}
            messages={{ noResults: t("noTokens") }}
            onChange={onChange}
            renderOption={option}
            optionDisabled={optionDisabled}
            renderSelectedPrefix={selectedPrefix}
            noPrefixPadding
            noContained
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
                        {t("balance")}
                    </Typography>
                </div>
            }
            listFooter={<ListFooter />}
            className={classNames(styles.root, className)}
        />
    );
}
