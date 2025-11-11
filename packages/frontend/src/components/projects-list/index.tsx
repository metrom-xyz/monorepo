import { ProjectCard } from "../project-card";
import { useProjects } from "@/src/hooks/useProjects";
import { LoadingBar } from "../loading-bar";
import { PROJECTS_METADATA } from "@/src/commons/projects";

import styles from "./styles.module.css";

const PAGE_SIZE = 10;

// const URL_ENABLED_FILTERS = ["chains"];

export function ProjectsList() {
    // const [pageNumber, setPageNumber] = useState(1);

    // const router = useRouter();
    // const searchParams = useSearchParams();
    // const filterOptions = useCampaignsFiltersOptions();

    // useEffect(() => {
    //     // Avoid clearing the filters the first time, otherwise the query params
    //     // get removed.
    //     if ((!prevType && type) || prevType === type) return;
    //     handleClearFilters();
    // }, [handleClearFilters, prevType, type]);

    // const initialFilters = useMemo(() => {
    //     const queryFilters: Record<string, string> = {};
    //     URL_ENABLED_FILTERS.forEach((filter) => {
    //         const value = searchParams.get(filter);
    //         if (!value) return;
    //         queryFilters[filter] = value;
    //     });

    //     const filters: RawFilters = {
    //         chains: [],
    //         protocols: [],
    //         statuses: [],
    //     };

    //     Object.entries(queryFilters).forEach(([key, value]) => {
    //         if (key === "chains")
    //             filters.chains = filterOptions.chainOptions.filter((option) =>
    //                 value.split(",").includes(option.query),
    //             );
    //     });

    //     return filters;
    // }, [searchParams, filterOptions.chainOptions]);

    // const [rawFilters, setRawFilters] = useState<RawFilters>(initialFilters);
    // const [debouncedRawFilters, setDebouncedRawFilters] =
    //     useState<RawFilters>(initialFilters);

    const { loading, fetching, placeholderData, projects } = useProjects({
        page: 1,
        pageSize: PAGE_SIZE,
    });

    return (
        <div className={styles.root}>
            <LoadingBar
                loading={placeholderData && fetching}
                className={styles.loadingBar}
            />
            <div className={styles.list}>
                {loading ? (
                    <div></div>
                ) : !projects || projects.length === 0 ? (
                    <div>empty</div>
                ) : (
                    projects.map((project) => {
                        const { name } = project;

                        const metadata = PROJECTS_METADATA[name];

                        return (
                            <ProjectCard
                                key={name}
                                href={`/projects/${name}`}
                                {...project}
                                name={metadata.name}
                                icon={metadata.icon}
                                illustration={metadata.illustration}
                                branding={metadata.branding}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}
