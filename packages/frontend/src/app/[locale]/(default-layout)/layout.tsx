import { Layout as DefaultLayout } from "@/src/components/layout";
import { routing } from "@/src/i18n/routing";
import { unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export default function Layout({
    children,
    params: { locale },
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    unstable_setRequestLocale(locale);

    return <DefaultLayout>{children}</DefaultLayout>;
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}
