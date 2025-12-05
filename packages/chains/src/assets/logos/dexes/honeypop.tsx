import honeypopLogo from "./honeypop.webp";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function HoneypopLogo(props: any) {
    return (
        <img
            {...props}
            src={honeypopLogo}
            alt="Honeypop logo"
            style={{ borderRadius: "100%" }}
        />
    );
}
