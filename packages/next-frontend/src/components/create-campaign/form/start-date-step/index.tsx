import { useCallback, useEffect, useState } from "react";
import { useChainId } from "wagmi";
import dayjs, { type Dayjs } from "dayjs";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import type { CampaignPayload, CampaignPayloadPart } from "@/src/types";
import { TextInput } from "@/src/ui/text-input";
import { Button } from "@/src/ui/button";
import { DateTimePicker } from "@/src/ui/date-time-picker";

import styles from "./styles.module.css";

interface StartDateStepProps {
    disabled?: boolean;
    startDate?: CampaignPayload["startDate"];
    endDate?: CampaignPayload["startDate"];
    onStartDateChange: (startDate: CampaignPayloadPart) => void;
}

export function StartDateStep({
    disabled,
    startDate,
    endDate,
    onStartDateChange,
}: StartDateStepProps) {
    const t = useTranslations("new_campaign.form.start_date");
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Dayjs | undefined>(startDate);
    const chainId = useChainId();

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    function handleStepOnClick() {
        if (open && !startDate) setDate(undefined);
        if (open) setDate(startDate);
        setOpen((open) => !open);
    }

    function handleDateOnChange(value: Dayjs) {
        setDate(value);
    }

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
            <StepPreview label={t("title")}>
                {/* TODO: add input mask for date */}
                {/* TODO: add errors */}
                <TextInput
                    variant="lg"
                    readOnly
                    error={true}
                    errorText={"copa duro"}
                    value={dayjs(date || startDate)
                        .format("DD MMM YYYY | HH:mm")
                        .toUpperCase()}
                    className={{ input: styles.dateInput }}
                />
            </StepPreview>
            <StepContent>
                <div className={styles.stepContent}>
                    <DateTimePicker
                        value={date}
                        min={dayjs()}
                        range={{ from: date, to: endDate }}
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
