import { Nav } from "./nav";
import { Footer } from "./footer";
import classNames from "@/src/utils/classes";
import type { ReactNode } from "react";

import styles from "./styles.module.css";

interface LayoutProps {
    header?: boolean;
    children: ReactNode;
}

export function Layout({ header, children }: LayoutProps) {
    return (
        <div className={classNames(styles.root, styles.layout)}>
            <Nav header={header} />
            <div className={styles.main}>{children}</div>
            <Footer />
        </div>
    );
}
