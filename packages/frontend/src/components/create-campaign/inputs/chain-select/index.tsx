import { getChainData } from "@/src/utils/chain";
import { Select, Typography, type SelectOption } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, type FunctionComponent } from "react";
import type { BaseCampaignPayloadPart } from "@/src/types/campaign/common";
import { useActiveChains } from "@/src/hooks/useActiveChains";
import type { CampaignType } from "@metrom-xyz/sdk";
import type { SVGIcon } from "@metrom-xyz/chains";

import styles from "./styles.module.css";

interface ChainSelectProps {
    campaignType: CampaignType;
    value?: number;
    onChange: (value: BaseCampaignPayloadPart) => void;
}

interface OptionData {
    logo: FunctionComponent<SVGIcon>;
}

const option = (option: SelectOption<number, OptionData>) => {
    const { label, data } = option;
    if (!data) return <></>;

    return (
        <div className={styles.option}>
            <data.logo className={styles.icon} />
            <Typography>{label}</Typography>
        </div>
    );
};

const selectedPrefix = (
    option: SelectOption<number, OptionData> | null | undefined,
) => {
    if (!option || !option.data) return <></>;
    const { data } = option;

    return <data.logo className={styles.prefixIcon} />;
};

export function ChainSelect({
    campaignType,
    value,
    onChange,
}: ChainSelectProps) {
    const t = useTranslations("newCampaign.inputs");
    const activeChains = useActiveChains();

    const options: SelectOption<number, OptionData>[] = useMemo(() => {
        const options: SelectOption<number, OptionData>[] = [];

        for (const chain of activeChains) {
            const chainData = getChainData(chain.id);
            if (
                !chainData ||
                !chainData.forms.find(({ type }) => type === campaignType)
            )
                continue;

            options.push({
                label: chainData.name,
                value: chain.id,
                data: {
                    logo: chainData.icon,
                },
            });
        }

        return options;
    }, [activeChains, campaignType]);

    const handleOnChange = useCallback(
        (option: SelectOption<number>) => {
            onChange({ chainId: option.value });
        },
        [onChange],
    );

    return (
        <Select
            size="lg"
            label={t("chain")}
            search
            options={options}
            value={value}
            onChange={handleOnChange}
            messages={{ noResults: t("noChains") }}
            renderOption={option}
            renderSelectedPrefix={selectedPrefix}
            className={styles.root}
        />
    );
}
