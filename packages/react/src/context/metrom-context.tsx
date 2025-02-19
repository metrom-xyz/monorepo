import { MetromApiClient } from "@metrom-xyz/sdk";
import { createContext } from "react";

export const MetromContext = createContext<
    { client: MetromApiClient } | undefined
>(undefined);