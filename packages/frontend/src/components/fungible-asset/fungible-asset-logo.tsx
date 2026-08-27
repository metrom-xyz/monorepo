import type { Erc20Token } from "@metrom-xyz/sdk";
import { type RemoteLogoSize } from "@metrom-xyz/ui";
import { RemoteLogo } from "../remote-logo";
import { getErc20Protocol } from "@/src/utils/erc20";
import classNames from "classnames";
import { PoolRemoteLogo } from "../pool-remote-logo";

import styles from "./styles.module.css";

interface FungibleAssetLogoProps {
    chainId?: number;
    size?: RemoteLogoSize;
    asset: Erc20Token;
    forceProtocol?: boolean;
}

export function FungibleAssetLogo({
    chainId,
    size = "xxs",
    asset,
    forceProtocol = false,
}: FungibleAssetLogoProps) {
    if (!asset) return null;

    const ProtocolIcon = getErc20Protocol(asset)?.icon;

    if (forceProtocol && ProtocolIcon) {
        return (
            <ProtocolIcon
                className={classNames("logo", { [styles[size]]: size })}
            />
        );
    }

    if (asset.details?.type === "lp") {
        return (
            <PoolRemoteLogo
                chain={chainId}
                size={size}
                tokens={[
                    { address: asset.details.baseTokenAddress },
                    { address: asset.details.quoteTokenAddress },
                ]}
            />
        );
    }

    return (
        <RemoteLogo
            chain={chainId}
            address={asset.address}
            size={size}
            fallback={ProtocolIcon}
        />
    );
}
