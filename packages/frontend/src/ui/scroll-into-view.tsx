import { useRef, type ReactNode, useEffect } from "react";

interface ScrollIntoViewProps {
    selected?: boolean;
    children: ReactNode;
}

export function ScrollIntoView({ selected, children }: ScrollIntoViewProps) {
    const listItemRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!selected || !listItemRef.current) return;

        const container = listItemRef.current.parentElement;
        if (!container) return;

        const { offsetTop, offsetLeft, clientHeight, clientWidth } =
            listItemRef.current;

        container.scrollTo({
            top:
                offsetTop -
                32 +
                clientHeight / 2 +
                listItemRef.current.offsetHeight / 2,
            left:
                offsetLeft -
                clientWidth / 2 +
                listItemRef.current.offsetWidth / 2,
            behavior: "smooth",
        });
    }, [selected]);

    return <span ref={listItemRef}>{children}</span>;
}
