import { execSync } from "child_process";
import { Environment } from "@metrom-xyz/sdk";
import { Argument, Command } from "commander";
import chalk from "chalk";
import { readAuthTokens, SERVICE_URLS } from "./commons.js";

export const deploy = new Command("deploy")
    .addArgument(
        new Argument(
            "<environment>",
            "The environment to set the auth token for.",
        ).choices([Environment.Development, Environment.Production]),
    )
    .argument("<subgraphName>", "The subgraph name.")
    .argument("<label>", "The subgraph label.")
    .action(async function (environment, subgraphName, label) {
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

        if (!/([0-9]+)\.([0-9]+)\.([0-9]+)/.test(label)) {
            console.error(`The provided label ${label} is invalid`);
            process.exit(1);
        }

        const resolvedSubgraphName = `${subgraphName}-${label.replaceAll(".", "-")}`;

        try {
            execSync(
                `graph create ${resolvedSubgraphName} --node ${serviceUrls.graphNode.rpc} --access-token ${authToken}`,
                { stdio: "ignore" },
            );
        } catch {
            process.exit(1);
        }

        try {
            execSync(
                `graph deploy ${resolvedSubgraphName} --node ${serviceUrls.graphNode.rpc} --deploy-key ${authToken} --ipfs ${serviceUrls.ipfs} --headers '${JSON.stringify({ Authorization: `Bearer ${authToken}` })}' --version-label ${label}`,
                { stdio: ["ignore", "ignore", "inherit"] },
            );
        } catch {
            process.exit(1);
        }

        console.log();

        console.log(
            chalk.green(
                `Subgraph successfully deployed. Query endpoint: ${serviceUrls.graphNode.queries}/name/${resolvedSubgraphName}`,
            ),
        );
    });
