import { Step } from "@/src/components/step";
import { StepContent } from "@/src/components/step/content";
import { StepPreview } from "@/src/components/step/preview";
import {
    RestrictionType,
    type CampaignPayload,
    type CampaignPayloadErrors,
    type CampaignPayloadPart,
} from "@/src/types";
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
import classNames from "classnames";
import { usePrevious } from "react-use";
import { isAddress, zeroAddress, type Address } from "viem";
import { blo } from "blo";
import { shortenAddress } from "@/src/utils/address";
import { XIcon } from "@/src/assets/x-icon";
import { Dot } from "./dot";

import styles from "./styles.module.css";

const MAXIMUM_RESTRICTIONS = 20;

interface RestrictionsStepProps {
    disabled?: boolean;
    restrictions?: CampaignPayload["restrictions"];
    onRestrictionsChange: (restrictions: CampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

export function RestrictionsStep({
    disabled,
    restrictions,
    onRestrictionsChange,
    onError,
}: RestrictionsStepProps) {
    const t = useTranslations("newCampaign.form.restrictions");
    const [open, setOpen] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [error, setError] = useState("");
    const [warning, setWarning] = useState("");
    const [type, setType] = useState(
        restrictions?.type || RestrictionType.blacklist,
    );
    const [address, setAddress] = useState("");
    const [addresses, setAddresses] = useState<Address[]>(
        restrictions?.list || [],
    );

    const prevRestrictions = usePrevious(restrictions);

    const unsavedChanges = useMemo(() => {
        if (!prevRestrictions && addresses.length === 0) return false;
        if (!prevRestrictions) return true;

        return (
            prevRestrictions.list.length !== addresses.length ||
            prevRestrictions.type !== type
        );
    }, [addresses, prevRestrictions, type]);

    // this hooks is used to disable and close the step when
    // the kpi specification gets disabled, after the campaign creation
    useEffect(() => {
        if (enabled && !!prevRestrictions && !restrictions) setEnabled(false);
    }, [enabled, restrictions, prevRestrictions]);

    useEffect(() => {
        if (enabled) return;
        if (restrictions) onRestrictionsChange({ restrictions: undefined });

        setAddress("");
        setType(RestrictionType.blacklist);
        setAddresses([]);
    }, [enabled, onRestrictionsChange, restrictions]);

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
        else setWarning("");
    }, [enabled, open, unsavedChanges]);

    useEffect(() => {
        onError({
            restrictions: !!error || (enabled && !restrictions),
        });
    }, [enabled, restrictions, onError, error]);

    useEffect(() => {
        setOpen(enabled);
    }, [enabled]);

    function handleSwitchOnClick() {
        setEnabled((enabled) => !enabled);
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
            disabled={disabled}
            error={!!error || !!warning}
            errorLevel={!!error ? "error" : "warning"}
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
                                variant="xs"
                                weight="medium"
                                level={!!error ? "error" : "warning"}
                                className={classNames(styles.error, {
                                    [styles.errorVisible]: !!error || !!warning,
                                })}
                            >
                                {!!error
                                    ? t(error)
                                    : !!warning
                                      ? t(warning)
                                      : null}
                            </ErrorText>
                        </div>
                        <Switch
                            size="big"
                            checked={enabled}
                            onClick={handleSwitchOnClick}
                        />
                    </div>
                }
                decorator={false}
                className={{
                    root: !enabled ? styles.previewDisabled : "",
                }}
            >
                <div className={styles.typeWrapper}>
                    <Typography uppercase weight="medium" light variant="sm">
                        {t("type")}
                    </Typography>
                    <Typography weight="medium" variant="sm" uppercase>
                        {type}
                    </Typography>
                    <Typography variant="sm" uppercase light>
                        -
                    </Typography>
                    <Typography weight="medium" variant="sm" uppercase>
                        {addresses.length}
                    </Typography>
                </div>
            </StepPreview>
            <StepContent>
                <div className={styles.stepContent}>
                    <Typography light variant="xs">
                        {t("description")}
                    </Typography>
                    <div className={styles.inputsWrapper}>
                        <Tabs value={type} onChange={setType}>
                            <Tab value={RestrictionType.blacklist}>
                                <div className={styles.tab}>
                                    <Dot color="red" />
                                    <Typography weight="medium">
                                        {t("blacklist")}
                                    </Typography>
                                </div>
                            </Tab>
                            <Tab value={RestrictionType.whitelist}>
                                <div className={styles.tab}>
                                    <Dot color="green" />
                                    <Typography weight="medium">
                                        {t("whitelist")}
                                    </Typography>
                                </div>
                            </Tab>
                        </Tabs>
                        <TextInput
                            label={t("input.label")}
                            placeholder={t("input.placeholder")}
                            value={address}
                            onChange={handleAddressOnChange}
                            className={styles.textInput}
                        />
                        <Button
                            variant="secondary"
                            size="small"
                            disabled={
                                !!error ||
                                !address ||
                                addresses.length > MAXIMUM_RESTRICTIONS
                            }
                            onClick={handleOnAdd}
                            className={{ root: styles.applyButton }}
                        >
                            {t("addTo", { type })}
                        </Button>
                    </div>
                    <hr className={styles.divider}></hr>
                    {addresses.length > 0 && (
                        <div className={styles.listWrapper}>
                            {addresses.map((address) => (
                                <div key={address} className={styles.row}>
                                    <div className={styles.accountWrapper}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            alt="Avatar"
                                            src={blo(address || zeroAddress)}
                                            className={styles.avatar}
                                        />
                                        <Typography weight="medium">
                                            {shortenAddress(address, true)}
                                        </Typography>
                                    </div>
                                    <XIcon
                                        onClick={getRemoveHandler(address)}
                                        className={styles.removeIcon}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    <Button
                        variant="secondary"
                        size="small"
                        disabled={!unsavedChanges}
                        onClick={handleOnApply}
                        className={{ root: styles.applyButton }}
                    >
                        {t("apply")}
                    </Button>
                </div>
            </StepContent>
        </Step>
    );
}
