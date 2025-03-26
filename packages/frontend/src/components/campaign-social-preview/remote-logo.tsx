import type { CSSProperties } from "react";

interface RemoteLogoProps {
    src?: string;
    defaultText?: string;
    style?: CSSProperties | undefined;
}

export function RemoteLogo({ src, defaultText = "?", style }: RemoteLogoProps) {
    if (src) {
        return (
            <div tw="flex relative h-14 w-14" style={style}>
                <img src={src} tw="absolute" alt={defaultText} />
            </div>
        );
    }

    return (
        <div
            tw="flex relative items-center justify-center rounded-full bg-[#27272a] h-14 w-14"
            style={style}
        >
            <span tw="text-white">
                {defaultText
                    ? defaultText.length > 4
                        ? `${defaultText.slice(0, 4)}`
                        : defaultText
                    : "?"}
            </span>
        </div>
    );
}
