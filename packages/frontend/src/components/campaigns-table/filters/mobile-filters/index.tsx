import {
    Button,
    Chip,
    MobileDrawer,
    MultiSelect,
    Typography,
    type SelectOption,
} from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import {
    chainSelectRenderOption,
    protocolSelectRenderOption,
    statusSelectRenderOption,
    type ChainFilterOption,
    type RawFilters,
} from "..";
import { FilterActiveIcon } from "@/src/assets/filter-active-icon";
import { FilterIcon } from "@/src/assets/filter-icon";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Status } from "@metrom-xyz/sdk";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { useClickAway } from "react-use";
import { TrashIcon } from "@/src/assets/trash-icon";
import classNames from "classnames";

import styles from "./styles.module.css";
import commonStyles from "../styles.module.css";

interface MobileFiltersProps {
    filters: RawFilters;
    active?: boolean;
    statusOptions: SelectOption<Status>[];
    protocolOptions: SelectOption<string>[];
    chainOptions: ChainFilterOption[];
    onFiltersChange: (filters: Partial<RawFilters>) => void;
    onFiltersClear: () => void;
}

export function MobileFilters({
    filters,
    active,
    statusOptions,
    protocolOptions,
    chainOptions,
    onFiltersChange,
    onFiltersClear,
}: MobileFiltersProps) {
    const t = useTranslations("allCampaigns.filters");

    const [chains, setChains] = useState<ChainFilterOption[]>(filters.chains);
    const [protocols, setProtocols] = useState<SelectOption<string>[]>(
        filters.protocols,
    );
    const [statuses, setStatuses] = useState<SelectOption<Status>[]>(
        filters.statuses,
    );
    const [drawer, setDrawer] = useState(false);
    const [selectOpen, setSelectOpen] = useState(false);

    const drawerRef = useRef<HTMLInputElement>(null);

    useClickAway(drawerRef, () => {
        setDrawer(false);
    });

    function handleDrawerOnToggle() {
        setDrawer((prev) => !prev);
    }

    useEffect(() => {
        setChains(filters.chains);
        setProtocols(filters.protocols);
        setStatuses(filters.statuses);
    }, [drawer, filters.chains, filters.protocols, filters.statuses]);

    const handleFiltersOnClear = useCallback(() => {
        setDrawer(false);
        onFiltersClear();
    }, [onFiltersClear]);

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

                setStatuses(newStatuses);
            };
        },
        [statuses],
    );

    const handleFiltersOnApply = useCallback(() => {
        setDrawer(false);
        onFiltersChange({
            protocols,
            statuses,
            chains,
        });
    }, [protocols, statuses, chains, onFiltersChange]);

    return (
        <div ref={drawerRef} className={styles.root}>
            <Button
                variant="secondary"
                border={false}
                icon={active ? FilterActiveIcon : FilterIcon}
                iconPlacement="left"
                onClick={handleDrawerOnToggle}
            >
                {t("filters")}
            </Button>
            <MobileDrawer
                open={drawer}
                onClose={handleDrawerOnToggle}
                className={selectOpen ? styles.resizeDrawer : undefined}
            >
                <div className={styles.drawerContent}>
                    <div className={styles.header}>
                        <Typography weight="semibold">
                            {t("filterBy")}
                        </Typography>
                        <Button
                            size="xs"
                            variant="secondary"
                            border={false}
                            icon={TrashIcon}
                            iconPlacement="left"
                            onClick={handleFiltersOnClear}
                            className={{
                                root: classNames(commonStyles.clearButton, {
                                    [commonStyles.visible]: active,
                                }),
                            }}
                        >
                            {t("clear")}
                        </Button>
                    </div>
                    <div className={styles.statusesFilter}>
                        <Typography
                            uppercase
                            size="xs"
                            weight="medium"
                            variant="tertiary"
                        >
                            {t("status.label")}
                        </Typography>
                        <div className={styles.statusChipsFilter}>
                            {statusOptions.map((option) => {
                                const active = !!statuses.find(
                                    (status) => status.value === option.value,
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
                        portalContainer={drawerRef.current}
                        search
                        options={protocolOptions}
                        values={protocols}
                        onChange={setProtocols}
                        onOpenChange={setSelectOpen}
                        label={t("protocol.label")}
                        placeholder={t("protocol.label")}
                        renderOption={protocolSelectRenderOption}
                        messages={{
                            noResults: "",
                        }}
                        className={commonStyles.filterInput}
                    />
                    <div className={styles.dividier} />
                    <MultiSelect
                        portalContainer={drawerRef.current}
                        search
                        options={chainOptions}
                        values={chains}
                        onChange={setChains}
                        onOpenChange={setSelectOpen}
                        label={t("chain.label")}
                        placeholder={t("chain.label")}
                        renderOption={chainSelectRenderOption}
                        messages={{
                            noResults: "",
                        }}
                        className={classNames(
                            commonStyles.filterInput,
                            styles.chainsFilter,
                        )}
                    />
                    <Button
                        size="sm"
                        icon={ArrowRightIcon}
                        iconPlacement="right"
                        onClick={handleFiltersOnApply}
                        className={{ root: styles.saveFiltersButton }}
                    >
                        {t("saveFilters")}
                    </Button>
                </div>
            </MobileDrawer>
        </div>
    );
}
