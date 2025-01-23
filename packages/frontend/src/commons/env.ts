import { Environment } from "@metrom-xyz/sdk";

export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT as Environment;
if (
    !ENVIRONMENT ||
    !(Object.values(Environment) as string[]).includes(ENVIRONMENT)
)
    throw new Error("A valid NEXT_PUBLIC_ENVIRONMENT env variable is needed");

export const WALLETCONNECT_PROJECT_ID: string =
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;
if (ENVIRONMENT !== Environment.Development && !WALLETCONNECT_PROJECT_ID)
    throw new Error(
        "A valid NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID env variable is needed",
    );

export const FATHOM_SITE_ID: string = process.env.NEXT_PUBLIC_FATHOM_SITE_ID!;
