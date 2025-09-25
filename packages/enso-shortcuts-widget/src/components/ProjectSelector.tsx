import { useCallback, useMemo } from "react";
import { useChainProtocols } from "../util/enso";
import { SupportedChainId } from "../constants";
import { ProjectFilter } from "../types";
import { Select, SelectOption, Typography } from "@metrom-xyz/ui";

export const capitalize = (str?: string) =>
    str?.slice(0, 1).toUpperCase() + str?.slice(1);

// Simple protocol icon component
const ProtocolIcon = ({ logoUri }: { logoUri?: string }) => (
    <div className="flex items-center justify-center rounded-[50%] overflow-hidden w-7 h-7 mr-2">
        {logoUri && <img src={logoUri} alt="" width={"28px"} height={"28px"} />}
    </div>
);

const ProjectSelector = ({
    value,
    onChange,
    chainId,
    disabled,
    projectsFilter,
}: {
    value: string;
    onChange: (value: string) => void;
    chainId?: SupportedChainId;
    disabled?: boolean;
    projectsFilter?: ProjectFilter;
}) => {
    const protocols = useChainProtocols(chainId);
    const projectOptions: SelectOption<string>[] = useMemo(() => {
        if (!protocols) return [{ value: "", label: "" }];

        let availableProjects = protocols;

        if (projectsFilter?.include?.length > 0) {
            availableProjects = availableProjects?.filter((p) =>
                projectsFilter.include.includes(p.projectId),
            );
        }
        if (projectsFilter?.exclude?.length > 0) {
            availableProjects = availableProjects?.filter(
                (p) => !projectsFilter.exclude.includes(p.projectId),
            );
        }

        const options = availableProjects
            ?.sort((a, b) => a.projectId?.localeCompare(b.projectId))
            .map((project) => ({
                // FIXME: not the best solution
                value: `${project.projectId}_${project.logosUri[0]}`,
                label: capitalize(project.projectId),
            }));

        return [{ value: "", label: "All" }].concat(options);
    }, [protocols, projectsFilter]);

    const onSelectChange = useCallback(
        (option: SelectOption<string>) => {
            onChange(option.value);
        },
        [onChange],
    );

    return (
        <Select
            messages={{ noResults: "Nothing here" }}
            loading={!projectOptions}
            disabled={disabled}
            options={projectOptions}
            value={value}
            search
            onChange={onSelectChange}
            renderOption={(option) => {
                const [, logoUri] = option.value.split("_");

                return (
                    <div className="flex items-center gap-2 rounded-lg">
                        {logoUri && <ProtocolIcon logoUri={logoUri} />}
                        <Typography
                            weight="medium"
                            autoCapitalize="on"
                            noWrap
                            truncate
                            className="overflow-hidden max-w-24"
                        >
                            {option.label}
                        </Typography>
                    </div>
                );
            }}
            className="[&>.root>.inputWrapper>input]:bg-zinc-200! dark:[&>.root>.inputWrapper>input]:bg-dark-surface-2!"
        />
    );
};

export default ProjectSelector;
