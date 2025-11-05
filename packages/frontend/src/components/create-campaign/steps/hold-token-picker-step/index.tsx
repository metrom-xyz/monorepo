import { Step } from "@/src/components/step";
import { StepContent } from "@/src/components/step/content";
import { StepPreview } from "@/src/components/step/preview";
import type {
    CampaignPayloadErrors,
    HoldFungibleAssetCampaignPayloadPart,
} from "@/src/types/campaign";
import type { Address } from "viem";
import classNames from "classnames";
import { ErrorText, TextInput, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { InfoMessage } from "@/src/components/info-message";
import { isAddress } from "@/src/utils/address";
import { useFungibleAssetInfo } from "@/src/hooks/useFungibleAssetInfo";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { AssetChip, AssetChipLoading } from "./asset-chip";
import type { LocalizedMessage } from "@/src/types/utils";
import { useDebounce } from "react-use";
import type { FungibleAssetInfo } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

interface HoldFungibleAssetPickerStepProps {
    disabled?: boolean;
    asset?: FungibleAssetInfo;
    onFungibleAssetChange: (
        fungibleAsset: HoldFungibleAssetCampaignPayloadPart,
    ) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

type ErrorMessage =
    LocalizedMessage<"newCampaign.form.holdFungibleAsset.picker">;

export function HoldFungibleAssetPickerStep({
    disabled,
    asset,
    onFungibleAssetChange,
    onError,
}: HoldFungibleAssetPickerStepProps) {
    const t = useTranslations("newCampaign.form.holdFungibleAsset.picker");

    const [assetError, setAssetError] = useState<ErrorMessage>("");
    const [assetAddress, setAssetAddress] = useState(asset?.address || "");
    const [debouncedAssetAddress, setDebouncedAssetAddress] = useState(
        asset?.address || "",
    );

    const { id: chainId } = useChainWithType();
    const {
        info: assetInfo,
        errored: assetInfoErrored,
        loading: loadingAssetInfo,
    } = useFungibleAssetInfo({
        address: debouncedAssetAddress,
        enabled: isAddress(debouncedAssetAddress) && !disabled,
    });

    useDebounce(
        () => {
            setDebouncedAssetAddress(assetAddress);
        },
        300,
        [assetAddress],
    );

    useEffect(() => {
        if (!assetAddress) {
            setAssetError("");
            return;
        }

        if (!isAddress(assetAddress)) setAssetError("errors.notAnAddress");
        else if (!assetInfo && assetInfoErrored)
            setAssetError("errors.notFound");
        else setAssetError("");
    }, [assetAddress, assetInfo, assetInfoErrored]);

    useEffect(() => {
        onError({
            holdFungibleAsset: !!assetError,
        });
    }, [onError, assetError]);

    useEffect(() => {
        if (assetInfo) onFungibleAssetChange({ asset: assetInfo });
    }, [assetAddress, assetInfo, onFungibleAssetChange]);

    function handleAssetOnChange(event: ChangeEvent<HTMLInputElement>) {
        const address = event.target.value as Address;
        setAssetAddress(address);
    }

    const handleOnRemove = useCallback(() => {
        setAssetAddress("");
        setDebouncedAssetAddress("");
        onFungibleAssetChange({ asset: undefined });
    }, [onFungibleAssetChange]);

    return (
        <Step disabled={disabled} completed={true} open className={styles.step}>
            <StepPreview
                label={
                    <div
                        className={classNames(styles.previewLabelWrapper, {
                            [styles.disabled]: disabled,
                        })}
                    >
                        <div className={styles.previewTextWrapper}>
                            <div className={styles.titleWrapper}>
                                <Typography
                                    uppercase
                                    weight="medium"
                                    size="sm"
                                    className={styles.previewLabel}
                                >
                                    {t("title")}
                                </Typography>
                                <ErrorText size="xs" weight="medium">
                                    {assetError ? t(assetError) : null}
                                </ErrorText>
                            </div>
                        </div>
                    </div>
                }
                decorator={false}
                className={{ root: !disabled ? styles.stepPreview : "" }}
            >
                <div className={styles.previewWrapper}>
                    <InfoMessage text={t("infoMessage")} />
                    <div className={styles.inputWrapper}>
                        <Typography weight="medium" size="xs" uppercase light>
                            {t("tokenAddressInput.label")}
                        </Typography>
                        {!assetInfo && loadingAssetInfo ? (
                            <AssetChipLoading />
                        ) : assetInfo ? (
                            <AssetChip
                                {...assetInfo}
                                chainId={chainId}
                                onRemove={handleOnRemove}
                            />
                        ) : (
                            <TextInput
                                autoFocus
                                placeholder={t("tokenAddressInput.placeholder")}
                                value={assetAddress}
                                error={!!assetError}
                                onChange={handleAssetOnChange}
                                className={styles.assetInput}
                            />
                        )}
                    </div>
                </div>
            </StepPreview>
            <StepContent></StepContent>
        </Step>
    );
}
