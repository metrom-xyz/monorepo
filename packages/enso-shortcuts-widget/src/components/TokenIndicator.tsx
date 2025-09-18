import {
    MOCK_IMAGE_URL,
    SupportedChainId,
    STARGATE_CHAIN_NAMES,
} from "../constants";
import { formatCompactUsd } from "../util";
import { Token } from "../types";
import { Typography } from "@metrom-xyz/ui";

const GECKO_HOSTNAME = "coingecko";

// uplift default image quality
const transformGeckoUrl = (originalUrl: string): string =>
    originalUrl.includes(GECKO_HOSTNAME)
        ? originalUrl.replace("/thumb/", "/large/")
        : originalUrl;

export const TokenIcon = ({
    token,
    chainId,
}: {
    token: Token;
    chainId?: SupportedChainId;
}) => (
    <div className="relative rounded-full min-w-8 min-h-8">
        <div className="rounded-full overflow-hidden w-8 h-8">
            <img
                src={
                    token?.logoURI
                        ? transformGeckoUrl(token?.logoURI)
                        : MOCK_IMAGE_URL
                }
                title={token?.symbol}
                alt={token?.symbol}
                className="w-full h-full rounded-full"
            />
        </div>
        {chainId && (
            <div className="absolute bottom-0 -right-0.5 w-4 h-4 rounded-full overflow-hidden border-white z-10">
                <img
                    src={`https://icons-ckg.pages.dev/stargate-light/networks/${STARGATE_CHAIN_NAMES[chainId]}.svg`}
                    alt={`Chain ${chainId}`}
                    className="w-full h-full rounded-full"
                />
            </div>
        )}
    </div>
);

export const TokenIndicator = ({
    token,
    chainId,
    size = "long",
    ...rest
}: {
    token?: Token;
    chainId?: SupportedChainId;
    pr?: number;
    size?: "short" | "long";
}) => (
    <div className="flex items-center gap-2 justify-between" {...rest}>
        {token?.symbol === "UNI-V2" && token.underlyingTokens ? (
            <div className="relative w-8 h-8">
                <div className="absolute w-full h-full overflow-hidden">
                    <TokenIcon
                        token={token.underlyingTokens[0]}
                        chainId={chainId}
                    />
                </div>
                <div className="absolute w-full h-full overflow-hidden">
                    <TokenIcon
                        token={token.underlyingTokens[1]}
                        chainId={chainId}
                    />
                </div>
            </div>
        ) : (
            <TokenIcon token={token} chainId={chainId} />
        )}

        <div className="flex flex-col">
            <div className="flex flex-col items-start">
                <Typography
                    weight="medium"
                    size="lg"
                    truncate
                    noWrap
                    className={
                        size === "short"
                            ? "overflow-hidden max-w-36"
                            : "overflow-hidden max-w-48"
                    }
                >
                    {token?.symbol}
                </Typography>
            </div>

            <div className="flex gap-2.5">
                {token.underlyingTokens?.length > 0 && (
                    <Typography
                        weight="medium"
                        light
                        size="xs"
                        noWrap
                        truncate
                        className="overflow-hidden max-w-48"
                    >
                        {token.underlyingTokens
                            .map((token) => token.symbol)
                            .join("/")}
                    </Typography>
                )}

                {token.type === "defi" && (
                    <div className="flex flex-col self-end">
                        {/* {token.apy && (
                            <div className="flex items-center gap-1">
                                <Typography light size="xs" weight="medium">
                                    APY
                                </Typography>
                                <Typography size="xs" weight="medium">
                                    {token.apy.toFixed(2)}%
                                </Typography>
                            </div>
                        )} */}
                        {token.tvl && (
                            <div className="flex items-center gap-1">
                                <Typography light size="xs" weight="medium">
                                    TVL
                                </Typography>
                                <Typography size="xs" weight="medium">
                                    {formatCompactUsd(token.tvl)}
                                </Typography>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    </div>
);
