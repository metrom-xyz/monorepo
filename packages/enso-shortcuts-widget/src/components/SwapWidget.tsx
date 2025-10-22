import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSwitchChain, useAccount } from "wagmi";
import { type Address, isAddress } from "viem";
import { mainnet } from "viem/chains";
import {
    useEnsoApprove,
    useEnsoData,
    useEnsoPrice,
    useEnsoToken,
} from "../util/enso";
import {
    denormalizeValue,
    formatNumber,
    formatUSD,
    normalizeValue,
} from "../util";
import { useApproveIfNecessary, useTokenBalance } from "../util/wallet";
import { getChainName, usePriorityChainId } from "../util/common";
import {
    DEFAULT_SLIPPAGE,
    ERROR_MSG,
    ETH_ADDRESS,
    LP_REDIRECT_TOKENS,
    MAINNET_ZAP_INPUT_TOKENS,
    PRICE_IMPACT_WARN_THRESHOLD,
    SWAP_LIMITS,
    SWAP_REDIRECT_TOKENS,
} from "../constants";
import { useStore } from "../store";
// import RouteIndication from "../components/RouteIndication";
import {
    NotifyType,
    ObligatedToken,
    Token,
    type WidgetComponentProps,
} from "../types";
import {
    Accordion,
    Button,
    InfoTooltip,
    Skeleton,
    Typography,
} from "@metrom-xyz/ui";
import Notification from "./Notification";
import SwapInput from "./SwapInput";
import Slippage from "./Slippage";
import { ErrorIcon } from "../assets/error";
import { ArrowRightIcon } from "../assets/arrow-right";
import { WalletIcon } from "../assets/wallet";

const BridgingFee = ({
    gasValue,
    chainId,
}: {
    gasValue: string;
    chainId: number;
}) => {
    const { data: nativeTokenPriceData } = useEnsoPrice(ETH_ADDRESS, chainId);
    const {
        tokens: [nativeTokenInfo],
    } = useEnsoToken({
        address: ETH_ADDRESS,
        priorityChainId: chainId,
        enabled: !!chainId,
    });

    const gasCostUSD = +gasValue * +(nativeTokenPriceData?.price ?? 0);

    return (
        <div className="flex gap-1 items-center">
            <Typography uppercase variant="tertiary"size="xs" weight="medium">
                Bridging fee:
            </Typography>
            {nativeTokenInfo && gasCostUSD ? (
                <>
                    <Typography size="xs" weight="medium">
                        {formatNumber(gasValue, true)} {nativeTokenInfo?.symbol}
                    </Typography>
                    <Typography size="xs" weight="medium" variant="tertiary">
                        {formatUSD(gasCostUSD)}
                    </Typography>
                </>
            ) : (
                <Skeleton size="xs" width={120} />
            )}
        </div>
    );
};

const PriceImpact = ({
    shouldWarnPriceImpact,
    formattedPriceImpact,
    priceImpactWarning,
}: {
    shouldWarnPriceImpact: boolean;
    formattedPriceImpact: string;
    priceImpactWarning: string;
}) => {
    return (
        <div className="flex">
            <div className="flex items-center gap-1">
                <Typography
                    uppercase
                    weight="medium"
                    size="xs"
                    className={`${shouldWarnPriceImpact ? "text-orange-400!" : ""}`}
                >
                    Price impact: {formattedPriceImpact}%
                </Typography>
                {shouldWarnPriceImpact && (
                    <InfoTooltip
                        trigger="hover"
                        icon={
                            <ErrorIcon
                                height={14}
                                width={14}
                                className="text-orange-400"
                            />
                        }
                        placement="right-start"
                    >
                        <div className="max-w-72! p-1">
                            <Typography size="sm" weight="medium">
                                {priceImpactWarning}
                            </Typography>
                        </div>
                    </InfoTooltip>
                )}
            </div>
        </div>
    );
};

const AccordionTitle = ({
    tokenInInfo,
    tokenOutInfo,
    exchangeRate,
    priceImpactValue,
    shouldWarnPriceImpact,
    formattedPriceImpact,
    priceImpactWarning,
}: {
    tokenInInfo?: Token;
    tokenOutInfo?: Token;
    exchangeRate: number;
    priceImpactValue: number;
    shouldWarnPriceImpact: boolean;
    formattedPriceImpact: string;
    priceImpactWarning: string;
}) => {
    if (shouldWarnPriceImpact && typeof priceImpactValue === "number")
        return (
            <PriceImpact
                shouldWarnPriceImpact
                formattedPriceImpact={formattedPriceImpact}
                priceImpactWarning={priceImpactWarning}
            />
        );

    return tokenInInfo && tokenOutInfo ? (
        <Typography weight="medium" size="xs">
            1 {tokenInInfo.symbol} = {formatNumber(exchangeRate, true)}{" "}
            {tokenOutInfo.symbol}
        </Typography>
    ) : (
        <Skeleton size="xs" width={130} />
    );
};

const SwapWidget = ({
    referralCode,
    tokenOut: providedTokenOut,
    tokenIn: providedTokenIn,
    obligateSelection,
    // enableShare,
    // indicateRoute,
    rotateObligated,
    outProject,
    outProjects,
    inProjects,
    outTokens,
    inTokens,
    onSuccess,
    onConnectWallet,
}: WidgetComponentProps) => {
    const [tokenIn, setTokenIn] = useState<Address>();
    const [valueIn, setValueIn] = useState("");
    const [warningAccepted, setWarningAccepted] = useState(false);
    const [tokenOut, setTokenOut] = useState<Address>();
    const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE);
    const [obligatedToken, setObligatedToken] = useState(
        obligateSelection && (rotateObligated ?? ObligatedToken.TokenOut),
    );

    const chainId = usePriorityChainId();
    const { chainId: wagmiChainId, address } = useAccount();
    const setOutChainId = useStore((state) => state.setTokenOutChainId);
    const outChainId = useStore((state) => state.tokenOutChainId ?? chainId);
    const obligatedChainId = useStore((state) => state.obligatedChainId);

    const { switchChain } = useSwitchChain();
    const setNotification = useStore((state) => state.setNotification);
    const setObligatedChainId = useStore((state) => state.setObligatedChainId);

    const {
        tokens: [tokenInInfo],
    } = useEnsoToken({
        address: tokenIn,
        enabled: isAddress(tokenIn),
    });
    const {
        tokens: [tokenOutInfo],
    } = useEnsoToken({
        address: tokenOut,
        priorityChainId: outChainId,
        enabled: isAddress(tokenOut),
    });
    // Handle internal token state changes and call parent callback

    const setFromChainId = useCallback(
        (newChainId: number) => {
            setObligatedChainId(newChainId);
            // We'll notify parent after state is updated via effect
            if (chainId === wagmiChainId) {
                switchChain({ chainId: newChainId });
            }
            if (!tokenOut) {
                setOutChainId(newChainId);
            }
        },
        [wagmiChainId, chainId, switchChain, tokenOut],
    );

    // Initialize tokens when provided or when chainId changes
    useEffect(() => {
        if (providedTokenIn) {
            setTokenIn(providedTokenIn);
        } else if (!tokenIn && !inTokens?.exclude?.includes(ETH_ADDRESS)) {
            setTokenIn(ETH_ADDRESS);
        }
    }, [providedTokenIn]);

    useEffect(() => {
        if (providedTokenOut) {
            setTokenOut(providedTokenOut);
        }
    }, [providedTokenOut]);

    // reset warning if token changes
    useEffect(() => {
        setWarningAccepted(false);
    }, [tokenIn, tokenOut]);

    // Handle chain changes from outside the component
    useEffect(() => {
        if (obligatedChainId && obligatedChainId !== chainId) {
            // Update internal state to match external state
            if (chainId === wagmiChainId) {
                switchChain({ chainId: obligatedChainId });
            }
        }
    }, [obligatedChainId, chainId, wagmiChainId, switchChain]);

    const amountIn = denormalizeValue(valueIn, tokenInInfo?.decimals);

    const onSuccessCallback = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (hash: string, details: any) => {
            onSuccess?.(hash, details);
            setValueIn("");
        },
        [onSuccess],
    );

    const {
        data: routerData,
        isLoading: routerLoading,
        isFetching: routerIsFetching,
        sendTransaction,
        error,
    } = useEnsoData(
        amountIn,
        tokenIn,
        tokenOut,
        slippage,
        referralCode,
        onSuccessCallback,
    );

    const valueOut = normalizeValue(
        routerData?.amountOut.toString(),
        tokenOutInfo?.decimals,
    );

    const approveData = useEnsoApprove(tokenIn, amountIn);
    const approve = useApproveIfNecessary(
        tokenIn,
        approveData.data?.spender,
        amountIn,
    );
    const balance = useTokenBalance(tokenIn, chainId);
    const isBalanceEnough = +amountIn <= +(balance ?? 0);

    const approveNeeded = Boolean(approve && tokenIn) && isBalanceEnough;
    const wrongChain = chainId && +wagmiChainId !== +chainId;

    const portalRef = useRef<HTMLDivElement>(null);

    const exchangeRate = +valueOut / +valueIn;

    const { data: inUsdPrice } = useEnsoPrice(tokenIn);
    const { data: outUsdPrice } = useEnsoPrice(tokenOut, outChainId);

    const tokenInUsdPrice = +(inUsdPrice?.price ?? 0) * +valueIn;
    const tokenOutUsdPrice =
        +(outUsdPrice?.price ?? 0) *
        +normalizeValue(
            routerData?.amountOut?.toString(),
            tokenOutInfo?.decimals,
        );

    const priceImpactValue = useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const backendPriceImpact = (routerData as any)?.priceImpact;
        if (typeof backendPriceImpact === "number") {
            return backendPriceImpact;
        }
        if (
            tokenInUsdPrice > 0 &&
            tokenOutUsdPrice >= 0 &&
            routerData?.amountOut
        ) {
            let priceImpact =
                ((tokenInUsdPrice - tokenOutUsdPrice) / tokenInUsdPrice) *
                10000;
            priceImpact = Math.max(0, priceImpact);
            return priceImpact;
        }
    }, [routerData, tokenInUsdPrice, tokenOutUsdPrice]);

    useEffect(() => {
        if (SWAP_REDIRECT_TOKENS.includes(providedTokenOut)) {
            setNotification({
                variant: NotifyType.Blocked,
                message: "Go direct to Uniswap interface",
                link:
                    "https://app.uniswap.org/swap?outputCurrency=" +
                    providedTokenOut,
            });
        } else if (LP_REDIRECT_TOKENS[providedTokenOut]) {
            setNotification({
                variant: NotifyType.Blocked,
                message: "Go direct to Uniswap interface",
                link: LP_REDIRECT_TOKENS[providedTokenOut],
            });
        }
    }, [providedTokenOut, setNotification]);

    const shouldWarnPriceImpact =
        typeof priceImpactValue === "number" &&
        priceImpactValue >= PRICE_IMPACT_WARN_THRESHOLD;

    const needToAcceptWarning = shouldWarnPriceImpact && !warningAccepted;
    const swapLimitExceeded = tokenInUsdPrice > SWAP_LIMITS[tokenOut];
    const swapDisabled =
        !!approve ||
        wrongChain ||
        !(+routerData?.amountOut > 0) ||
        swapLimitExceeded ||
        !isBalanceEnough;

    const swapWarning = useMemo(() => {
        if (swapLimitExceeded)
            return `Due to insufficient underlying liquidity, trade sizes are restricted to ${formatUSD(SWAP_LIMITS[tokenOut])}. You can do multiple transactions of this size.`;
        if (!isBalanceEnough) return "Not enought balance";
        if (wrongChain) return "Wrong chain";
        if (approveNeeded) return "Approve token first";
        return "";
    }, [
        swapLimitExceeded,
        isBalanceEnough,
        wrongChain,
        approveNeeded,
        swapDisabled,
        tokenOut,
    ]);

    const formattedPriceImpact = priceImpactValue
        ? (-priceImpactValue / 100).toFixed(2)
        : "0.00";
    const priceImpactWarning = shouldWarnPriceImpact
        ? `High price impact (${formattedPriceImpact}%). Due to the amount of ${tokenOutInfo?.symbol} liquidity currently available, the more ${tokenInInfo?.symbol} you try to swap, the less ${tokenOutInfo?.symbol} you will receive.`
        : "";

    const showPriceImpactWarning = useCallback(() => {
        setNotification({
            message: priceImpactWarning,
            variant: NotifyType.Warning,
        });
        setWarningAccepted(true);
    }, [priceImpactWarning, setNotification]);

    const handleOnConnect = useCallback(async () => {
        if (!onConnectWallet) return;
        onConnectWallet();
    }, [onConnectWallet]);

    const handleInvertTokensOnClick = useCallback(() => {
        const tempTokenIn = tokenIn;

        if (obligateSelection)
            setObligatedToken((val) =>
                val === ObligatedToken.TokenIn
                    ? ObligatedToken.TokenOut
                    : ObligatedToken.TokenIn,
            );

        const tempChainId = chainId;

        setObligatedChainId(outChainId);
        setOutChainId(tempChainId);
        setTokenIn(tokenOut);
        setTokenOut(tempTokenIn);
        setValueIn(valueOut);
    }, [tokenIn, obligateSelection, chainId, outChainId, tokenOut, valueOut]);

    const limitInputTokens =
        chainId === mainnet.id && tokenOutInfo?.symbol === "UNI-V2";
    const displayTokenRotation =
        !obligateSelection ||
        rotateObligated ||
        typeof rotateObligated === "number";

    const gasValue = useMemo(() => {
        let txCost = +(routerData?.tx.value ?? 0);
        if (tokenIn === ETH_ADDRESS) {
            txCost -= +amountIn;
        }

        return normalizeValue(Math.max(0, txCost).toString(), 18);
    }, [routerData?.tx?.value, tokenIn, amountIn]);

    const isBridging = Boolean(chainId !== outChainId && outChainId);

    return (
        <div className="relative w-full">
            {/* Portal for notifications and swap popover */}
            <div ref={portalRef} className="absolute ">
                <Notification />
            </div>
            <div className="flex flex-col gap-2.5">
                <div className="relative flex flex-col gap-2.5">
                    <SwapInput
                        chainId={chainId}
                        projects={inProjects}
                        setChainId={setFromChainId}
                        limitTokens={
                            limitInputTokens && MAINNET_ZAP_INPUT_TOKENS
                        }
                        excludeTokens={inTokens?.exclude}
                        obligatedToken={
                            obligatedToken === ObligatedToken.TokenIn
                        }
                        portalRef={portalRef}
                        tokenValue={tokenIn}
                        tokenOnChange={setTokenIn}
                        inputValue={valueIn}
                        inputOnChange={setValueIn}
                        usdValue={tokenInUsdPrice}
                    />

                    {displayTokenRotation && (
                        <div
                            onClick={handleInvertTokensOnClick}
                            className="flex justify-center items-center absolute top-[43%] place-self-center rounded-full p-1 dark:bg-dark-surface-primary bg-white hover:bg-zinc-200! hover:dark:bg-zinc-700! hover:cursor-pointer transition-colors duration-200 ease-in-out z-10"
                        >
                            <ArrowRightIcon
                                height={24}
                                width={24}
                                className="text-primary rotate-90"
                            />
                        </div>
                    )}

                    <SwapInput
                        disabled
                        project={outProject}
                        projects={outProjects}
                        chainId={outChainId}
                        setChainId={setOutChainId}
                        limitTokens={outTokens?.include}
                        excludeTokens={outTokens?.exclude}
                        obligatedToken={
                            obligatedToken === ObligatedToken.TokenOut
                        }
                        loading={routerLoading || routerIsFetching}
                        portalRef={portalRef}
                        tokenValue={tokenOut}
                        tokenOnChange={setTokenOut}
                        inputValue={valueOut?.toString()}
                        inputOnChange={() => {}}
                        usdValue={tokenOutUsdPrice}
                    />
                </div>

                {address ? (
                    <div className="flex w-full gap-2.5">
                        {wrongChain ? (
                            <Button
                                onClick={() => switchChain({ chainId })}
                                className={{ root: "w-full!" }}
                            >
                                Switch to {getChainName(chainId)}
                            </Button>
                        ) : (
                            approveNeeded && (
                                <Button
                                    loading={approve.isPending}
                                    onClick={approve.write}
                                    className={{ root: "w-full!" }}
                                >
                                    Approve
                                </Button>
                            )
                        )}

                        <Button
                            disabled={swapDisabled}
                            loading={
                                sendTransaction.isPending ||
                                routerLoading ||
                                routerIsFetching
                            }
                            onClick={
                                needToAcceptWarning
                                    ? showPriceImpactWarning
                                    : sendTransaction.sendTransaction
                            }
                            className={{ root: "w-full!" }}
                        >
                            {swapWarning
                                ? swapWarning
                                : chainId === outChainId
                                  ? "Swap"
                                  : "Bridge"}
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-center items-center w-full">
                        <Button
                            icon={WalletIcon}
                            iconPlacement="right"
                            className={{ root: "w-full!" }}
                            onClick={handleOnConnect}
                        >
                            Connect wallet
                        </Button>
                    </div>
                )}

                <Accordion
                    title={
                        <AccordionTitle
                            tokenInInfo={tokenInInfo}
                            tokenOutInfo={tokenOutInfo}
                            exchangeRate={exchangeRate}
                            formattedPriceImpact={formattedPriceImpact}
                            priceImpactValue={priceImpactValue}
                            priceImpactWarning={priceImpactWarning}
                            shouldWarnPriceImpact={shouldWarnPriceImpact}
                        />
                    }
                    className="[&>.preview]:p-2! [&>.preview]:gap-2.5! [&>.preview]:rounded-xl!"
                >
                    <div className="flex flex-col gap-2.5 p-2">
                        <div className="flex flex-col justify-start gap-2.5">
                            {isBridging && (
                                <BridgingFee
                                    gasValue={gasValue}
                                    chainId={chainId}
                                />
                            )}

                            {!shouldWarnPriceImpact && (
                                <PriceImpact
                                    formattedPriceImpact={formattedPriceImpact}
                                    priceImpactWarning={priceImpactWarning}
                                    shouldWarnPriceImpact={false}
                                />
                            )}

                            <Slippage
                                slippage={slippage}
                                setSlippage={setSlippage}
                            />
                        </div>
                    </div>
                </Accordion>

                {error && (
                    <Typography
                        uppercase
                        size="xs"
                        weight="medium"
                        className="text-red-600! text-center"
                    >
                        {!!error.message && ERROR_MSG}
                    </Typography>
                )}

                {/* TODO: add route indication */}
                {/* {indicateRoute && (
          <div>
            <Typography size="xs" noWrap onClick={toggleRoute}>
              {showRoute ? "Hide" : "Show"} route
            </Typography>
            {showRoute && (
              <RouteIndication
                route={routerData?.route}
                loading={routerLoading}
              />
            )}
          </div>
        )} */}

                <div className="flex w-full">
                    {
                        // enableShare && "TODO: add cliboard share"
                        // <Box color={"gray.500"}>
                        //   <ClipboardRoot value={window.location.href} position={"absolute"}>
                        //     <ClipboardLink textStyle={"xs"} cursor={"pointer"} />
                        //   </ClipboardRoot>
                        // </Box>
                    }
                    <div className="w-full flex items-center justify-center">
                        <Typography
                            uppercase
                            weight="medium"
                            size="xs"
                            className="text-[10px]! leading-2.5!"
                        >
                            Powered by{" "}
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://www.enso.build/"
                                color="fg.muted"
                            >
                                Enso
                            </a>{" "}
                            and{" "}
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://stargate.finance/"
                                color="fg.muted"
                            >
                                Stargate
                            </a>
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SwapWidget;
