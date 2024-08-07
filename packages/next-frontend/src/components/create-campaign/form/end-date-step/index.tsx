import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import type { CampaignPayload, CampaignPayloadPart } from "@/src/types";
import { TextInput } from "@/src/ui/text-input";
import { DateTimePicker } from "@/src/ui/date-time-picker";
import { Button } from "@/src/ui/button";

import styles from "./styles.module.css";

interface EndDateStepProps {
    disabled?: boolean;
    startDate?: CampaignPayload["endDate"];
    endDate?: CampaignPayload["endDate"];
    onEndDateChange: (startDate: CampaignPayloadPart) => void;
}

export function EndDateStep({
    disabled,
    startDate,
    endDate,
    onEndDateChange,
}: EndDateStepProps) {
    const t = useTranslations("new_campaign.form.end_date");
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Dayjs | undefined>(endDate);

    function handleStepOnClick() {
        if (open && !endDate) setDate(undefined);
        if (open) setDate(endDate);
        setOpen((open) => !open);
    }

    function handleDateOnChange(value: Dayjs) {
        setDate(value);
    }

    const handleDateOnApply = useCallback(() => {
        onEndDateChange({ endDate: dayjs(date) });
        setOpen(false);
    }, [date, onEndDateChange]);

    return (
        <Step
            disabled={disabled}
            open={open}
            completed={!!date || !!endDate}
            onPreviewClick={handleStepOnClick}
        >
            <StepPreview label={t("title")}>
                {/* TODO: add input mask for date */}
                {/* TODO: add errors */}
                <TextInput
                    variant="lg"
                    readOnly
                    error={true}
                    errorText={"copa duro"}
                    value={dayjs(date || endDate)
                        .format("DD MMM YYYY | HH:mm")
                        .toUpperCase()}
                    className={{ input: styles.dateInput }}
                />
            </StepPreview>
            <StepContent>
                <div className={styles.stepContent}>
                    <DateTimePicker
                        value={date}
                        min={startDate}
                        range={{ from: startDate, to: date }}
                        // TODO: add max campaign duration limit
                        onChange={handleDateOnChange}
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
