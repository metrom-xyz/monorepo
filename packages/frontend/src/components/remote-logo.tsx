import { useEffect, useState } from "react";
import {
    RemoteLogo as UiRemoteLogo,
    type RemoteLogoProps,
} from "@metrom-xyz/ui";
import { type Address } from "viem";
import { useChainData } from "@/src/hooks/useChainData";

export function RemoteLogo({
    address,
    chain,
    icon,
    src,
    ...rest
}: RemoteLogoProps) {
    const chainData = useChainData(chain);

    const [localTokenLogoSrc, setLocalTokenLogoSrc] = useState<string | null>(
        null,
    );

    const resolvedIcon =
        !icon && chainData?.specialTokens && address
            ? chainData.specialTokens[address.toLowerCase() as Address]
            : undefined;

    const resolvedSrc =
        chainData && address
            ? chainData.rewardTokenIcons[address.toLowerCase() as Address]
            : undefined;

    useEffect(() => {
        if (!!icon || !!src || !address || !chain) {
            return;
        }

        const TokenLogoKey = `${address.toLowerCase()}-${chain}`;
        const tokenLogoMap = JSON.parse(
            localStorage.getItem("tokenLogos") || "{}",
        );

        if (!tokenLogoMap || !tokenLogoMap[TokenLogoKey]) {
            return;
        }

        setLocalTokenLogoSrc(tokenLogoMap[TokenLogoKey]);
    }, [address, chain, icon, src]);

    return (
        <UiRemoteLogo
            address={address}
            {...rest}
            icon={icon || resolvedIcon}
            src={src || localTokenLogoSrc || resolvedSrc}
        />
    );
}
