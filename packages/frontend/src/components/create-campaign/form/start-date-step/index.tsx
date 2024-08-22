import { useCallback, useEffect, useState } from "react";
import { usePrevious } from "react-use";
import { useChainId } from "wagmi";
import dayjs, { type Dayjs } from "dayjs";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import type {
    CampaignPayload,
    CampaignPayloadErrors,
    CampaignPayloadPart,
} from "@/src/types";
import { Typography } from "@/src/ui/typography";
import { Button } from "@/src/ui/button";
import { DateTimePicker } from "@/src/ui/date-time-picker";
import { ErrorText } from "@/src/ui/error-text";
import { getClosestAvailableDateTime } from "@/src/utils/date";
import { useTransition, animated } from "@react-spring/web";

import styles from "./styles.module.css";

interface StartDateStepProps {
    disabled?: boolean;
    startDate?: CampaignPayload["startDate"];
    endDate?: CampaignPayload["endDate"];
    onStartDateChange: (startDate: CampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

export function StartDateStep({
    disabled,
    startDate,
    endDate,
    onStartDateChange,
    onError,
}: StartDateStepProps) {
    const t = useTranslations("newCampaign.form.startDate");
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Dayjs | undefined>(startDate);
    const [minDate, setMinDate] = useState<Dayjs | undefined>();
    const [dateError, setDateError] = useState("");

    const previousDate = usePrevious(date);
    const chainId = useChainId();

    const transition = useTransition(dateError, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 200 },
    });

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
        if (!date || !minDate || !previousDate) return;

        let dateError = "";
        if (date.isBefore(minDate)) dateError = "errors.dateInThePast";

        onError({ startDate: !!dateError });
        setDateError(dateError);
    }, [date, minDate, onError, previousDate]);

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
            error={!!dateError}
            onPreviewClick={handleStepOnClick}
        >
            <StepPreview
                label={
                    <div className={styles.previewLabelWrapper}>
                        <Typography
                            uppercase
                            weight="medium"
                            variant="sm"
                            className={{ root: styles.previewLabel }}
                        >
                            {t("title")}
                        </Typography>
                        {transition(
                            (styles, error) =>
                                !!error && (
                                    <animated.div style={styles}>
                                        <ErrorText variant="xs" weight="medium">
                                            {t(error)}
                                        </ErrorText>
                                    </animated.div>
                                ),
                        )}
                    </div>
                }
            >
                <Typography
                    uppercase
                    variant="lg"
                    weight="medium"
                    className={{ root: styles.dateText }}
                >
                    {dayjs(date || startDate).format("DD MMM YYYY | HH:mm")}
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
                        size="small"
                        disabled={!date}
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
