import { useRef, type ReactNode, useEffect } from "react";

interface ScrollIntoViewProps {
    selected?: boolean;
    children: ReactNode;
}

export function ScrollIntoView({ selected, children }: ScrollIntoViewProps) {
    const listItemRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (selected && listItemRef.current) {
            listItemRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [selected]);

    return <span ref={listItemRef}>{children}</span>;
}
