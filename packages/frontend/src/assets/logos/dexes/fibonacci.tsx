import Image from "next/image";
import fibonacciLogo from "./fibonacci.webp";

export function FibonacciLogo(props: any) {
    return <Image {...props} src={fibonacciLogo} alt="Fibonacci logo" />;
}
