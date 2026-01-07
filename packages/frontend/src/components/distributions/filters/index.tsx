import {
    Button,
    Chip,
    DateTimePicker,
    ErrorText,
    Popover,
    TextInput,
} from "@metrom-xyz/ui";
import { formatDateTime } from "@/src/utils/format";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import type { Dayjs, ManipulateType } from "dayjs";
import dayjs from "dayjs";
import { useClickAway } from "react-use";
import { useDistributions } from "@/src/hooks/useDistributions";
import type { ProcessedDistribution } from "@/src/types/distributions";
import type { Hex } from "viem";
import type { SupportedChain } from "@metrom-xyz/contracts";
import type { ChainType } from "@metrom-xyz/sdk";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { CalendarIcon } from "@/src/assets/calendar-icon";
import { getClosestAvailableTime } from "@/src/utils/date";
import type { TranslationsKeys } from "@/src/types/utils";

import styles from "./styles.module.css";

interface FiltersProps {
    chain: SupportedChain;
    chainType: ChainType;
    campaignId: Hex;
    onFetched: (distributions: ProcessedDistribution[]) => void;
    onLoading: (loading: boolean) => void;
}

interface DurationPreset {
    label: TranslationsKeys<"campaignDistributions.filters">;
    unit: ManipulateType;
    value: number;
}

const DURATION_PRESETS: DurationPreset[] = [
    {
        label: "past24h",
        unit: "hours",
        value: 24,
    },
    {
        label: "past48h",
        unit: "hours",
        value: 48,
    },
    {
        label: "lastWeekDistributions",
        unit: "days",
        value: 7,
    },
];

export function Filters({
    campaignId,
    chain,
    chainType,
    onFetched,
    onLoading,
}: FiltersProps) {
    const t = useTranslations("campaignDistributions.filters");

    const [from, setFrom] = useState<Dayjs | undefined>();
    const [to, setTo] = useState<Dayjs | undefined>();
    const [activePreset, setActivePreset] = useState<string | undefined>();
    const [error, setError] = useState("");
    const [fromPopover, setFromPopover] = useState(false);
    const [toPopover, setToPopover] = useState(false);
    const [fromAnchor, setFromAnchor] = useState<HTMLDivElement | null>(null);
    const [toAnchor, setToAnchor] = useState<HTMLDivElement | null>(null);

    const fromRef = useRef<HTMLDivElement>(null);
    const toRef = useRef<HTMLDivElement>(null);

    const { distributions, loading, progress, fetchDistributions } =
        useDistributions({
            chainId: chain,
            chainType,
            campaignId,
            from: from?.unix(),
            to: to?.unix(),
        });

    useClickAway(fromRef, getPopoverHandler("from", false));
    useClickAway(toRef, getPopoverHandler("to", false));

    useEffect(() => {
        if (!loading) onFetched(distributions);

        onLoading(loading);
    }, [loading, distributions, onLoading, onFetched]);

    useEffect(() => {
        if (!from || !to) return;

        let error = "";
        if (to.isBefore(from)) error = t("errors.inconsistentRange");
        if (to.diff(from, "days") > 7) error = t("errors.rangeTooWide");

        setError(error);
    }, [from, to, t]);

    function getPopoverHandler(type: "from" | "to", open: boolean) {
        return () => {
            if (type === "from") setFromPopover(open);
            else setToPopover(open);
        };
    }

    function getDurationPresetHandler({ label, unit, value }: DurationPreset) {
        return () => {
            const now = dayjs();

            setFrom(getClosestAvailableTime(now.subtract(value, unit)));
            setTo(getClosestAvailableTime(now));
            setActivePreset(label);
        };
    }

    function clearDurationPreset() {
        setActivePreset(undefined);
        setFrom(undefined);
        setTo(undefined);
    }

    return (
        <div className={styles.root}>
            <div className={styles.inputs}>
                <TextInput
                    size="lg"
                    label={t("from")}
                    ref={setFromAnchor}
                    value={formatDateTime(from)}
                    onClick={getPopoverHandler("from", true)}
                    error={!!error}
                    readOnly
                    icon={CalendarIcon}
                    className={styles.input}
                />
                <TextInput
                    size="lg"
                    label={t("to")}
                    disabled={!from}
                    ref={setToAnchor}
                    value={formatDateTime(to)}
                    onClick={getPopoverHandler("to", true)}
                    error={!!error}
                    readOnly
                    icon={CalendarIcon}
                    className={styles.input}
                />
                <Popover
                    ref={fromRef}
                    anchor={fromAnchor}
                    open={fromPopover}
                    onOpenChange={setFromPopover}
                    placement="bottom-start"
                    variant="secondary"
                    margin={4}
                    className={styles.popover}
                >
                    <DateTimePicker
                        value={from}
                        range={{ from, to }}
                        min={to && dayjs(to).subtract(7, "days")}
                        onChange={setFrom}
                    />
                </Popover>
                <Popover
                    ref={toRef}
                    anchor={toAnchor}
                    open={toPopover}
                    onOpenChange={setToPopover}
                    placement="bottom-start"
                    variant="secondary"
                    margin={4}
                    className={styles.popover}
                >
                    <DateTimePicker
                        value={to}
                        range={{ from, to }}
                        max={from && dayjs(from).add(7, "days")}
                        onChange={setTo}
                    />
                </Popover>
                <Button
                    size="sm"
                    icon={ArrowRightIcon}
                    iconPlacement="right"
                    disabled={!from || !to || !!error}
                    loading={loading}
                    onClick={fetchDistributions}
                    className={{ root: styles.searchButton }}
                >
                    {loading
                        ? t("loading", {
                              completed: progress.completed,
                              total: progress.total || "...",
                          })
                        : t("search")}
                </Button>
                <ErrorText level="error" size="xs" weight="medium">
                    {error}
                </ErrorText>
            </div>
            <div className={styles.chips}>
                {DURATION_PRESETS.map((preset) => (
                    <Chip
                        key={preset.label}
                        variant="secondary"
                        onClick={getDurationPresetHandler(preset)}
                        onClose={
                            preset.label === activePreset
                                ? clearDurationPreset
                                : undefined
                        }
                        active={preset.label === activePreset}
                    >
                        {t(preset.label)}
                    </Chip>
                ))}
            </div>
        </div>
    );
}
