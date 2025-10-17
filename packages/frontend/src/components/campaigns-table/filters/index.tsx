import classNames from "classnames";
import { Button, Select, Typography, type SelectOption } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { FilterableStatus } from "@/src/types/common";
import type { CampaignSortOptions } from "@/src/utils/filtering";
import { ProtocolLogo } from "../../protocol-logo";
import { useSupportedProtocols } from "@/src/hooks/useSupportedProtocols";
import { useChainsWithTypes } from "@/src/hooks/useChainsWithTypes";
import { getCrossVmChainData } from "@/src/utils/chain";
import { ChainType } from "@metrom-xyz/sdk";
import { APTOS } from "@/src/commons/env";

import styles from "./styles.module.css";

export const CHAIN_ALL = "0";

const statusSelectRenderOption = (option: {
    label: string;
    color?: string;
    value: FilterableStatus;
}) => {
    return (
        <div className={styles.customOptionContainer}>
            {option.value !== FilterableStatus.All && (
                <span className={classNames(styles.dot, option.color)} />
            )}
            <Typography weight="medium">{option.label}</Typography>
        </div>
    );
};

const chainSelectRenderOption = (option: { label: string; value: string }) => {
    const [chainType, chainId] = option.value.split("-");

    const ChainIcon =
        option.value !== CHAIN_ALL
            ? getCrossVmChainData(Number(chainId), chainType as ChainType)?.icon
            : null;
    return (
        <div className={styles.customOptionContainer}>
            {ChainIcon && <ChainIcon className={styles.icon} />}
            <Typography className={styles.selectOptionText} weight="medium">
                {option.label}
            </Typography>
        </div>
    );
};

const protocolSelectRenderOption = (option: {
    label: string;
    icon?: ReactNode;
    value: string;
}) => {
    return (
        <div className={styles.customOptionContainer}>
            {option.icon && option.icon}
            <Typography className={styles.selectOptionText} weight="medium">
                {option.label}
            </Typography>
        </div>
    );
};

export interface Filters {
    protocol: string;
    status: FilterableStatus;
    chainId: string;
    chainType?: ChainType;
}

interface FilterProps {
    sortField?: CampaignSortOptions;
    order?: number;
    onClearFilters: () => void;
    onFiltersChange: (filters: Partial<Filters>) => void;
}

export function Filters({
    sortField,
    order,
    onClearFilters,
    onFiltersChange,
}: FilterProps) {
    const t = useTranslations("allCampaigns");

    const chains = useChainsWithTypes({
        chainType: APTOS ? ChainType.Aptos : undefined,
    });
    const protocols = useSupportedProtocols({ crossVm: !APTOS });
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [protocol, setProtocol] = useState("");
    const [status, setStatus] = useState<FilterableStatus>(
        FilterableStatus.All,
    );
    const [chain, setChain] = useState(CHAIN_ALL);
    const chainInitialized = useRef(false);

    const filtersActive = useMemo(
        () =>
            !!protocol ||
            status !== FilterableStatus.All ||
            !!sortField ||
            !!order ||
            chain !== CHAIN_ALL,
        [protocol, status, sortField, order, chain],
    );

    const statusOptions = useMemo(() => {
        return [
            {
                label: t("filters.status.all"),
                value: FilterableStatus.All,
            },
            {
                label: t("filters.status.live"),
                value: FilterableStatus.Active,
                color: "bg-green-500",
            },
            {
                label: t("filters.status.upcoming"),
                value: FilterableStatus.Upcoming,
                color: "bg-blue-500",
            },
            {
                label: t("filters.status.ended"),
                value: FilterableStatus.Expired,
                color: "bg-zinc-500",
            },
        ];
    }, [t]);

    const protocolOptions = useMemo(() => {
        const options: {
            label: string;
            icon?: ReactNode;
            value: string;
        }[] = [
            {
                label: t("filters.protocol.all"),
                value: "",
            },
        ];

        for (const protocol of protocols) {
            options.push({
                label: protocol.name,
                icon: (
                    <ProtocolLogo
                        protocol={protocol}
                        size="sm"
                        className={styles.icon}
                    />
                ),
                value: protocol.slug,
            });
        }
        return options;
    }, [protocols, t]);

    const chainOptions = useMemo(() => {
        const options: {
            label: string;
            value: string;
            query: string | null;
        }[] = [
            {
                label: t("filters.chain.all"),
                value: CHAIN_ALL,
                query: null,
            },
        ];
        for (const chain of chains) {
            const chainData = getCrossVmChainData(chain.id, chain.type);
            if (!chainData) continue;

            options.push({
                label: chainData.name,
                value: `${chain.type}-${chain.id}`,
                query: chainData.name.toLowerCase().replaceAll(" ", "-"),
            });
        }
        return options;
    }, [chains, t]);

    useEffect(() => {
        // Skip updating the search params once initialized to avoid
        // unnecessary re-renders
        if (chainInitialized.current) return;
        chainInitialized.current = true;

        const chain = searchParams.get("chain");
        if (!chain) return;

        const resolvedChain = chainOptions.find(
            (option) => option.query === chain,
        );

        const params = new URLSearchParams(searchParams.toString());
        if (resolvedChain?.query) {
            let chainType = undefined;
            let chainId = undefined;
            if (resolvedChain.value !== CHAIN_ALL) {
                const chainTypeAndId = resolvedChain.value.split("-");
                chainType = chainTypeAndId[0] as ChainType;
                chainId = chainTypeAndId[1];
            }

            setChain(resolvedChain.value);
            onFiltersChange({ chainId, chainType });

            params.set("chain", resolvedChain.query);
        } else {
            setChain(CHAIN_ALL);
            onFiltersChange({ chainId: CHAIN_ALL });
            params.delete("chain");
        }
    }, [chainOptions, searchParams, onFiltersChange]);

    const handleProtocolChange = useCallback(
        (protocol: SelectOption<string>) => {
            setProtocol(protocol.value);
            onFiltersChange({ protocol: protocol.value });
        },
        [onFiltersChange],
    );

    const handleStatusChange = useCallback(
        (status: SelectOption<FilterableStatus>) => {
            setStatus(status.value);
            onFiltersChange({ status: status.value });
        },
        [onFiltersChange],
    );

    const handleChainChange = useCallback(
        (chain: SelectOption<string> & { query: string | null }) => {
            const params = new URLSearchParams(searchParams.toString());

            if (!chain.query) params.delete("chain");
            else params.set("chain", chain.query);

            router.replace(`${pathname}?${params.toString()}`, {
                scroll: false,
            });

            let chainType = undefined;
            let chainId = CHAIN_ALL;
            if (chain.value !== CHAIN_ALL) {
                const chainTypeAndId = chain.value.split("-");
                chainType = chainTypeAndId[0] as ChainType;
                chainId = chainTypeAndId[1];
            }

            setChain(chain.value);
            onFiltersChange({ chainId, chainType });
        },
        [pathname, router, searchParams, onFiltersChange],
    );

    const handleClearFilters = useCallback(() => {
        setProtocol("");
        setStatus(FilterableStatus.All);
        setChain(CHAIN_ALL);

        const params = new URLSearchParams(searchParams.toString());
        params.delete("chain");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });

        if (onClearFilters) onClearFilters();
    }, [pathname, searchParams, router, onClearFilters]);

    return (
        <div className={styles.root}>
            <div className={styles.selectionFilters}>
                <Select
                    options={statusOptions}
                    value={status}
                    onChange={handleStatusChange}
                    label={t("filters.status.label")}
                    messages={{
                        noResults: "",
                    }}
                    className={styles.filterInput}
                    renderOption={statusSelectRenderOption}
                />
                <Select
                    options={protocolOptions}
                    value={protocol}
                    search
                    onChange={handleProtocolChange}
                    label={t("filters.protocol.label")}
                    messages={{
                        noResults: "",
                    }}
                    className={styles.filterInput}
                    renderOption={protocolSelectRenderOption}
                />
                <div className={styles.lastFilterWrapper}>
                    <Select
                        options={chainOptions}
                        value={chain}
                        search
                        onChange={handleChainChange}
                        label={t("filters.chain.label")}
                        messages={{
                            noResults: "",
                        }}
                        className={styles.filterInput}
                        renderOption={chainSelectRenderOption}
                    />
                    <Button
                        variant="secondary"
                        size="xs"
                        border={false}
                        onClick={handleClearFilters}
                        className={{
                            root: classNames(styles.clearButton, {
                                [styles.visible]: filtersActive,
                            }),
                        }}
                    >
                        {t("filters.clear")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
