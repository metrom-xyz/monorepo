import { Step } from "@/src/components/step";
import { StepContent } from "@/src/components/step/content";
import { StepPreview } from "@/src/components/step/preview";
import {
    type BaseCampaignPayload,
    type CampaignPayloadErrors,
    type BaseCampaignPayloadPart,
    type FormStepBaseProps,
} from "@/src/types/campaign";
import type { LocalizedMessage } from "@/src/types/utils";
import { RestrictionType } from "@metrom-xyz/sdk";
import {
    Button,
    ErrorText,
    Switch,
    Tabs,
    Tab,
    TextInput,
    Typography,
} from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
} from "react";
import { usePrevious } from "react-use";
import { isAddress, type Address } from "viem";
import { XIcon } from "@/src/assets/x-icon";
import { Dot } from "./dot";
import { CsvAddressesImport } from "./csv-addresses-import";
import { Avatar } from "@/src/components/avatar/avatar";
import { Account } from "@/src/components/account";
import { InfoMessage } from "@/src/components/info-message";
import { useChainId } from "wagmi";

import styles from "./styles.module.css";

export const MAXIMUM_RESTRICTIONS = 20;

interface RestrictionsStepProps extends FormStepBaseProps {
    restrictions?: BaseCampaignPayload["restrictions"];
    onRestrictionsChange: (restrictions: BaseCampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

type ErrorMessage = LocalizedMessage<"newCampaign.form.base.restrictions">;

export function RestrictionsStep({
    loading,
    autoCompleted,
    disabled,
    restrictions,
    onRestrictionsChange,
    onError,
}: RestrictionsStepProps) {
    const t = useTranslations("newCampaign.form.base.restrictions");
    const [open, setOpen] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [error, setError] = useState<ErrorMessage>("");
    const [warning, setWarning] = useState<ErrorMessage>("");
    const [type, setType] = useState(RestrictionType.Blacklist);
    const [address, setAddress] = useState("");
    const [addresses, setAddresses] = useState<Address[]>([]);

    const chainId = useChainId();
    const prevRestrictions = usePrevious(restrictions);

    const unsavedChanges = useMemo(() => {
        if (!prevRestrictions && addresses.length === 0) return false;
        if (!prevRestrictions) return true;

        return (
            prevRestrictions.list.filter(
                (address) => !addresses.includes(address),
            ).length > 0 ||
            prevRestrictions.list.length !== addresses.length ||
            prevRestrictions.type !== type
        );
    }, [addresses, prevRestrictions, type]);

    // This hooks is used to disable and close the step when
    // the restrictions gets disabled, after the campaign creation.
    useEffect(() => {
        if (!autoCompleted && enabled && !!prevRestrictions && !restrictions)
            setEnabled(false);
        if (disabled) setEnabled(false);
    }, [autoCompleted, enabled, restrictions, prevRestrictions, disabled]);

    useEffect(() => {
        onRestrictionsChange({ restrictions: undefined });
        setAddress("");
        setType(RestrictionType.Blacklist);
        setAddresses([]);
    }, [chainId, onRestrictionsChange]);

    useEffect(() => {
        if (!!restrictions) {
            const { type, list } = restrictions;

            setType(type);
            setAddresses(list);
        }
    }, [restrictions]);

    useEffect(() => {
        if (!address) {
            setError("");
            return;
        }

        if (!isAddress(address)) setError("errors.notAnAddress");
        else if (!!addresses.find((existing) => existing === address))
            setError("errors.alreadyRestricted");
        else setError("");
    }, [address, addresses]);

    useEffect(() => {
        if (enabled && !open && unsavedChanges)
            setWarning("warnings.notApplied");
        else if (enabled && !open && addresses.length === 0)
            setWarning("warnings.emptyAddresses");
        else setWarning("");
    }, [enabled, open, unsavedChanges, addresses]);

    useEffect(() => {
        onError({
            restrictions:
                !!error ||
                (enabled && !restrictions) ||
                restrictions?.list.length === 0,
        });
    }, [enabled, restrictions, error, onError]);

    useEffect(() => {
        if (autoCompleted && !!restrictions) {
            setEnabled(true);
            setOpen(false);
        } else setOpen(enabled);
    }, [autoCompleted, restrictions, enabled]);

    function handleSwitchOnClick(
        _: boolean,
        event:
            | React.MouseEvent<HTMLButtonElement>
            | React.KeyboardEvent<HTMLButtonElement>,
    ) {
        event.stopPropagation();
        setEnabled((enabled) => !enabled);

        if (restrictions) {
            onRestrictionsChange({ restrictions: undefined });
            setAddress("");
            setType(RestrictionType.Blacklist);
            setAddresses([]);
        }
    }

    function handleStepOnClick() {
        if (!enabled) return;
        setOpen((open) => !open);
    }

    function handleAddressOnChange(event: ChangeEvent<HTMLInputElement>) {
        const address = event.target.value;
        setAddress(address as Address);
    }

    const handleOnAdd = useCallback(() => {
        if (!address) return;

        setAddresses((prev) => [...prev, address as Address]);
        setAddress("");
    }, [address]);

    const getRemoveHandler = useCallback((toRemove: Address) => {
        return () => {
            setAddresses((prev) =>
                prev.filter((address) => address !== toRemove),
            );
        };
    }, []);

    const handleOnApply = useCallback(() => {
        setOpen(false);
        onRestrictionsChange({
            restrictions: {
                list: addresses,
                type,
            },
        });
    }, [addresses, onRestrictionsChange, type]);

    return (
        <Step
            loading={loading}
            disabled={disabled}
            completed={enabled}
            open={open}
            onPreviewClick={handleStepOnClick}
            className={styles.step}
        >
            <StepPreview
                label={
                    <div className={styles.previewLabelWrapper}>
                        <div className={styles.previewTextWrapper}>
                            <Typography
                                uppercase
                                weight="medium"
                                className={styles.previewLabel}
                            >
                                {t("title")}
                            </Typography>
                            <ErrorText
                                size="xs"
                                weight="medium"
                                level={!!error ? "error" : "warning"}
                            >
                                {!!error
                                    ? t(error)
                                    : !!warning
                                      ? t(warning)
                                      : null}
                            </ErrorText>
                        </div>
                        <Switch
                            tabIndex={-1}
                            size="lg"
                            checked={enabled}
                            onClick={handleSwitchOnClick}
                        />
                    </div>
                }
                decorator={false}
                disabled={!enabled}
            >
                <div className={styles.typeWrapper}>
                    <Typography weight="medium" size="sm" uppercase>
                        {type === RestrictionType.Blacklist &&
                            t("blocks", { count: addresses.length })}
                        {type === RestrictionType.Whitelist &&
                            t("allows", { count: addresses.length })}
                    </Typography>
                </div>
            </StepPreview>
            <StepContent>
                <div className={styles.stepContent}>
                    <InfoMessage
                        text={t("infoMessage")}
                        link="https://docs.metrom.xyz/creating-a-campaign/address-restrictions"
                        linkText={t("readMore")}
                    />
                    <div className={styles.inputsWrapper}>
                        <Tabs value={type} onChange={setType}>
                            <Tab value={RestrictionType.Blacklist}>
                                <div className={styles.tab}>
                                    <Dot color="red" />
                                    <Typography weight="medium">
                                        {t("blacklist")}
                                    </Typography>
                                </div>
                            </Tab>
                            <Tab value={RestrictionType.Whitelist}>
                                <div className={styles.tab}>
                                    <Dot color="green" />
                                    <Typography weight="medium">
                                        {t("whitelist")}
                                    </Typography>
                                </div>
                            </Tab>
                        </Tabs>
                        <div className={styles.textInputWrapper}>
                            <CsvAddressesImport
                                onImport={setAddresses}
                                className={styles.importCsvInput}
                            />
                            <TextInput
                                label={t("input.label")}
                                placeholder={t("input.placeholder")}
                                value={address}
                                onChange={handleAddressOnChange}
                                className={styles.textInput}
                            />
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={
                                !!error ||
                                !address ||
                                addresses.length > MAXIMUM_RESTRICTIONS
                            }
                            onClick={handleOnAdd}
                            className={{ root: styles.applyButton }}
                        >
                            {t("add")}
                        </Button>
                    </div>
                    <div className={styles.divider}></div>
                    <div className={styles.listWrapper}>
                        <Typography weight="medium" light size="xs" uppercase>
                            {t("list")}
                        </Typography>
                        {addresses.length > 0 && (
                            <div className={styles.list}>
                                {addresses.map((address) => (
                                    <div key={address} className={styles.row}>
                                        <div className={styles.accountWrapper}>
                                            <Avatar
                                                address={address}
                                                width={20}
                                                height={20}
                                            />
                                            <Account
                                                variant="long"
                                                weight="medium"
                                                address={address}
                                            />
                                        </div>
                                        <XIcon
                                            onClick={getRemoveHandler(address)}
                                            className={styles.removeIcon}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {(unsavedChanges || addresses.length > 0) && (
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={!unsavedChanges}
                            onClick={handleOnApply}
                            className={{ root: styles.applyButton }}
                        >
                            {t("apply")}
                        </Button>
                    )}
                </div>
            </StepContent>
        </Step>
    );
}
