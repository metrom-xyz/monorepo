import { Claims } from "@/src/components/claims";

export const metadata = {
    openGraph: {
        images: ["/images/opengraph-image.png"],
    },
};

export default function ClaimsPage() {
    return <Claims />;
}
