import type { Address } from "viem";

export interface RemoteLogoProps {
    src?: string;
    address?: Address;
    chain?: string;
    sm?: boolean;
    lg?: boolean;
    xl?: boolean;
    xxl?: boolean;
    defaultText?: string | null;
}
