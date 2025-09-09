import { Environment } from "@metrom-xyz/sdk";

export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT as Environment;
if (
    !ENVIRONMENT ||
    !(Object.values(Environment) as string[]).includes(ENVIRONMENT)
)
    throw new Error("A valid NEXT_PUBLIC_ENVIRONMENT env variable is needed");

export const SAFE: boolean = process.env.NEXT_PUBLIC_SAFE === "true";

export const WALLETCONNECT_PROJECT_ID: string =
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;
if (!SAFE && !WALLETCONNECT_PROJECT_ID)
    throw new Error(
        "A valid NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID env variable is needed",
    );

export const FATHOM_SITE_ID: string = process.env.NEXT_PUBLIC_FATHOM_SITE_ID!;
export const APTOS: boolean = process.env.NEXT_PUBLIC_APTOS === "true";
export const APTOS_CLIENT_API_KEY: string | undefined =
    process.env.NEXT_PUBLIC_APTOS_CLIENT_API_KEY;
export const EXPERIMENTAL_CHAINS: number[] =
    process.env.NEXT_PUBLIC_EXPERIMENTAL_CHAINS?.split(",")
        .map((chain) => parseInt(chain.trim()))
        .filter(Boolean) || [];

export const ENSO_FINANCE_API_KEY: string =
    process.env.NEXT_PUBLIC_ENSO_FINANCE_API_KEY!;
if (!APTOS && !ENSO_FINANCE_API_KEY)
    throw new Error(
        "A valid NEXT_PUBLIC_ENSO_FINANCE_API_KEY env variable is needed",
    );
