import React, { Suspense } from "react";
import { generateMetadata as gm } from "@/src/lib/utils/generateMetadata";
import { fetchUserProjects } from "@/src/lib/utils/fetchers/fetchUserProjects";
import { parseCookies } from "@/src/lib/utils/parseCookies";
import { StandardizeResponse } from "@/src/lib/utils/createResponse";
import { Project } from "@/src/db/schema/projects";
import ProjectPageIndex from "./ProjectPageIndex";
import { redirect } from "next/navigation";

async function getProject(id: string) {
  const cookieString = await parseCookies();
  const headers = new Headers();
  headers.set("Cookie", cookieString);
  // Need to forward cookie for authentication to validate project ownership
  const response = await fetchUserProjects<Project[]>(
    { id },
    {
      headers: headers,
      cache: "force-cache",
      next: {
        revalidate: 60 * 60 * 1, // revalidate every 1 hour
        tags: ["projects", `project-${id}`],
      },
    }
  );

  return response;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ project_id: string }>;
}) {
  const { project_id } = await params;

  let response: StandardizeResponse<Project[]> | undefined;
  try {
    response = await getProject(project_id);
  } catch (_error) {
    response = undefined;
  }

  const project = response?.result?.[0];

  return gm({
    title: project?.name,
    description: project?.description,
  });
}

const ProjectPage = async ({
  params,
}: {
  params: Promise<{ project_id: string }>;
}) => {
  const { project_id } = await params;
  const response = await getProject(project_id);
  const project = response?.result?.[0];

  if (!project) {
    redirect("/dashboard");
  }

  return (
    <Suspense>
      <ProjectPageIndex project={project} />
    </Suspense>
  );
};

export default ProjectPage;
