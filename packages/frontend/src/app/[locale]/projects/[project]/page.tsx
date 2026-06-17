import { Project } from "@/src/components/project";
import { routing, type Locale } from "@/src/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { METROM_API_CLIENT } from "@/src/commons";

export const revalidate = 300;

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
    const { locale, project: slug } = await params;

    if (!routing.locales.includes(locale)) notFound();

    setRequestLocale(locale);

    const projects = await METROM_API_CLIENT.fetchProjects();
    const project = projects.find((p) => p.slug === slug);

    if (!project) notFound();

    return <Project project={project} />;
}
