import { useFungibleAssetInfo } from "@/src/hooks/useFungibleAssetInfo";
import type { HoldFungibleAssetCampaignPayloadPart } from "@/src/types/campaign/hold-fungible-asset-campaign";
import { isAddress } from "@/src/utils/address";
import type { FungibleAssetInfo } from "@metrom-xyz/sdk";
import { Popover, TextInput } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
} from "react";
import type { Address } from "viem";
import { TrashIcon } from "@/src/assets/trash-icon";
import { useFormSteps } from "@/src/context/form-steps";
import type { LocalizedMessage } from "@/src/types/utils";
import { SearchIcon } from "@/src/assets/search-icon";
import { usePrevious } from "react-use";
import { FungibleAsset } from "@/src/components/fungible-asset";
import { FungibleAssetLogo } from "@/src/components/fungible-asset/fungible-asset-logo";
import { getErc20Name } from "@/src/utils/erc20";

import styles from "./styles.module.css";

interface FungibleAssetPickerProps {
    chainId?: number;
    asset?: FungibleAssetInfo;
    disabled?: boolean;
    resetTrigger?: unknown;
    onChange: (value: HoldFungibleAssetCampaignPayloadPart) => void;
}

type ErrorMessage = LocalizedMessage<"newCampaign.inputs.fungibleAssetPicker">;

export function FungibleAssetPicker({
    chainId,
    asset,
    disabled,
    resetTrigger,
    onChange,
}: FungibleAssetPickerProps) {
    const t = useTranslations("newCampaign.inputs.fungibleAssetPicker");

    const [error, setError] = useState<ErrorMessage>();
    const [assetAddress, setAssetAddress] = useState(asset?.address || "");
    const [pickedAssetAddress, setPickedAssetAddress] = useState("");
    const [popover, setPopover] = useState(false);
    const [picked, setPicked] = useState(false);
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);

    const popoverRef = useRef<HTMLDivElement>(null);
    const { updateErrors } = useFormSteps();
    const prevResetTrigger = usePrevious(resetTrigger);

    const {
        info: assetInfo,
        errored: assetInfoErrored,
        loading: loadingAssetInfo,
    } = useFungibleAssetInfo({
        chainId,
        address: assetAddress,
        enabled: isAddress(assetAddress) && !disabled,
    });

    useEffect(() => {
        if (resetTrigger === prevResetTrigger || !prevResetTrigger) return;
        setAssetAddress("");
        setPickedAssetAddress("");
        onChange({ asset: undefined });
    }, [resetTrigger, prevResetTrigger, onChange]);

    useEffect(() => {
        setPicked(false);
    }, [pickedAssetAddress]);

    useEffect(() => {
        updateErrors({ basics: error ? t(error) : "" });
    }, [error, updateErrors, t]);

    useEffect(() => {
        if (!assetAddress) {
            setError("");
            return;
        }

        if (!isAddress(assetAddress)) setError("errors.notAnAddress");
        else if ((!assetInfo && !loadingAssetInfo) || assetInfoErrored)
            setError("errors.notSupported");
        else setError("");
    }, [assetAddress, assetInfo, assetInfoErrored, loadingAssetInfo]);

    function handleAssetOnChange(event: ChangeEvent<HTMLInputElement>) {
        const address = event.target.value as Address;
        setAssetAddress(address);
    }

    function handleAssetOnBlur() {
        setPickedAssetAddress(assetAddress);
    }

    const handleAssetOnPick = useCallback(() => {
        if (!assetInfo) return;

        setAssetAddress("");
        setPicked(true);
        setPopover(false);
        onChange({ asset: assetInfo });
    }, [assetInfo, onChange]);

    const handleAssetOnRemove = useCallback(() => {
        setAssetAddress("");
        setPickedAssetAddress("");
        onChange({ asset: undefined });
    }, [onChange]);

    return (
        <>
            <div ref={setAnchor} className={styles.root}>
                <TextInput
                    size="lg"
                    label={t("label")}
                    value={assetAddress || getErc20Name(asset)}
                    disabled={disabled}
                    error={!!error}
                    errorText={error ? t(error) : ""}
                    loading={loadingAssetInfo}
                    readOnly={!!asset}
                    onChange={handleAssetOnChange}
                    onBlur={handleAssetOnBlur}
                    prefixElement={
                        asset && (
                            <FungibleAssetLogo
                                chainId={chainId}
                                asset={asset}
                            />
                        )
                    }
                    noPrefixPadding
                    endAdornment={
                        asset && (
                            <TrashIcon
                                onClick={handleAssetOnRemove}
                                className={styles.trashIcon}
                            />
                        )
                    }
                    icon={!asset ? SearchIcon : undefined}
                />
            </div>
            <Popover
                ref={popoverRef}
                contained
                anchor={anchor}
                open={!picked && (!!assetInfo || popover)}
                onOpenChange={setPopover}
                placement="bottom-start"
                margin={4}
                className={styles.popover}
            >
                <div className={styles.asset} onClick={handleAssetOnPick}>
                    {assetInfo && (
                        <FungibleAsset chainId={chainId} asset={assetInfo} />
                    )}
                </div>
            </Popover>
        </>
    );
}
