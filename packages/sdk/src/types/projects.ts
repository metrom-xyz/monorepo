export interface Project {
    slug: string;
    campaigns: {
        active: number;
        total: number;
    };
}
