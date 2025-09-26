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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={src}
                    height={46}
                    width={46}
                    tw="absolute"
                    alt={defaultText}
                />
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
