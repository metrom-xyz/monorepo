import curveLogo from "./curve.webp";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CurveLogo(props: any) {
    return <img {...props} src={curveLogo} alt="Curve logo" />;
}
