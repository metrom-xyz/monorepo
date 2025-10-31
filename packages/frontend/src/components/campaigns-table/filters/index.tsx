import classNames from "classnames";
import {
    Button,
    Typography,
    type SelectOption,
    MultiSelect,
    Chip,
} from "@metrom-xyz/ui";
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
import type { CampaignSortOptions } from "@/src/utils/filtering";
import { ProtocolLogo } from "../../protocol-logo";
import { useSupportedProtocols } from "@/src/hooks/useSupportedProtocols";
import { useChainsWithTypes } from "@/src/hooks/useChainsWithTypes";
import { getCrossVmChainData } from "@/src/utils/chain";
import { ChainType, Status } from "@metrom-xyz/sdk";
import { APTOS } from "@/src/commons/env";
import { CampaignStatusDot } from "../../campaign-status-dot";
import { TrashIcon } from "@/src/assets/trash-icon";
import { MobileFilters } from "./mobile-filters";

import styles from "./styles.module.css";

export const statusSelectRenderOption = (
    option: { label: string; value: Status },
    active?: boolean,
) => {
    return (
        <div className={styles.customOptionContainer}>
            <CampaignStatusDot
                status={option.value}
                className={
                    active && option.value === Status.Active
                        ? styles.statusDotLiveActive
                        : undefined
                }
            />
            <Typography
                weight="medium"
                className={classNames(styles.statusLabel, {
                    [styles.active]: active,
                })}
            >
                {option.label}
            </Typography>
        </div>
    );
};

export const protocolSelectRenderOption = (option: {
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

export const chainSelectRenderOption = (option: {
    label: string;
    value: string;
}) => {
    const [chainType, chainId] = option.value.split("_");

    const ChainIcon = getCrossVmChainData(
        Number(chainId),
        chainType as ChainType,
    )?.icon;

    return (
        <div className={styles.customOptionContainer}>
            {ChainIcon && <ChainIcon className={styles.icon} />}
            <Typography className={styles.selectOptionText} weight="medium">
                {option.label}
            </Typography>
        </div>
    );
};

export interface RawFilters {
    protocols: SelectOption<string>[];
    statuses: SelectOption<Status>[];
    chains: ChainFilterOption[];
}

export interface FilterParams {
    protocols: string[];
    statuses: Status[];
    chainIds: number[];
    chainTypes?: ChainType[];
}

interface FilterProps {
    filters: RawFilters;
    sortField?: CampaignSortOptions;
    order?: number;
    onClearFilters: () => void;
    onFiltersChange: (filters: Partial<RawFilters>) => void;
}

export interface ChainFilterOption {
    label: string;
    value: string;
    query: string;
}

export function Filters({
    filters,
    sortField,
    order,
    onClearFilters,
    onFiltersChange,
}: FilterProps) {
    const t = useTranslations("allCampaigns");

    const supportedChains = useChainsWithTypes({
        chainType: APTOS ? ChainType.Aptos : undefined,
    });
    const supportedProtocols = useSupportedProtocols({ crossVm: !APTOS });
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const chainInitializedRef = useRef(false);

    const [chains, setChains] = useState<ChainFilterOption[]>(filters.chains);
    const [protocols, setProtocols] = useState<SelectOption<string>[]>(
        filters.protocols,
    );
    const [statuses, setStatuses] = useState<SelectOption<Status>[]>(
        filters.statuses,
    );

    useEffect(() => {
        setChains(filters.chains);
        setProtocols(filters.protocols);
        setStatuses(filters.statuses);
    }, [filters.chains, filters.protocols, filters.statuses]);

    const filtersActive = useMemo(
        () =>
            filters.protocols.length > 0 ||
            filters.statuses.length > 0 ||
            filters.chains.length > 0 ||
            !!sortField ||
            !!order,
        [filters, sortField, order],
    );

    const statusOptions: SelectOption<Status>[] = [
        {
            label: t("filters.status.live"),
            value: Status.Active,
        },
        {
            label: t("filters.status.upcoming"),
            value: Status.Upcoming,
        },
        {
            label: t("filters.status.ended"),
            value: Status.Expired,
        },
    ];

    const protocolOptions: SelectOption<string>[] = useMemo(() => {
        return supportedProtocols.map((protocol) => ({
            label: protocol.name,
            icon: (
                <ProtocolLogo
                    size="sm"
                    protocol={protocol}
                    className={styles.icon}
                />
            ),
            value: protocol.slug,
        }));
    }, [supportedProtocols]);

    const chainOptions: ChainFilterOption[] = useMemo(() => {
        const options: ChainFilterOption[] = [];

        for (const chain of supportedChains) {
            const chainData = getCrossVmChainData(chain.id, chain.type);
            if (!chainData) continue;

            options.push({
                label: chainData.name,
                value: `${chain.type}_${chain.id}`,
                query: chainData.name.toLowerCase().replaceAll(" ", "_"),
            });
        }
        return options;
    }, [supportedChains]);

    useEffect(() => {
        // Skip updating the search params once initialized to avoid
        // unnecessary re-renders
        if (chainInitializedRef.current) return;
        chainInitializedRef.current = true;

        const chains = searchParams.get("chains");
        if (!chains) return;

        const resolvedChains = chainOptions.filter((option) =>
            chains.split(",").includes(option.query),
        );

        const params = new URLSearchParams(searchParams.toString());
        if (resolvedChains.length > 0) {
            setChains(resolvedChains);
            onFiltersChange({ chains: resolvedChains });

            params.set(
                "chains",
                resolvedChains
                    .map((resolvedChain) => resolvedChain.query)
                    .join(","),
            );
        } else {
            setChains([]);
            onFiltersChange({ chains: [] });
            params.delete("chains");
        }
    }, [chainOptions, searchParams, onFiltersChange]);

    const handleStatusesChange = useCallback(
        (statuses: SelectOption<Status>[]) => {
            setStatuses(statuses);
            onFiltersChange({ statuses });
        },
        [onFiltersChange],
    );

    const handleProtocolsChange = useCallback(
        (protocols: SelectOption<string>[]) => {
            setProtocols(protocols);
            onFiltersChange({ protocols });
        },
        [onFiltersChange],
    );

    const handleChainsChange = useCallback(
        (chains: (SelectOption<string> & { query: string })[]) => {
            const params = new URLSearchParams(searchParams.toString());

            if (chains.length === 0) params.delete("chains");
            else
                params.set(
                    "chains",
                    chains.map((chain) => chain.query).join(","),
                );

            router.replace(`${pathname}?${params.toString()}`, {
                scroll: false,
            });

            setChains(chains);
            onFiltersChange({ chains });
        },
        [pathname, router, searchParams, onFiltersChange],
    );

    const handleClearFilters = useCallback(() => {
        setProtocols([]);
        setStatuses([]);
        setChains([]);

        const params = new URLSearchParams(searchParams.toString());
        params.delete("chains");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });

        if (onClearFilters) onClearFilters();
    }, [pathname, searchParams, router, onClearFilters]);

    const getStatusChipCloseHandler = useCallback(
        (status: SelectOption<Status>) => {
            return () => {
                const newStatuses = statuses.filter(
                    ({ value }) => value !== status.value,
                );
                handleStatusesChange(newStatuses);
            };
        },
        [statuses, handleStatusesChange],
    );

    const getProtocolChipCloseHandler = useCallback(
        (protocol: SelectOption<string>) => {
            return () => {
                const newProtocols = protocols.filter(
                    ({ value }) => value !== protocol.value,
                );
                handleProtocolsChange(newProtocols);
            };
        },
        [protocols, handleProtocolsChange],
    );

    const getChainChipCloseHandler = useCallback(
        (chain: SelectOption<string> & { query: string }) => {
            return () => {
                const newChains = chains.filter(
                    ({ value }) => value !== chain.value,
                );
                handleChainsChange(newChains);
            };
        },
        [chains, handleChainsChange],
    );

    return (
        <div className={styles.root}>
            <div className={styles.inputs}>
                <MultiSelect
                    hideLabel
                    options={statusOptions}
                    values={statuses}
                    onChange={handleStatusesChange}
                    label={t("filters.status.label")}
                    placeholder={t("filters.status.label")}
                    renderOption={statusSelectRenderOption}
                    messages={{
                        noResults: "",
                    }}
                    className={classNames(styles.filterInput, styles.desktop)}
                />
                <MultiSelect
                    search
                    hideLabel
                    options={protocolOptions}
                    values={protocols}
                    onChange={handleProtocolsChange}
                    label={t("filters.protocol.label")}
                    placeholder={t("filters.protocol.label")}
                    renderOption={protocolSelectRenderOption}
                    messages={{
                        noResults: "",
                    }}
                    className={classNames(styles.filterInput, styles.desktop)}
                />
                <div className={styles.lastFilterWrapper}>
                    <MultiSelect
                        search
                        hideLabel
                        options={chainOptions}
                        values={chains}
                        onChange={handleChainsChange}
                        label={t("filters.chain.label")}
                        placeholder={t("filters.chain.label")}
                        renderOption={chainSelectRenderOption}
                        messages={{
                            noResults: "",
                        }}
                        className={classNames(
                            styles.filterInput,
                            styles.desktop,
                        )}
                    />
                    <Button
                        variant="secondary"
                        border={false}
                        icon={TrashIcon}
                        iconPlacement="left"
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
            <MobileFilters
                filters={filters}
                active={filtersActive}
                statusOptions={statusOptions}
                protocolOptions={protocolOptions}
                chainOptions={chainOptions}
                onFiltersChange={onFiltersChange}
                onFiltersClear={handleClearFilters}
            />
            <div className={styles.chips}>
                {statuses.map((status) => (
                    <Chip
                        key={status.value}
                        onClose={getStatusChipCloseHandler(status)}
                        className={styles.chip}
                    >
                        {statusSelectRenderOption(status)}
                    </Chip>
                ))}
                {protocols.map((protocol) => (
                    <Chip
                        key={protocol.value}
                        onClose={getProtocolChipCloseHandler(protocol)}
                        className={styles.chip}
                    >
                        {protocolSelectRenderOption(protocol)}
                    </Chip>
                ))}
                {chains.map((chain) => (
                    <Chip
                        key={chain.value}
                        onClose={getChainChipCloseHandler(chain)}
                        className={styles.chip}
                    >
                        {chainSelectRenderOption(chain)}
                    </Chip>
                ))}
            </div>
        </div>
    );
}
