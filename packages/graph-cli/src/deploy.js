import { run } from "@graphprotocol/graph-cli";
import { Environment } from "@metrom-xyz/sdk";
import { Argument, Command } from "commander";
import { readAuthTokens, SERVICE_URLS } from "./commons";

export const deploy = new Command("deploy")
    .addArgument(
        new Argument(
            "<environment>",
            "The environment to set the auth token for.",
        ).choices([Environment.Development, Environment.Production]),
    )
    .argument("<subgraphName>", "The subgraph name.")
    .argument("<label>", "The subgraph label.")
    .action(async function (_, args) {
        const [environment, subgraphName, label] = args;

        const serviceUrls = SERVICE_URLS[environment];
        if (!serviceUrls) {
            console.error(`Invalid environment ${environment}`);
            process.exit(1);
        }

        const authToken = (await readAuthTokens())[environment];
        if (!authToken) {
            console.error(`Auth token missing for environment ${environment}`);
            process.exit(1);
        }

        run([
            "deploy",
            subgraphName,
            "--node",
            serviceUrls.graphNode,
            "--deploy-key",
            authToken,
            "--ipfs",
            serviceUrls.ipfs,
            "--version-label",
            label,
        ]);
    });
