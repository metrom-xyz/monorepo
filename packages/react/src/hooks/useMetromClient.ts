import { useContext } from "react";
import { MetromContext } from "../context/metrom-provider";

export function useMetromClient() {
    const context = useContext(MetromContext);
    if (!context)
        throw new Error(
            "Missing metrom client, make sure to wrap your app with MetromProvider",
        );
    return context.client;
}
