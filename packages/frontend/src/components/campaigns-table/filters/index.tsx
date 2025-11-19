import classNames from "classnames";
import {
    Button,
    Typography,
    type SelectOption,
    MultiSelect,
    Chip,
    Skeleton,
} from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import type { CampaignSortOptions } from "@/src/utils/filtering";
import { getCrossVmChainData } from "@/src/utils/chain";
import { ChainType, Status } from "@metrom-xyz/sdk";
import { CampaignStatusDot } from "../../campaign-status-dot";
import { TrashIcon } from "@/src/assets/trash-icon";
import { MobileFilters } from "./mobile-filters";
import type { ChainFilterOption } from "@/src/hooks/useCampaignsFiltersOptions";
import { ProtocolLogo } from "../../protocol-logo";
import type { Protocol } from "@metrom-xyz/chains";

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
    protocol?: Protocol;
    value: string;
}) => {
    return (
        <div className={styles.customOptionContainer}>
            {option.protocol && (
                <ProtocolLogo
                    size="sm"
                    protocol={option.protocol}
                    className={styles.icon}
                />
            )}
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
    totalCampaigns?: number;
    loading?: boolean;
    statusOptions?: SelectOption<Status>[];
    protocolOptions?: SelectOption<string>[];
    chainOptions?: ChainFilterOption[];
    onClearFilters: () => void;
    onFiltersChange: (filters: Partial<RawFilters>) => void;
}

export function Filters({
    filters,
    sortField,
    order,
    totalCampaigns,
    loading,
    statusOptions,
    protocolOptions,
    chainOptions,
    onClearFilters,
    onFiltersChange,
}: FilterProps) {
    const t = useTranslations("allCampaigns");

    const filtersActive = useMemo(
        () =>
            filters.protocols.length > 0 ||
            filters.statuses.length > 0 ||
            filters.chains.length > 0 ||
            !!sortField ||
            !!order,
        [filters, sortField, order],
    );

    const handleStatusesChange = useCallback(
        (statuses: SelectOption<Status>[]) => {
            onFiltersChange({ statuses });
        },
        [onFiltersChange],
    );

    const handleProtocolsChange = useCallback(
        (protocols: SelectOption<string>[]) => {
            onFiltersChange({ protocols });
        },
        [onFiltersChange],
    );

    const handleChainsChange = useCallback(
        (chains: (SelectOption<string> & { query: string })[]) => {
            onFiltersChange({ chains });
        },
        [onFiltersChange],
    );

    const handleClearFilters = useCallback(() => {
        if (onClearFilters) onClearFilters();
    }, [onClearFilters]);

    const getStatusChipCloseHandler = useCallback(
        (status: SelectOption<Status>) => {
            return () => {
                const newStatuses = filters.statuses.filter(
                    ({ value }) => value !== status.value,
                );
                handleStatusesChange(newStatuses);
            };
        },
        [filters.statuses, handleStatusesChange],
    );

    const getProtocolChipCloseHandler = useCallback(
        (protocol: SelectOption<string>) => {
            return () => {
                const newProtocols = filters.protocols.filter(
                    ({ value }) => value !== protocol.value,
                );
                handleProtocolsChange(newProtocols);
            };
        },
        [filters.protocols, handleProtocolsChange],
    );

    const getChainChipCloseHandler = useCallback(
        (chain: SelectOption<string> & { query: string }) => {
            return () => {
                const newChains = filters.chains.filter(
                    ({ value }) => value !== chain.value,
                );
                handleChainsChange(newChains);
            };
        },
        [filters.chains, handleChainsChange],
    );

    return (
        <div className={styles.root}>
            <div className={styles.inputs}>
                {statusOptions && (
                    <MultiSelect
                        hideLabel
                        options={statusOptions}
                        values={filters.statuses}
                        onChange={handleStatusesChange}
                        label={t("filters.status.label")}
                        placeholder={t("filters.status.label")}
                        renderOption={statusSelectRenderOption}
                        messages={{
                            noResults: "",
                        }}
                        className={classNames(
                            styles.filterInput,
                            styles.desktop,
                        )}
                    />
                )}
                {protocolOptions && (
                    <MultiSelect
                        search
                        hideLabel
                        options={protocolOptions}
                        values={filters.protocols}
                        onChange={handleProtocolsChange}
                        label={t("filters.protocol.label")}
                        placeholder={t("filters.protocol.label")}
                        renderOption={protocolSelectRenderOption}
                        messages={{
                            noResults: "",
                        }}
                        className={classNames(
                            styles.filterInput,
                            styles.desktop,
                        )}
                    />
                )}
                <div className={styles.lastFilterWrapper}>
                    {chainOptions && (
                        <MultiSelect
                            search
                            hideLabel
                            options={chainOptions}
                            values={filters.chains}
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
                    )}
                    <div className={styles.clearWrapper}>
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
                        <div className={styles.totalCampaigns}>
                            {loading ? (
                                <Skeleton width={120} size="xs" />
                            ) : (
                                <Typography size="xs" variant="tertiary">
                                    {t("filters.campaignsFound", {
                                        count: totalCampaigns || 0,
                                    })}
                                </Typography>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <MobileFilters
                filters={filters}
                active={filtersActive}
                statusOptions={statusOptions}
                protocolOptions={protocolOptions}
                chainOptions={chainOptions}
                totalCampaigns={totalCampaigns}
                loading={loading}
                onFiltersChange={onFiltersChange}
                onFiltersClear={handleClearFilters}
            />
            <div className={styles.chips}>
                {filters.statuses.map((status) => (
                    <Chip
                        key={status.value}
                        onClose={getStatusChipCloseHandler(status)}
                        className={styles.chip}
                    >
                        {statusSelectRenderOption(status)}
                    </Chip>
                ))}
                {filters.protocols.map((protocol) => (
                    <Chip
                        key={protocol.value}
                        onClose={getProtocolChipCloseHandler(protocol)}
                        className={styles.chip}
                    >
                        {protocolSelectRenderOption(protocol)}
                    </Chip>
                ))}
                {filters.chains.map((chain) => (
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
