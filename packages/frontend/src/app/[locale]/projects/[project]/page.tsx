import { ENVIRONMENT } from "@/src/commons/env";
import { PROJECT_PAGES } from "@/src/commons/project-pages";
import { Project } from "@/src/components/project";
import { routing, type Locale } from "@/src/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export interface Params {
    project: string;
    locale: Locale;
}

export interface ProjectPageProps {
    params: Promise<Params>;
}

export async function generateMetadata({ params }: ProjectPageProps) {
    const { project } = await params;
    const t = await getTranslations();

    return {
        title: t("projectPage.title", { project }),
    };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { locale, project } = await params;

    if (
        !routing.locales.includes(locale) ||
        !PROJECT_PAGES[ENVIRONMENT][project]
    )
        notFound();

    setRequestLocale(locale);

    return <Project project={project} />;
}

export async function generateStaticParams() {
    return routing.locales.flatMap((locale) =>
        Object.keys(PROJECT_PAGES[ENVIRONMENT]).map((project) => ({
            locale,
            project,
        })),
    );
}
