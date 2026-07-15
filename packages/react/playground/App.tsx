import { CampaignsList } from "./components/CampaignsList";
import { CampaignDetails } from "./components/CampaignDetails";
import { Leaderboard } from "./components/Leaderboard";
import { Claims } from "./components/Claims";

export function App() {
    return (
        <div style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
            <h1>@metrom-xyz/react playground</h1>
            <CampaignsList />
            <CampaignDetails />
            <Leaderboard />
            <Claims />
        </div>
    );
}
