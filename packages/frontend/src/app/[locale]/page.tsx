import { Campaigns } from "@/src/components/campaigns";
import { Nav } from "@/src/components/nav";
import { Footer } from "@/src/components/footer";

import styles from "./styles.module.css";

export default function HomePage() {
    return (
        <div className={styles.layout}>
            <Nav />
            <Campaigns />
            <Footer />
        </div>
    );
}
