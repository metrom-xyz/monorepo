import { Button } from "@/src/ui/button";

interface CampaignPreviewProps {
    onBack: () => void;
}

export function CampaignPreview({ onBack }: CampaignPreviewProps) {
    return (
        <div>
            preview
            <Button variant="secondary" size="xsmall" onClick={onBack}>
                back
            </Button>
        </div>
    );
}
