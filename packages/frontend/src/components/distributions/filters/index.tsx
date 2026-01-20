import {
    Button,
    Chip,
    DateTimePicker,
    ErrorText,
    Popover,
    TextInput,
    Typography,
} from "@metrom-xyz/ui";
import { formatDateTime } from "@/src/utils/format";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import type { Dayjs, ManipulateType } from "dayjs";
import dayjs from "dayjs";
import { useClickAway } from "react-use";
import { useDistributions } from "@/src/hooks/useDistributions";
import type { ProcessedDistribution } from "@/src/types/distributions";
import { Campaign, Status } from "@metrom-xyz/sdk";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { CalendarIcon } from "@/src/assets/calendar-icon";
import { getClosestAvailableTime } from "@/src/utils/date";
import type { TranslationsKeys } from "@/src/types/utils";
import { TrashIcon } from "@/src/assets/trash-icon";
import { BoldText } from "../../bold-text";
import classNames from "classnames";

import styles from "./styles.module.css";

interface FiltersProps {
    campaign?: Campaign;
    loading?: boolean;
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
    campaign,
    loading,
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

    const {
        distributions,
        loading: loadingDistributions,
        progress,
        fetchDistributions,
    } = useDistributions({
        chainId: campaign?.chainId,
        chainType: campaign?.chainType,
        campaignId: campaign?.id,
        from: from?.unix(),
        to: to?.unix(),
    });

    useClickAway(fromRef, getPopoverHandler("from", false));
    useClickAway(toRef, getPopoverHandler("to", false));

    useEffect(() => {
        if (!loadingDistributions) onFetched(distributions);

        onLoading(loadingDistributions);
    }, [loadingDistributions, distributions, onLoading, onFetched]);

    useEffect(() => {
        if (!from || !to) return;

        let error = "";
        if (to.isBefore(from)) error = t("errors.inconsistentRange");
        if (to.diff(from, "days") > 7) error = t("errors.rangeTooWide");

        setError(error);
    }, [from, to, t]);

    useEffect(() => {
        if (loading || !campaign || campaign.status === Status.Upcoming) return;

        if (campaign.status === Status.Active) {
            const now = dayjs();
            setFrom(getClosestAvailableTime(now.subtract(24, "hours")));
            setTo(getClosestAvailableTime(now));
        } else {
            const endDate = dayjs.unix(campaign.to);

            setFrom(getClosestAvailableTime(endDate.subtract(48, "hours")));
            setTo(getClosestAvailableTime(endDate));
        }
    }, [loading, campaign]);

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
        setError("");
        setActivePreset(undefined);
        setFrom(undefined);
        setTo(undefined);
    }

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <Typography weight="medium" uppercase>
                    {t("header.title")}
                </Typography>
                <Typography variant="tertiary">
                    {t("header.subtitle")}
                </Typography>
            </div>
            <div className={styles.inputsWrapper}>
                <div className={styles.inputs}>
                    <div className={styles.textInputs}>
                        <TextInput
                            size="lg"
                            label={t("from")}
                            placeholder={t("selectDateAndTime")}
                            loading={loading}
                            ref={setFromAnchor}
                            value={from ? formatDateTime(from) : ""}
                            onClick={getPopoverHandler("from", true)}
                            error={!!error}
                            readOnly
                            icon={CalendarIcon}
                            className={styles.input}
                        />
                        <TextInput
                            size="lg"
                            label={t("to")}
                            placeholder={t("selectDateAndTime")}
                            disabled={!from}
                            loading={loading}
                            ref={setToAnchor}
                            value={to ? formatDateTime(to) : ""}
                            onClick={getPopoverHandler("to", true)}
                            error={!!error}
                            readOnly
                            icon={CalendarIcon}
                            className={styles.input}
                        />
                    </div>
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
                        <div className={styles.toPopoverContent}>
                            <DateTimePicker
                                value={to}
                                range={{ from, to }}
                                max={from && dayjs(from).add(7, "days")}
                                onChange={setTo}
                            />
                            <Typography
                                size="xs"
                                weight="medium"
                                variant="tertiary"
                                uppercase
                            >
                                {t.rich("rangeLimit", {
                                    bold: (chunks) => (
                                        <BoldText>{chunks}</BoldText>
                                    ),
                                })}
                            </Typography>
                        </div>
                    </Popover>
                    <ErrorText
                        level="error"
                        size="xs"
                        weight="medium"
                        uppercase={false}
                        mountAnimation
                        className={styles.errorTextMobile}
                    >
                        {error}
                    </ErrorText>
                    <div className={classNames(styles.chips, styles.mobile)}>
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
                    <div className={styles.buttons}>
                        <Button
                            size="sm"
                            icon={ArrowRightIcon}
                            iconPlacement="right"
                            disabled={!from || !to || !!error}
                            loading={loadingDistributions}
                            onClick={fetchDistributions}
                            className={{ root: styles.button }}
                        >
                            {loadingDistributions
                                ? t("loading", {
                                      completed: progress.completed,
                                      total: progress.total || "...",
                                  })
                                : t("search")}
                        </Button>
                        {from && to && (
                            <Button
                                size="sm"
                                variant="secondary"
                                border={false}
                                icon={TrashIcon}
                                disabled={!from || !to || loadingDistributions}
                                onClick={clearDurationPreset}
                                className={{ root: styles.button }}
                            >
                                {t("clear")}
                            </Button>
                        )}
                    </div>
                </div>
                <ErrorText
                    level="error"
                    size="xs"
                    weight="medium"
                    uppercase={false}
                    mountAnimation
                    className={styles.errorTextDesktop}
                >
                    {error}
                </ErrorText>
            </div>
            <div className={classNames(styles.chips, styles.desktop)}>
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
