import { useCallback, useEffect, useMemo, useState } from "react";
import { Typography, ErrorText, Switch, Button, Chip } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import {
    type AaveV3CampaignPayload,
    type AaveV3CampaignPayloadPart,
    type CampaignPayloadErrors,
} from "@/src/types/campaign";
import type { LocalizedMessage } from "@/src/types/utils";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { InfoMessage } from "@/src/components/info-message";
import { useAaveV3Collaterals } from "@/src/hooks/useAaveV3Collaterals";
import { CHAIN_TYPE } from "@/src/commons";
import { usePrevious } from "react-use";
import type { AaveV3Collateral } from "@metrom-xyz/sdk";
import { RemoteLogo } from "@/src/components/remote-logo";
import classNames from "classnames";

import styles from "./styles.module.css";

interface AaveV3BlacklistedCrossBorrowCollateralsStepProps {
    disabled?: boolean;
    brand?: AaveV3CampaignPayload["brand"];
    market?: AaveV3CampaignPayload["market"];
    collateral?: AaveV3Collateral;
    blacklistedCollaterals?: AaveV3Collateral[];
    onBlacklistedCrossBorrowCollateralsChange: (
        blacklistedCollaterals: AaveV3CampaignPayloadPart,
    ) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

type ErrorMessage =
    LocalizedMessage<"newCampaign.form.aaveV3.blacklistedCrossBorrowCollaterals">;

export function AaveV3BlacklistedCrossBorrowCollateralsStep({
    disabled,
    brand,
    market,
    collateral,
    blacklistedCollaterals,
    onBlacklistedCrossBorrowCollateralsChange,
    onError,
}: AaveV3BlacklistedCrossBorrowCollateralsStepProps) {
    const t = useTranslations(
        "newCampaign.form.aaveV3.blacklistedCrossBorrowCollaterals",
    );

    const [open, setOpen] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const [warning, setWarning] = useState<ErrorMessage>("");
    const [pickedCollaterals, setPickedCollaterals] = useState<
        AaveV3Collateral[]
    >(blacklistedCollaterals || []);

    const { id: chainId } = useChainWithType();
    const {
        loading: loadingSupportedCollaterals,
        collaterals: supportedCollaterals,
    } = useAaveV3Collaterals({
        chainId,
        chainType: CHAIN_TYPE,
        market: market?.address,
        brand: brand?.slug,
    });

    const collateralsChips = useMemo(() => {
        if (!supportedCollaterals || !collateral) return undefined;

        return supportedCollaterals.filter(
            ({ address }) => address !== collateral.address,
        );
    }, [supportedCollaterals, collateral]);

    const prevBlacklistedCollaterals = usePrevious(blacklistedCollaterals);

    const unsavedChanges = useMemo(() => {
        if (!prevBlacklistedCollaterals && pickedCollaterals.length === 0)
            return false;
        if (!prevBlacklistedCollaterals) return true;

        if (prevBlacklistedCollaterals.length !== pickedCollaterals.length)
            return true;

        const prevAddresses = new Set(
            prevBlacklistedCollaterals.map(({ address }) => address),
        );

        return pickedCollaterals.some(
            ({ address }) => !prevAddresses.has(address),
        );
    }, [pickedCollaterals, prevBlacklistedCollaterals]);

    useEffect(() => {
        setOpen(false);
    }, [chainId]);

    useEffect(() => {
        setOpen(enabled);
    }, [enabled]);

    useEffect(() => {
        if (enabled && !open && unsavedChanges) setWarning("notApplied");
        else if (enabled && !open && pickedCollaterals.length === 0)
            setWarning("emptyCollaterals");
        else setWarning("");
    }, [enabled, open, pickedCollaterals.length, unsavedChanges]);

    useEffect(() => {
        onError({
            blacklistedCrossSupplyCollaterals:
                enabled &&
                (!blacklistedCollaterals ||
                    blacklistedCollaterals?.length === 0),
        });
    }, [enabled, blacklistedCollaterals, onError]);

    useEffect(() => {
        return () => {
            onBlacklistedCrossBorrowCollateralsChange({
                blacklistedCollaterals: undefined,
            });
            setPickedCollaterals([]);
            setEnabled(false);
        };
    }, [onBlacklistedCrossBorrowCollateralsChange]);

    // reset state once the step gets disabled
    useEffect(() => {
        if (enabled) return;
        if (blacklistedCollaterals && blacklistedCollaterals.length > 0)
            onBlacklistedCrossBorrowCollateralsChange({
                blacklistedCollaterals: undefined,
            });

        setPickedCollaterals([]);
    }, [
        enabled,
        blacklistedCollaterals,
        onBlacklistedCrossBorrowCollateralsChange,
    ]);

    function handleSwitchOnClick(event: React.MouseEvent<HTMLDivElement>) {
        event.stopPropagation();
        setEnabled((enabled) => !enabled);
    }

    function handleStepOnClick() {
        if (!enabled) return;
        setOpen((open) => !open);
    }

    const getCollateralOnPickHandler = useCallback(
        (collateral: AaveV3Collateral) => {
            return () => {
                const existing = !!pickedCollaterals.find(
                    ({ address }) => address === collateral.address,
                );

                let newPickedCollaterals: AaveV3Collateral[] = [];
                if (existing)
                    newPickedCollaterals = pickedCollaterals.filter(
                        ({ address }) => address !== collateral.address,
                    );
                else newPickedCollaterals = [...pickedCollaterals, collateral];

                setPickedCollaterals(newPickedCollaterals);
            };
        },
        [pickedCollaterals],
    );

    const handleApply = useCallback(() => {
        setOpen(false);
        onBlacklistedCrossBorrowCollateralsChange({
            blacklistedCollaterals: pickedCollaterals,
        });
    }, [onBlacklistedCrossBorrowCollateralsChange, pickedCollaterals]);

    return (
        <Step
            disabled={disabled}
            completed={enabled}
            open={open}
            onPreviewClick={handleStepOnClick}
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
                                level="warning"
                            >
                                {warning ? t(warning) : null}
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
                <div className={styles.blocksWrapper}>
                    <Typography uppercase weight="medium" size="sm">
                        {t("blocks")}
                    </Typography>
                    <Typography uppercase weight="medium" size="sm">
                        {pickedCollaterals
                            .map(({ symbol }) => symbol)
                            .join(", ")}
                    </Typography>
                </div>
            </StepPreview>
            <StepContent>
                <div className={styles.stepContent}>
                    <InfoMessage
                        text={t.rich("infoMessage", {
                            symbol: collateral?.symbol || "",
                            borrowed:
                                pickedCollaterals
                                    ?.map(
                                        ({ symbol }) =>
                                            `${t.rich("borrowed", { symbol })}`,
                                    )
                                    .join(" ") || "",
                            bold: (chunks) => (
                                <span className={styles.boldText}>
                                    {chunks}
                                </span>
                            ),
                        })}
                    />
                    <Typography
                        uppercase
                        weight="medium"
                        size="sm"
                        variant="tertiary"
                    >
                        {t("collaterals")}
                    </Typography>
                    <div className={styles.collaterals}>
                        {loadingSupportedCollaterals || !collateralsChips ? (
                            <>
                                <div
                                    className={classNames(
                                        styles.collateral,
                                        styles.loading,
                                    )}
                                ></div>
                                <div
                                    className={classNames(
                                        styles.collateral,
                                        styles.loading,
                                    )}
                                ></div>
                                <div
                                    className={classNames(
                                        styles.collateral,
                                        styles.loading,
                                    )}
                                ></div>
                            </>
                        ) : (
                            collateralsChips.map((collateral) => {
                                const active = !!pickedCollaterals.find(
                                    ({ address }) =>
                                        address === collateral.address,
                                );

                                return (
                                    <Chip
                                        key={collateral.address}
                                        active={active}
                                        onClick={getCollateralOnPickHandler(
                                            collateral,
                                        )}
                                    >
                                        <div className={styles.collateral}>
                                            <RemoteLogo
                                                address={collateral.address}
                                                chain={collateral.chainId}
                                                size="xs"
                                            />
                                            <Typography
                                                weight="medium"
                                                className={classNames(
                                                    styles.symbol,
                                                    { [styles.active]: active },
                                                )}
                                            >
                                                {collateral.symbol}
                                            </Typography>
                                        </div>
                                    </Chip>
                                );
                            })
                        )}
                    </div>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={!unsavedChanges}
                        onClick={handleApply}
                        className={{ root: styles.applyButton }}
                    >
                        {t("apply")}
                    </Button>
                </div>
            </StepContent>
        </Step>
    );
}
