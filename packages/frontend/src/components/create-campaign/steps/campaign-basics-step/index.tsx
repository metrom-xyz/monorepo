import { useTranslations } from "next-intl";
import { FormStep } from "../../form-step";
import { useState, type ReactNode } from "react";

interface CampaignBasicsStepProps {
    targetSection: ReactNode;
}

export function CampaignBasicsStep({ targetSection }: CampaignBasicsStepProps) {
    const t = useTranslations("newCampaign.form.basics");

    const [open, setOpen] = useState(true);

    return (
        <FormStep
            title={t("title")}
            open={open}
            onToggle={setOpen}
            completed={false}
        >
            {targetSection}
            {/* <StartDateStep
                disabled={!payload.pool || unsupportedChain}
                startDate={payload.startDate}
                endDate={payload.endDate}
                onStartDateChange={handlePayloadOnChange}
                onError={handlePayloadOnError}
            />
            <EndDateStep
                disabled={!payload.startDate || unsupportedChain}
                startDate={payload.startDate}
                endDate={payload.endDate}
                onEndDateChange={handlePayloadOnChange}
                onError={handlePayloadOnError}
            /> */}
        </FormStep>
    );
}
