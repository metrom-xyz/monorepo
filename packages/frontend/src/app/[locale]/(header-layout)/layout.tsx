import { Layout as DefaultLayout } from "@/src/components/layout";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <DefaultLayout header>{children}</DefaultLayout>;
}
