import { PROJECTS_METADATA } from "@/src/commons/projects";
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
    const { locale, project: rawProject } = await params;

    // For LiquidityDeals we need an id for the overall deals. This is the case
    // for Turtle Club. We add the id to the project slug because the Earn component from Turtle
    // doesn't work if there's any query param in the path.
    // TODO: find a better solution.
    const [project, campaignId] = rawProject.split("_");

    if (
        !routing.locales.includes(locale) ||
        // TODO: do we need per env configuration?
        !PROJECTS_METADATA[project]
    )
        notFound();

    setRequestLocale(locale);

    return <Project project={project} campaignId={campaignId} />;
}

export async function generateStaticParams() {
    return routing.locales.flatMap((locale) =>
        Object.keys(PROJECTS_METADATA).map((project) => ({
            locale,
            project,
        })),
    );
}
