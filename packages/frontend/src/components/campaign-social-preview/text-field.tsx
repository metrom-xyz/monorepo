import type { ReactNode } from "react";

interface TextFieldProps {
    title: string;
    value?: ReactNode;
    light?: boolean;
}

export function TextField({ title, value, light }: TextFieldProps) {
    return (
        <div
            tw="flex h-[120px] w-[323px] flex-col justify-between px-6 py-3.5 bg-gray-100 rounded-3xl"
            style={{ gap: 16 }}
        >
            <span tw="text-[18px] text-gray-400 uppercase">{title}</span>
            {typeof value === "string" || typeof value === "number" ? (
                <span tw={`text-[30px] ${light && "text-[#9ca3af]"}`}>
                    {value}
                </span>
            ) : (
                value
            )}
        </div>
    );
}
