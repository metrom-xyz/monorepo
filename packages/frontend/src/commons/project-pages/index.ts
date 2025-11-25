import type { ProjectPage } from "@/src/types/project-page-";
import { Environment } from "@metrom-xyz/sdk";

export const PROJECT_PAGES: Record<Environment, Record<string, ProjectPage>> = {
    [Environment.Development]: {},
    [Environment.Production]: {},
};
