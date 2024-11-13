import Image from "next/image";
import baseSwapLogo from "./baseswap.webp";

export function BaseSwapLogo(props: any) {
    return <Image {...props} src={baseSwapLogo} alt="BaseSwap logo" />;
}
