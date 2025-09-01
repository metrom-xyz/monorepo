import classNames from "classnames";
import { SearchIcon } from "@/src/assets/search-icon";
import {
    Button,
    Select,
    TextInput,
    Typography,
    type SelectOption,
} from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type ReactNode,
} from "react";
import { FilterableStatus } from "@/src/types/common";
import type { CampaignSortOptions } from "@/src/utils/filtering";
import { ProtocolLogo } from "../../protocol-logo";
import { useSupportedProtocols } from "@/src/hooks/useSupportedProtocols";
import { useDebounce } from "react-use";
import { useChainIds } from "@/src/hooks/useChainsIds";
import { getCrossVmChainData } from "@/src/utils/chain";

import styles from "./styles.module.css";

export const CHAIN_ALL = 0;

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

const chainSelectRenderOption = (option: { label: string; value: number }) => {
    const ChainIcon =
        option.value !== 0 ? getCrossVmChainData(option.value)?.icon : null;
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
    search: string;
    protocol: string;
    status: FilterableStatus;
    chain: number;
}

interface FilterProps {
    sortField?: CampaignSortOptions;
    order?: number;
    onClearFilters?: () => void;
    onFiltersChange?: (filters: Filters) => void;
}

export function Filters({
    sortField,
    order,
    onClearFilters,
    onFiltersChange,
}: FilterProps) {
    const t = useTranslations("allCampaigns");

    const chains = useChainIds();
    const protocols = useSupportedProtocols({ crossVm: true });
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState("");
    const [protocol, setProtocol] = useState("");
    const [status, setStatus] = useState<FilterableStatus>(
        FilterableStatus.All,
    );
    const [chain, setChain] = useState(CHAIN_ALL);
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useDebounce(
        () => {
            setDebouncedSearch(search);
        },
        300,
        [search],
    );

    const filtersActive = useMemo(
        () =>
            !!search ||
            !!protocol ||
            status !== FilterableStatus.All ||
            !!sortField ||
            !!order ||
            !!chain,
        [search, protocol, status, sortField, order, chain],
    );

    const statusOptions = useMemo(() => {
        return [
            {
                label: t("filters.status.all"),
                value: FilterableStatus.All,
            },
            {
                label: t("filters.status.live"),
                value: FilterableStatus.Live,
                color: "bg-green-500",
            },
            {
                label: t("filters.status.upcoming"),
                value: FilterableStatus.Upcoming,
                color: "bg-blue-500",
            },
            {
                label: t("filters.status.ended"),
                value: FilterableStatus.Ended,
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
            value: number;
            query: string | null;
        }[] = [
            {
                label: t("filters.chain.all"),
                value: CHAIN_ALL,
                query: null,
            },
        ];
        for (const chain of chains) {
            const chainData = getCrossVmChainData(chain);
            if (!chainData) continue;

            options.push({
                label: chainData.name,
                value: chain,
                query: chainData.name.toLowerCase().replaceAll(" ", "-"),
            });
        }
        return options;
    }, [chains, t]);

    useEffect(() => {
        const chain = searchParams.get("chain");
        if (chain) {
            const resolvedChain = chainOptions.find(
                (option) => option.query === chain,
            );

            const params = new URLSearchParams(searchParams.toString());
            if (resolvedChain?.query) {
                setChain(resolvedChain.value);
                params.set("chain", resolvedChain.query);
            } else {
                setChain(CHAIN_ALL);
                params.delete("chain");
            }
        }
    }, [searchParams, pathname, chainOptions]);

    useEffect(() => {
        if (!onFiltersChange) return;

        onFiltersChange({
            search: debouncedSearch,
            protocol,
            status,
            chain,
        });
    }, [debouncedSearch, protocol, status, chain, onFiltersChange]);

    function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value);
    }

    const handleProtocolChange = useCallback(
        (protocol: SelectOption<string>) => {
            setProtocol(protocol.value);
        },
        [],
    );

    const handleStatusChange = useCallback(
        (status: SelectOption<FilterableStatus>) => {
            setStatus(status.value);
        },
        [],
    );

    const handleChainChange = useCallback(
        (chain: SelectOption<number> & { query: string | null }) => {
            setChain(chain.value);
            const params = new URLSearchParams(searchParams.toString());
            if (!chain.query) params.delete("chain");
            else params.set("chain", chain.query);
            router.replace(`${pathname}?${params.toString()}`, {
                scroll: false,
            });
        },
        [pathname, router, searchParams],
    );

    const handleClearFilters = useCallback(() => {
        setSearch("");
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
            <TextInput
                className={classNames(styles.searchFilter, styles.filterInput)}
                icon={SearchIcon}
                iconPlacement="right"
                placeholder={t("filters.search.label")}
                value={search}
                onChange={handleSearchChange}
            />
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
