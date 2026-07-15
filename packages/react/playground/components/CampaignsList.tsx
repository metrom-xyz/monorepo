import { useState } from "react";
import { CampaignStatus, CampaignType, useCampaigns } from "@metrom-xyz/react";
import { preStyle, inputsStyle, sectionStyle } from "../ui/styles";
import { stringify } from "../utils/stringify";

export function CampaignsList() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [type, setType] = useState(CampaignType.Rewards);
    const [status, setStatus] = useState<CampaignStatus | "">("");

    const campaigns = useCampaigns({
        page,
        pageSize,
        type,
        statuses: status ? [status] : undefined,
    });

    return (
        <div style={sectionStyle}>
            <h2>useCampaigns</h2>
            <div style={inputsStyle}>
                <label>
                    page:
                    <input
                        type="number"
                        value={page}
                        onChange={(event) =>
                            setPage(Number(event.target.value))
                        }
                    />
                </label>
                <label>
                    pageSize:
                    <input
                        type="number"
                        value={pageSize}
                        max={20}
                        onChange={(event) =>
                            setPageSize(Number(event.target.value))
                        }
                    />
                </label>
                <label>
                    type:
                    <select
                        value={type}
                        onChange={(event) =>
                            setType(event.target.value as CampaignType)
                        }
                    >
                        <option value={CampaignType.Rewards}>rewards</option>
                        <option value={CampaignType.Points}>points</option>
                    </select>
                </label>
                <label>
                    status:
                    <select
                        value={status}
                        onChange={(event) =>
                            setStatus(event.target.value as CampaignStatus | "")
                        }
                    >
                        <option value="">any</option>
                        <option value={CampaignStatus.Active}>active</option>
                        <option value={CampaignStatus.Upcoming}>
                            upcoming
                        </option>
                        <option value={CampaignStatus.Expired}>expired</option>
                    </select>
                </label>
            </div>
            {campaigns.isLoading && <p>Loading...</p>}
            {campaigns.data && (
                <pre style={preStyle}>{stringify(campaigns.data)}</pre>
            )}
        </div>
    );
}
