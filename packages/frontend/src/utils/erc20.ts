import { FUNGIBLE_ASSET_PROTOCOLS } from "@metrom-xyz/chains";
import type { Erc20Token } from "@metrom-xyz/sdk";

export function getErc20Protocol(asset: Erc20Token) {
    if (!asset.details) return undefined;

    return asset.details
        ? FUNGIBLE_ASSET_PROTOCOLS.find(({ id }) => {
              switch (asset.details?.type) {
                  case "lp":
                      return asset.details.dex === id;
                  case "protocol":
                      return asset.details.slug === id;
                  default:
                      return false;
              }
          })
        : undefined;
}

export function getErc20Name(asset?: Erc20Token) {
    if (!asset) return "";

    const protocol = getErc20Protocol(asset);
    if (!protocol) return `${asset.symbol} ${asset.name}`;

    if (asset.details && asset.details.type === "lp")
        return `${asset.details.baseTokenSymbol}/${asset.details.quoteTokenSymbol} ${protocol.name}`;

    return `${asset.symbol} ${asset.name}`;
}
