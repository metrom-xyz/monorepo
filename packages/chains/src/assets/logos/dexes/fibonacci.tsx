import fibonacciLogo from "./fibonacci.webp";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FibonacciLogo(props: any) {
    return <img {...props} src={fibonacciLogo} alt="Fibonacci logo" />;
}
