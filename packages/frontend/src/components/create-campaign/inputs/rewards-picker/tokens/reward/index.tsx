import type { WhitelistedErc20TokenAmount } from "@/src/types/common";
import type { Erc20Token, UsdPricedOnChainAmount } from "@metrom-xyz/sdk";
import { parseUnits, type Address } from "viem";
import type { RewardsPickerErrorMessage } from "..";
import { RemoteLogo } from "@/src/components/remote-logo";
import {
    Button,
    ErrorText,
    NumberInput,
    Popover,
    Typography,
    type NumberFormatValues,
} from "@metrom-xyz/ui";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatUsdAmount } from "@/src/utils/format";
import { TrashIcon } from "@/src/assets/trash-icon";
import { useWatchBalance } from "@/src/hooks/use-watch-balance";
import { useAccount } from "@/src/hooks/useAccount";
import classNames from "classnames";
import { MAX_U256 } from "@/src/commons";
import { useTranslations } from "next-intl";
import { useNumericFormat } from "react-number-format";

import styles from "./styles.module.css";

interface RewardProps {
    chainId?: number;
    value: WhitelistedErc20TokenAmount;
    error?: RewardsPickerErrorMessage;
    campaignDuration?: number;
    onUpdate: (updatedReward: WhitelistedErc20TokenAmount) => void;
    onRemove: (reward: Erc20Token) => void;
    onError: (address: Address, error?: RewardsPickerErrorMessage) => void;
}

export function Reward({
    chainId,
    value,
    error,
    campaignDuration,
    onUpdate,
    onRemove,
    onError,
}: RewardProps) {
    const [inputAmount, setInputAmount] = useState<NumberFormatValues>({
        floatValue: value.amount.formatted,
        formattedValue: value.amount.formatted.toString(),
        value: value.amount.formatted.toString(),
    });
    const [editingAmount, setEditingAmount] = useState(false);

    const [amountPopover, setAmountPopover] = useState(false);
    const [amountPopoverAnchor, setAmountPopoverAnchor] =
        useState<HTMLDivElement | null>(null);

    const [removeAssetPopover, setRemoveAssetPopover] = useState(false);
    const [removeAssetPopoverAnchor, setRemoveAssetPopoverAnchor] =
        useState<HTMLButtonElement | null>(null);

    const amountPopoverRef = useRef<HTMLDivElement>(null);
    const removeAssetPopoverRef = useRef<HTMLDivElement>(null);
    const hiddenSpanRef = useRef<HTMLSpanElement>(null);

    const { token, amount } = value;

    const t = useTranslations("newCampaign.inputs.rewardsPicker");
    const { address } = useAccount();
    const { balance: rewardTokenBalance } = useWatchBalance({
        address,
        token: token.address,
    });
    const { format } = useNumericFormat({
        type: "text",
        thousandSeparator: " ",
        decimalSeparator: ".",
        value: inputAmount.value,
        allowNegative: false,
    });

    useEffect(() => {
        if (!format || !hiddenSpanRef.current) return;
        hiddenSpanRef.current.textContent = format(inputAmount.formattedValue);
    }, [inputAmount.formattedValue, format]);

    useEffect(() => {
        if (!campaignDuration) return;

        if (!amount.formatted) {
            onError(token.address, "errors.lowDistributionRate");
            return;
        }

        const distributionRate = (amount.formatted * 3_600) / campaignDuration;
        const balance =
            rewardTokenBalance === undefined ? MAX_U256 : rewardTokenBalance;

        const error =
            amount.raw > balance
                ? "errors.insufficientBalance"
                : distributionRate < token.minimumRate.formatted
                  ? "errors.lowDistributionRate"
                  : "";

        onError(token.address, error);
    }, [campaignDuration, token, amount, rewardTokenBalance, onError]);

    function handleInputOnClick() {
        setEditingAmount(true);
    }

    const handleInputOnChange = useCallback(
        (value: NumberFormatValues) => {
            if (!hiddenSpanRef.current || !format) return;

            setInputAmount(value);
            hiddenSpanRef.current.textContent = format(value.formattedValue);
        },
        [format],
    );

    const handleAmountOnBlur = useCallback(() => {
        setEditingAmount(false);

        const rawNewAmount = parseUnits(inputAmount.value, token.decimals);
        const newFormattedNewAmount = inputAmount.floatValue;

        const newAmount: UsdPricedOnChainAmount = {
            raw: rawNewAmount,
            formatted: newFormattedNewAmount || 0,
            usdValue: (newFormattedNewAmount || 0) * token.usdPrice,
        };

        if (newAmount.raw === amount.raw) return;

        onUpdate({
            token,
            amount: newAmount || {
                raw: 0n,
                formatted: 0,
                usdValue: 0,
            },
        });
    }, [onUpdate, inputAmount, amount, token]);

    const handleOnRemove = useCallback(() => {
        onError(token.address, "");
        onRemove(token);
    }, [token, onError, onRemove]);

    function handleAmountPopoverOpen() {
        setAmountPopover(true);
    }

    function handleAmountPopoverClose() {
        setAmountPopover(false);
    }

    function handleRemoveAssetPopoverOpen() {
        setRemoveAssetPopover(true);
    }

    function handleRemoveAssetPopoverClose() {
        setRemoveAssetPopover(false);
    }

    return (
        <div className={styles.root}>
            <div
                className={classNames(styles.wrapper, {
                    [styles.error]: !!error,
                })}
            >
                <div className={styles.token}>
                    <RemoteLogo
                        size="xxs"
                        address={token.address}
                        chain={chainId}
                    />
                    <Typography weight="medium">{token.symbol}</Typography>
                </div>
                <Popover
                    ref={amountPopoverRef}
                    open={amountPopover && !editingAmount}
                    anchor={amountPopoverAnchor}
                    placement="top"
                    onOpenChange={setAmountPopover}
                    margin={6}
                    className={styles.popover}
                >
                    <Typography size="xs">{t("editAmount")}</Typography>
                </Popover>
                <div className={styles.inputWrapper}>
                    <NumberInput
                        size="lg"
                        ref={setAmountPopoverAnchor}
                        value={amount?.formatted}
                        placeholder="0"
                        error={!!error}
                        allowNegative={false}
                        readOnly={!editingAmount}
                        onValueChange={handleInputOnChange}
                        onClick={handleInputOnClick}
                        onBlur={handleAmountOnBlur}
                        onMouseEnter={handleAmountPopoverOpen}
                        onMouseLeave={handleAmountPopoverClose}
                        style={{
                            width: `${hiddenSpanRef?.current?.offsetWidth}px`,
                        }}
                        className={classNames(styles.input, {
                            [styles.editing]: editingAmount,
                        })}
                    />
                    <span ref={hiddenSpanRef} className={styles.hiddenSpan}>
                        {format && format(inputAmount.formattedValue)}
                    </span>
                </div>
                <Typography size="xs" variant="tertiary">
                    {`(${formatUsdAmount({ amount: amount.usdValue })})`}
                </Typography>
                <Popover
                    ref={removeAssetPopoverRef}
                    open={removeAssetPopover}
                    anchor={removeAssetPopoverAnchor}
                    placement="top"
                    onOpenChange={setRemoveAssetPopover}
                    margin={6}
                    className={styles.popover}
                >
                    <Typography size="xs">{t("removeAsset")}</Typography>
                </Popover>
                <Button
                    ref={setRemoveAssetPopoverAnchor}
                    size="sm"
                    variant="secondary"
                    border={false}
                    icon={TrashIcon}
                    onClick={handleOnRemove}
                    onMouseEnter={handleRemoveAssetPopoverOpen}
                    onMouseLeave={handleRemoveAssetPopoverClose}
                    className={{
                        root: styles.removeButton,
                    }}
                />
            </div>
            {error && (
                <ErrorText size="xs" uppercase={false}>
                    {t(error)}
                </ErrorText>
            )}
        </div>
    );
}
