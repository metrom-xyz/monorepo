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

    const resolvedIcon =
        !icon && chainData?.specialTokens && address
            ? chainData.specialTokens[address.toLowerCase() as Address]
            : undefined;

    const resolvedSrc =
        chainData && address
            ? chainData.rewardTokenIcons[address.toLowerCase() as Address]
            : undefined;

    return (
        <UiRemoteLogo
            address={address}
            {...rest}
            icon={icon || resolvedIcon}
            src={src || resolvedSrc}
        />
    );
}
