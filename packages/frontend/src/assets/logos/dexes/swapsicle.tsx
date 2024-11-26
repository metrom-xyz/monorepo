import Image from "next/image";
import swapsicleLogo from "./swapsicle.webp";

export function SwapsicleLogo(props: any) {
    return <Image {...props} src={swapsicleLogo} alt="Swapsicle logo" />;
}
