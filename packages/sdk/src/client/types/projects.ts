export interface BackendProject {
    campaigns: {
        active: number;
        total: number;
    };
}

export interface BackendProjectsResponse {
    projects: Record<string, BackendProject>;
}
