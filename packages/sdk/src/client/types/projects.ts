export interface BackendProject {
    slug: string;
    campaigns: {
        active: number;
        total: number;
    };
}

export interface BackendProjectsResponse {
    projects: BackendProject[];
}
