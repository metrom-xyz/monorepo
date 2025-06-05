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

import styles from "./styles.module.css";

interface FiltersProps {
    from?: Dayjs;
    to?: Dayjs;
    loading?: boolean;
    onFromChange?: (from: Dayjs) => void;
    onTohange?: (to: Dayjs) => void;
    onFetch?: () => void;
}

export function Filters({
    from,
    to,
    loading,
    onFromChange,
    onTohange,
    onFetch,
}: FiltersProps) {
    const t = useTranslations("campaignDistributions.filters");

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

    useClickAway(fromRef, getPopoverHandler("from", false));
    useClickAway(toRef, getPopoverHandler("to", false));

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
                        onChange={onFromChange}
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
                        onChange={onTohange}
                    />
                </Popover>
                <Button
                    size="sm"
                    disabled={!from || !to || !!error}
                    loading={loading}
                    onClick={onFetch}
                >
                    {t("search")}
                </Button>
                <ErrorText level="error" size="xs" weight="medium">
                    {error}
                </ErrorText>
            </Card>
        </div>
    );
}
