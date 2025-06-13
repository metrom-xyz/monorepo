import {
    Button,
    Card,
    DateTimePicker,
    ErrorText,
    Popover,
    TextInput,
    Typography,
} from "@metrom-xyz/ui";
import { formatDateTime } from "@/src/utils/format";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useClickAway } from "react-use";
import { useDistributions } from "@/src/hooks/useDistributions";
import type { ProcessedDistribution } from "@/src/types/distributions";
import type { Hex } from "viem";
import type { SupportedChain } from "@metrom-xyz/contracts";

import styles from "./styles.module.css";

interface FiltersProps {
    chain: SupportedChain;
    campaignId: Hex;
    onFetched: (distributions: ProcessedDistribution[]) => void;
    onLoading: (loading: boolean) => void;
}

export function Filters({
    campaignId,
    chain,
    onFetched,
    onLoading,
}: FiltersProps) {
    const t = useTranslations("campaignDistributions.filters");

    const [from, setFrom] = useState<Dayjs | undefined>();
    const [to, setTo] = useState<Dayjs | undefined>();
    const [error, setError] = useState("");
    const [fromPopover, setFromPopover] = useState(false);
    const [toPopover, setToPopover] = useState(false);
    const [fromAnchor, setFromAnchor] = useState<
        HTMLDivElement | SVGElement | null
    >(null);
    const [toAnchor, setToAnchor] = useState<
        HTMLDivElement | SVGElement | null
    >(null);

    const fromRef = useRef<HTMLDivElement>(null);
    const toRef = useRef<HTMLDivElement>(null);

    const { distributions, loading, progress, fetchDistributions } =
        useDistributions({
            chainId: chain,
            campaignId,
            from: from?.unix(),
            to: to?.unix(),
        });

    useClickAway(fromRef, getPopoverHandler("from", false));
    useClickAway(toRef, getPopoverHandler("to", false));

    useEffect(() => {
        if (!loading) {
            console.log("on fetched");
            onFetched(distributions);
        }

        onLoading(loading);
    }, [loading, distributions]);

    useEffect(() => {
        if (!from || !to) return;

        let error = "";
        if (to.isBefore(from)) error = t("errors.inconsistentRange");
        if (to.diff(from, "days") > 7) error = t("errors.rangeTooWide");

        setError(error);
    }, [from, to, t]);

    function getPopoverHandler(type: "from" | "to", open: boolean) {
        return () => {
            if (type === "from") {
                setFromPopover(open);
            } else {
                setToPopover(open);
            }
        };
    }

    return (
        <div className={styles.root}>
            <Typography size="lg" weight="medium" uppercase>
                {t("title")}
            </Typography>
            <Card className={styles.card}>
                <TextInput
                    label={t("from")}
                    ref={setFromAnchor}
                    value={formatDateTime(from)}
                    onClick={getPopoverHandler("from", true)}
                    error={!!error}
                    readOnly
                />
                <TextInput
                    label={t("to")}
                    disabled={!from}
                    ref={setToAnchor}
                    value={formatDateTime(to)}
                    onClick={getPopoverHandler("to", true)}
                    error={!!error}
                    readOnly
                />
                <Popover
                    ref={fromRef}
                    anchor={fromAnchor}
                    open={fromPopover}
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
                    disabled={!from || !to || !!error}
                    loading={loading}
                    onClick={fetchDistributions}
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
            </Card>
        </div>
    );
}
