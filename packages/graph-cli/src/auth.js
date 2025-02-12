import { Environment } from "@metrom-xyz/sdk";
import { Argument, Command } from "commander";
import { readAuthTokens, writeAuthTokens } from "./commons.js";

export const auth = new Command("auth")
    .addArgument(
        new Argument(
            "<environment>",
            "The environment to set the auth token for.",
        ).choices([Environment.Development, Environment.Production]),
    )
    .addArgument(new Argument("<token>", "The auth token."))
    .action(async function (environment, token) {
        const tokens = await readAuthTokens();
        tokens[environment] = token;
        await writeAuthTokens(tokens);
        console.log("Auth token successfully stored");
    });
