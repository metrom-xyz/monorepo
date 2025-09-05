"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePrevious } from "react-use";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import dayjs, { type Dayjs } from "dayjs";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import type {
    BaseCampaignPayload,
    CampaignPayloadErrors,
    BaseCampaignPayloadPart,
} from "@/src/types/campaign";
import { Typography, Button, DateTimePicker, ErrorText } from "@metrom-xyz/ui";
import { getClosestAvailableDateTime } from "../../../../utils/date";
import { formatDateTime } from "@/src/utils/format";

import styles from "./styles.module.css";

interface StartDateStepProps {
    disabled?: boolean;
    startDate?: BaseCampaignPayload["startDate"];
    endDate?: BaseCampaignPayload["endDate"];
    onStartDateChange: (startDate: BaseCampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

export function StartDateStep({
    disabled,
    startDate,
    endDate,
    onStartDateChange,
    onError,
}: StartDateStepProps) {
    const t = useTranslations("newCampaign.form.base.startDate");
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Dayjs | undefined>(startDate);
    const [minDate, setMinDate] = useState<Dayjs | undefined>();
    const [dateError, setDateError] = useState("");

    const previousDate = usePrevious(date);
    const { id: chainId } = useChainWithType();

    const prevDate = usePrevious(startDate);

    const unsavedChanges = useMemo(() => {
        if (!prevDate) return true;
        return !prevDate.isSame(date);
    }, [date, prevDate]);

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        if (disabled) return;
        setOpen(true);
    }, [disabled]);

    useEffect(() => {
        if (minDate || !open) return;
        setMinDate(getClosestAvailableDateTime());
    }, [minDate, open]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (date?.isBefore(dayjs()))
                setMinDate(getClosestAvailableDateTime(date));
        }, 1_000);
        return () => {
            clearInterval(interval);
        };
    }, [date, minDate]);

    useEffect(() => {
        if (open && !startDate) setDate(dayjs());
        else if (!open && !startDate) setDate(undefined);
    }, [open, startDate]);

    useEffect(() => {
        if (!date || !minDate || !previousDate) return;

        let dateError = "";
        if (date.isBefore(minDate)) dateError = t("errors.dateInThePast");

        onError({ startDate: !!dateError });
        setDateError(dateError);
    }, [date, minDate, previousDate, onError, t]);

    const handleStepOnClick = useCallback(() => {
        if (open && !startDate) setDate(undefined);
        if (open) setDate(startDate);
        setOpen((open) => !open);
    }, [open, startDate]);

    const handleDateOnApply = useCallback(() => {
        onStartDateChange({ startDate: dayjs(date) });
        setOpen(false);
    }, [date, onStartDateChange]);

    return (
        <Step
            disabled={disabled}
            open={open}
            completed={!!date || !!startDate}
            onPreviewClick={handleStepOnClick}
        >
            <StepPreview
                label={
                    <div className={styles.previewLabelWrapper}>
                        <Typography
                            uppercase
                            weight="medium"
                            className={styles.previewLabel}
                        >
                            {t("title")}
                        </Typography>
                        <ErrorText size="xs" weight="medium">
                            {dateError}
                        </ErrorText>
                    </div>
                }
            >
                <Typography
                    uppercase
                    size="lg"
                    weight="medium"
                    className={styles.dateText}
                >
                    {formatDateTime(date || startDate)}
                </Typography>
            </StepPreview>
            <StepContent>
                <div className={styles.stepContent}>
                    <DateTimePicker
                        value={date}
                        min={minDate}
                        range={{ from: date, to: endDate }}
                        onChange={setDate}
                    />
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={!unsavedChanges || !date}
                        onClick={handleDateOnApply}
                        className={{ root: styles.applyButton }}
                    >
                        {t("apply")}
                    </Button>
                </div>
            </StepContent>
        </Step>
    );
}
