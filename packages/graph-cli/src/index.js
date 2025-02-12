#!/usr/bin/env node

import { program } from "commander";
import { deploy } from "./deploy.js";
import { auth } from "./auth.js";

program
    .name("metrom-graph")
    .description("A CLI to deploy Metrom subgraphs")
    .addCommand(auth)
    .addCommand(deploy)
    .parse();
