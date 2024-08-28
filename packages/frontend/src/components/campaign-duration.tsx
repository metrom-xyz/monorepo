import { useTranslations } from "next-intl";
import { Typography, type TypographyProps } from "../ui/typography";
import { useMemo } from "react";
import dayjs from "dayjs";

interface CampaignDurationProps extends Omit<TypographyProps, "children"> {
    secondsDuration: number;
}

export function CampaignDuration({
    secondsDuration,
    ...rest
}: CampaignDurationProps) {
    const t = useTranslations("campaignDuration");

    const duration = useMemo(() => {
        const duration = dayjs.duration(secondsDuration, "seconds");

        if (duration.months() > 0) {
            return t("months", { count: duration.get("months") });
        }
        if (duration.days() > 0) {
            return t("days", { count: duration.get("days") });
        }
        if (duration.hours() > 0)
            return t("hours", { count: duration.get("hours") });

        return t("minutes", { count: duration.get("minutes") });
    }, [secondsDuration, t]);

    return <Typography {...rest}>{duration}</Typography>;
}
