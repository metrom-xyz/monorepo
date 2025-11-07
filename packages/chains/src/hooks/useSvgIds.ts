import { useId } from "react";

export function useSvgIds() {
    const baseId = useId();

    return {
        id: (name: string) => `${baseId}_${name}`,
        url: (name: string) => `url(#${baseId}_${name})`,
    };
}
