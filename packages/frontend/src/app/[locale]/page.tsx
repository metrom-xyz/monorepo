import { Campaigns } from "@/src/components/campaigns";
import { Nav } from "@/src/components/nav";

import styles from "./styles.module.css";

export default function HomePage() {
    return (
        <div className={styles.layout}>
            <Nav />
            <Campaigns />
        </div>
    );
}
