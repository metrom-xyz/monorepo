import { Claims as ClaimsPage } from "@/src/components/claims";
import { Nav } from "@/src/components/nav";

import styles from "../styles.module.css";

export default function Claims() {
    return (
        <div className={styles.layout}>
            <Nav />
            <ClaimsPage />
        </div>
    );
}
