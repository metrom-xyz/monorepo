import classNames from "classnames";
import {
    Button,
    Typography,
    type SelectOption,
    MultiSelect,
    Chip,
    MobileDrawer,
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
import { FilterIcon } from "@/src/assets/filter-icon";
import { useClickAway } from "react-use";
import { FilterActiveIcon } from "@/src/assets/filter-active-icon";

import styles from "./styles.module.css";

const statusSelectRenderOption = (
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

const chainSelectRenderOption = (option: { label: string; value: string }) => {
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

export interface Filters {
    protocols: SelectOption<string>[];
    statuses: SelectOption<Status>[];
    chainIds: string[];
    chainTypes?: ChainType[];
}

interface FilterProps {
    sortField?: CampaignSortOptions;
    order?: number;
    onClearFilters: () => void;
    onFiltersChange: (filters: Partial<Filters>) => void;
}

interface ChainOption {
    label: string;
    value: string;
    query: string;
}

export function Filters({
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
    const mobileDrawerRef = useRef<HTMLInputElement>(null);

    const [chains, setChains] = useState<ChainOption[]>([]);
    const [protocols, setProtocols] = useState<SelectOption<string>[]>([]);
    const [statuses, setStatuses] = useState<SelectOption<Status>[]>([]);
    const [drawer, setDrawer] = useState(false);

    const filtersActive = useMemo(
        () =>
            protocols.length > 0 ||
            statuses.length > 0 ||
            chains.length > 0 ||
            !!sortField ||
            !!order,
        [protocols, statuses, sortField, order, chains],
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

    const chainOptions: ChainOption[] = useMemo(() => {
        const options: ChainOption[] = [];

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
            const chainTypes: ChainType[] = [];
            const chainIds: string[] = [];
            resolvedChains.forEach((resolvedChain) => {
                const [chainType, chainId] = resolvedChain.value.split("_");
                if (!chainTypes.includes(chainType as ChainType))
                    chainTypes.push(chainType as ChainType);
                if (!chainIds.includes(chainId)) chainIds.push(chainId);
            });

            setChains(resolvedChains);
            onFiltersChange({
                chainIds,
                chainTypes: chainTypes as ChainType[],
            });

            params.set(
                "chains",
                resolvedChains
                    .map((resolvedChain) => resolvedChain.query)
                    .join(","),
            );
        } else {
            setChains([]);
            onFiltersChange({ chainIds: [], chainTypes: [] });
            params.delete("chains");
        }
    }, [chainOptions, searchParams, onFiltersChange]);

    useClickAway(mobileDrawerRef, () => {
        setDrawer(false);
    });

    const handleStatusChange = useCallback(
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

            const chainTypes: ChainType[] = [];
            const chainIds: string[] = [];
            chains.forEach((chain) => {
                const [chainType, chainId] = chain.value.split("_");
                if (!chainTypes.includes(chainType as ChainType))
                    chainTypes.push(chainType as ChainType);
                if (!chainIds.includes(chainId)) chainIds.push(chainId);
            });

            setChains(chains);
            onFiltersChange({
                chainIds,
                chainTypes: chainTypes as ChainType[],
            });
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

    function handleDrawerOnToggle() {
        setDrawer((prev) => !prev);
    }

    const getStatusChipCloseHandler = useCallback(
        (status: SelectOption<Status>) => {
            return () => {
                const newStatuses = statuses.filter(
                    ({ value }) => value !== status.value,
                );
                handleStatusChange(newStatuses);
            };
        },
        [statuses, handleStatusChange],
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

    const getStatusMobileChipClickHandler = useCallback(
        (status: SelectOption<Status>) => {
            return () => {
                const existing = statuses.find(
                    ({ value }) => value === status.value,
                );

                let newStatuses: SelectOption<Status>[] = [];
                if (existing)
                    newStatuses = statuses.filter(
                        ({ value }) => value !== status.value,
                    );
                else newStatuses = statuses.concat(status);

                handleStatusChange(newStatuses);
            };
        },
        [statuses, handleStatusChange],
    );

    return (
        <div className={styles.root}>
            <div className={styles.inputs}>
                <MultiSelect
                    hideLabel
                    options={statusOptions}
                    values={statuses}
                    onChange={handleStatusChange}
                    label={t("filters.status.label")}
                    placeholder={t("filters.status.label")}
                    renderOption={statusSelectRenderOption}
                    messages={{
                        noResults: "",
                    }}
                    className={styles.filterInput}
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
                    className={styles.filterInput}
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
                        className={styles.filterInput}
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
            <div ref={mobileDrawerRef} className={styles.inputsMobile}>
                <Button
                    variant="secondary"
                    border={false}
                    icon={filtersActive ? FilterActiveIcon : FilterIcon}
                    iconPlacement="left"
                    onClick={handleDrawerOnToggle}
                >
                    {t("filters.filters")}
                </Button>
                <MobileDrawer open={drawer} onClose={handleDrawerOnToggle}>
                    <div className={styles.mobileDrawerContent}>
                        <Typography weight="semibold">
                            {t("filters.filterBy")}
                        </Typography>
                        <div className={styles.statusFilterMobile}>
                            <Typography
                                uppercase
                                size="xs"
                                weight="medium"
                                variant="tertiary"
                            >
                                {t("filters.status.label")}
                            </Typography>
                            <div className={styles.statusChipsFilterMobile}>
                                {statusOptions.map((option) => {
                                    const active = !!statuses.find(
                                        (status) =>
                                            status.value === option.value,
                                    );

                                    return (
                                        <Chip
                                            key={option.value}
                                            active={active}
                                            onClick={getStatusMobileChipClickHandler(
                                                option,
                                            )}
                                        >
                                            {statusSelectRenderOption(
                                                option,
                                                active,
                                            )}
                                        </Chip>
                                    );
                                })}
                            </div>
                        </div>
                        <MultiSelect
                            portalContainer={mobileDrawerRef.current}
                            search
                            options={protocolOptions}
                            values={protocols}
                            onChange={handleProtocolsChange}
                            label={t("filters.protocol.label")}
                            placeholder={t("filters.protocol.label")}
                            renderOption={protocolSelectRenderOption}
                            messages={{
                                noResults: "",
                            }}
                            className={styles.filterInput}
                        />
                        <div className={styles.dividier} />
                        <MultiSelect
                            portalContainer={mobileDrawerRef.current}
                            search
                            options={chainOptions}
                            values={chains}
                            onChange={handleChainsChange}
                            label={t("filters.chain.label")}
                            placeholder={t("filters.chain.label")}
                            renderOption={chainSelectRenderOption}
                            messages={{
                                noResults: "",
                            }}
                            className={styles.filterInput}
                        />
                    </div>
                </MobileDrawer>
            </div>
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
