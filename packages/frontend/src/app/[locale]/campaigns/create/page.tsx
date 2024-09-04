import { CreateCampaign } from "@/src/components/create-campaign";
import { Nav } from "@/src/components/nav";
import { Footer } from "@/src/components/footer";

import styles from "../../styles.module.css";

export default function CampaignsCreatePage() {
    return (
        <div className={styles.layout}>
            <Nav />
            <CreateCampaign />
            <Footer />
        </div>
    );
}
