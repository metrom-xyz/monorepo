import { type BaseCampaignPayloadPart } from "@/src/types/campaign/common";
import type { LocalizedMessage } from "@/src/types/utils";
import { RestrictionType, type Restrictions } from "@metrom-xyz/sdk";
import {
    Button,
    TextInput,
    Typography,
    Switch,
    SwitchOption,
} from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { type Address } from "viem";
import { Dot } from "./dot";
import { CsvAddressesImport } from "./csv-addresses-import";
import { isAddress } from "@/src/utils/address";
import { useFormErrors } from "@/src/context/form-errors";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { RestrictedAddress } from "./restricted-address";
import { TrashIcon } from "@/src/assets/trash-icon";

import styles from "./styles.module.css";

export const MAXIMUM_RESTRICTIONS = 20;

interface RestrictionsPickerProps {
    value?: Restrictions;
    onChange: (restrictions: BaseCampaignPayloadPart) => void;
}

type ErrorMessage = LocalizedMessage<"newCampaign.inputs.restrictionsPicker">;

export function RestrictionsPicker({
    value,
    onChange,
}: RestrictionsPickerProps) {
    const [error, setError] = useState<ErrorMessage>("");
    const [address, setAddress] = useState("");

    const t = useTranslations("newCampaign.inputs.restrictionsPicker");
    const { updateErrors } = useFormErrors();

    useEffect(() => {
        if (!address) {
            setError("");
            return;
        }

        if (!isAddress(address)) setError("errors.notAnAddress");
        else if (value?.list.find((existing) => existing === address))
            setError("errors.alreadyRestricted");
        else setError("");
    }, [address, value?.list]);

    useEffect(() => {
        updateErrors({ restrictions: error });
    }, [error, updateErrors]);

    const onTypeChange = useCallback(
        (type: RestrictionType) => {
            onChange({ restrictions: { type, list: value?.list || [] } });
        },
        [value?.list, onChange],
    );

    function handleAddressOnChange(event: ChangeEvent<HTMLInputElement>) {
        const address = event.target.value;
        setAddress(address as Address);
    }

    const handleOnImport = useCallback(
        (addresses: Address[]) => {
            if (!value?.type) return;

            onChange({
                restrictions: {
                    type: value.type,
                    list: addresses,
                },
            });
        },
        [value?.type, onChange],
    );

    const handleOnAdd = useCallback(() => {
        if (!address || !value?.type) return;

        const newAddresses: string[] = value?.list
            ? [...value.list, address]
            : [address];

        onChange({
            restrictions: { type: value.type, list: newAddresses as Address[] },
        });
        setAddress("");
    }, [address, value?.list, value?.type, onChange]);

    const handleOnRemove = useCallback(
        (toRemove: Address) => {
            if (!value?.type) return;

            onChange({
                restrictions: {
                    type: value?.type,
                    list: value.list.filter((address) => address !== toRemove),
                },
            });
        },
        [value?.list, value?.type, onChange],
    );

    const handleOnRemoveAll = useCallback(() => {
        if (!value?.type) return;

        onChange({
            restrictions: {
                type: value?.type,
                list: [],
            },
        });
    }, [value?.type, onChange]);

    return (
        <div className={styles.root}>
            <div className={styles.inputsWrapper}>
                <CsvAddressesImport
                    onImport={handleOnImport}
                    className={styles.importCsvInput}
                />
                <div className={styles.switchAndInput}>
                    <Switch
                        value={value?.type}
                        onChange={onTypeChange}
                        className={styles.switch}
                    >
                        <SwitchOption
                            value={RestrictionType.Blacklist}
                            className={styles.switchOption}
                        >
                            <Dot color="red" />
                            <Typography size="sm" weight="medium">
                                {t("block")}
                            </Typography>
                        </SwitchOption>
                        <SwitchOption
                            value={RestrictionType.Whitelist}
                            className={styles.switchOption}
                        >
                            <Dot color="green" />
                            <Typography size="sm" weight="medium">
                                {t("allow")}
                            </Typography>
                        </SwitchOption>
                    </Switch>
                    <TextInput
                        size="lg"
                        placeholder={
                            value?.type === RestrictionType.Blacklist
                                ? t("enterAddressToBlock")
                                : t("enterAddressToAllow")
                        }
                        error={!!error}
                        errorText={error ? t(error) : ""}
                        value={address}
                        onChange={handleAddressOnChange}
                        endAdornment={
                            <Button
                                size="xs"
                                disabled={
                                    !address ||
                                    !!error ||
                                    !value?.list ||
                                    value?.list.length > MAXIMUM_RESTRICTIONS
                                }
                                icon={ArrowRightIcon}
                                iconPlacement="right"
                                onClick={handleOnAdd}
                                className={{ root: styles.addButton }}
                            >
                                {t("add")}
                            </Button>
                        }
                        className={styles.input}
                    />
                </div>
            </div>
            <div className={styles.listWrapper}>
                {value?.list && value.list.length > 0 && (
                    <div className={styles.list}>
                        {value.list.map((address) => (
                            <RestrictedAddress
                                key={address}
                                type={value.type}
                                address={address}
                                onRemove={handleOnRemove}
                            />
                        ))}
                        {value.list.length > 10 && (
                            <Button
                                size="sm"
                                variant="secondary"
                                border={false}
                                icon={TrashIcon}
                                iconPlacement="right"
                                onClick={handleOnRemoveAll}
                                className={{
                                    root: styles.removeButton,
                                }}
                            >
                                {t("removeAll")}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
