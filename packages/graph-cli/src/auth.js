import { Environment } from "@metrom-xyz/sdk";
import { Argument, Command } from "commander";
import { readAuthTokens, writeAuthTokens } from "./commons";

export const auth = new Command("auth")
    .addArgument(
        new Argument(
            "<environment>",
            "The environment to set the auth token for.",
        ).choices([Environment.Development, Environment.Production]),
    )
    .argument("<token>", "The auth token.")
    .action(async function (_, args) {
        const [environment, token] = args;
        const tokens = await readAuthTokens();
        tokens[environment] = token;
        writeAuthTokens(tokens);
    });
