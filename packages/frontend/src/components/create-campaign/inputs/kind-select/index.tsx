import { useCallback, type ReactSVGElement } from "react";
import { type BaseCampaignPayloadPart } from "@/src/types/campaign/common";
import type { CampaignKind } from "@metrom-xyz/sdk";
import { Select } from "@metrom-xyz/ui";

import styles from "./styles.module.css";

export interface KindOption<T extends string> {
    label: T;
    value: CampaignKind;
    icon?: ReactSVGElement;
}

export interface KindSelectProps {
    disabled?: boolean;
    label: string;
    kinds: KindOption<string>[];
    value?: CampaignKind;
    messages: { noResults: string };
    onChange: (value: BaseCampaignPayloadPart) => void;
}

export function KindSelect({
    disabled,
    label,
    kinds,
    value,
    messages,
    onChange,
}: KindSelectProps) {
    const handleOnChange = useCallback(
        (option: KindOption<string>) => {
            onChange({ kind: option.value });
        },
        [onChange],
    );

    return (
        <Select
            size="lg"
            label={label}
            disabled={disabled}
            options={kinds}
            value={value}
            messages={messages}
            onChange={handleOnChange}
            className={styles.root}
        />
    );
}
