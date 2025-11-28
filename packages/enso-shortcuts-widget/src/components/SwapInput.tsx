import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { type Address, isAddress } from "viem";
import TokenSelector from "../components/TokenSelector";
import { formatNumber, formatUSD, normalizeValue } from "../util";
import { useTokenBalance } from "../util/wallet";
import { useEnsoToken } from "../util/enso";
import { SupportedChainId } from "../constants";
import { type ProjectFilter } from "../types";
import { TextInput, Typography } from "@metrom-xyz/ui";
import { useDebounce } from "react-use";

const SwapInput = ({
    chainId,
    setChainId,
    tokenValue,
    tokenOnChange,
    inputValue,
    inputOnChange,
    usdValue,
    loading,
    disabled,
    portalRef,
    obligatedToken,
    limitTokens,
    excludeTokens,
    project,
    projects,
}: {
    chainId?: SupportedChainId;
    setChainId?: (chainId: SupportedChainId) => void;
    tokenValue: Address;
    tokenOnChange: (value: Address) => void;
    inputValue: string;
    inputOnChange: (value: string) => void;
    title?: string;
    usdValue?: number;
    disabled?: boolean;
    loading?: boolean;
    portalRef?: React.RefObject<HTMLDivElement>;
    obligatedToken?: boolean;
    limitTokens?: Address[];
    excludeTokens?: Address[];
    project?: string;
    projects?: ProjectFilter;
}) => {
    const { address } = useAccount();
    const balance = useTokenBalance(tokenValue, chainId);
    const {
        tokens: [tokenInInfo],
    } = useEnsoToken({
        address: tokenValue,
        enabled: !!isAddress(tokenValue),
        priorityChainId: chainId,
    });
    const [tempInputValue, setTempInputValue] = useState("");
    const [debouncedValue, setDebouncedValue] = useState("");

    useDebounce(
        () => {
            setDebouncedValue(tempInputValue);
        },
        400,
        [tempInputValue],
    );

    useEffect(() => {
        inputOnChange(debouncedValue);
    }, [debouncedValue, inputOnChange]);
    useEffect(() => {
        setTempInputValue(inputValue);
    }, [inputValue]);

    const balanceValue = normalizeValue(balance, tokenInInfo?.decimals ?? 18);

    const handleMaxOnClick = useCallback(() => {
        inputOnChange(
            normalizeValue(balance, tokenInInfo?.decimals).toString(),
        );
    }, [tokenInInfo?.decimals, balance, inputOnChange]);

    function handleInputOnChange(event: ChangeEvent<HTMLInputElement>) {
        setTempInputValue(event.target.value);
    }

    return (
        <div className="w-full flex flex-col gap-2 p-2 rounded-2xl border border-gray-500 min-h-[6.5rem]">
            <div className="flex w-full gap-2">
                <TokenSelector
                    project={project}
                    projectsFilter={projects}
                    setChainId={setChainId}
                    chainId={chainId}
                    limitTokens={limitTokens}
                    excludeTokens={excludeTokens}
                    obligatedToken={obligatedToken}
                    portalRef={portalRef}
                    value={tokenValue}
                    onChange={tokenOnChange}
                />

                <div className="flex w-full h-full justify-end items-center self-center">
                    {loading ? (
                        <div className="h-10 w-full max-w-40 surface-secondary rounded-md animate-pulse" />
                    ) : (
                        <TextInput
                            type="number"
                            size="lg"
                            disabled={disabled}
                            placeholder="0.0"
                            value={tempInputValue}
                            onChange={handleInputOnChange}
                            className="w-full max-w-44 [&>div>input]:h-16 [&>div>input]:text-right [&>div>input]:text-[1.75rem] [&>div]:bg-transparent! [&>div>input]:bg-transparent!"
                        />
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div
                    className={`flex items-center gap-2 ${address ? "visible" : "hidden"}`}
                >
                    <Typography weight="medium" size="sm" noWrap>
                        {formatNumber(balanceValue)} {tokenInInfo?.symbol}
                    </Typography>

                    <div className="rounded-sm px-1 surface-primary surface-secondary-hover hover:cursor-pointer transition-colors duration-200 ease-in-out">
                        <Typography
                            uppercase
                            weight="medium"
                            size="xs"
                            onClick={handleMaxOnClick}
                            className="text-[11px]!"
                        >
                            Max
                        </Typography>
                    </div>
                </div>

                {usdValue ? (
                    <Typography size="xs" weight="medium">
                        ~{formatUSD(usdValue)}
                    </Typography>
                ) : null}
            </div>
        </div>
    );
};

export default SwapInput;
