import { program } from "commander";
import pkg from "../package.json";
import { deploy } from "./deploy";
import { auth } from "./auth";

program
    .name("metrom-graph")
    .description("A CLI to deploe Metrom subgraph")
    .version(pkg.version)
    .addCommand(auth)
    .addCommand(deploy)
    .parse();
