import type { Address } from "viem";

export interface RemoteLogoProps {
    address?: Address;
    chain?: string;
    sm?: boolean;
    lg?: boolean;
    xl?: boolean;
    xxl?: boolean;
    defaultText?: string | null;
}
