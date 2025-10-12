import { redirect } from "next/navigation";
import React from "react";
import type { Project } from "@/src/db/schema/projects";
import type { StandardizeResponse } from "@/src/lib/utils/createResponse";
import { generateMetadata as gm } from "@/src/lib/utils/generateMetadata";
import { getProject } from "@/src/lib/utils/serverQueries/getProject";
import ProjectPageIndex from "./ProjectPageIndex";

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
    <React.Suspense>
      <ProjectPageIndex projectFromServer={project} />
    </React.Suspense>
  );
};

export default ProjectPage;
