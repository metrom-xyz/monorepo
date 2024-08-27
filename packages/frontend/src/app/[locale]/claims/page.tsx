import { Claims } from "@/src/components/claims";
import { Nav } from "@/src/components/nav";

import styles from "../styles.module.css";

export default function ClaimsPage() {
    return (
        <div className={styles.layout}>
            <Nav />
            <Claims />
        </div>
    );
}
