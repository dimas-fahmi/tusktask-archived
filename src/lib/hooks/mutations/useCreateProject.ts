import { ProjectsPostRequest } from "@/app/api/projects/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StandardizeResponse } from "../../utils/createResponse";
import { Project } from "@/src/db/schema/projects";
import { ProjectApp } from "../../types/projects";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: ProjectsPostRequest) => {
      const response = await fetch("/api/projects", {
        method: "POST",
        body: JSON.stringify(req),
      });

      const result = await response.json();

      if (!response.ok) {
        throw result;
      }

      return result;
    },
    onMutate: (request) => {
      queryClient.cancelQueries({
        queryKey: ["projects"],
      });

      const oldData = queryClient.getQueryData([
        "projects",
      ]) as StandardizeResponse<Project[]>;

      if (oldData) {
        queryClient.setQueryData(["projects"], () => {
          const newProject: ProjectApp = {
            id: crypto.randomUUID(),
            ownerId: crypto.randomUUID(),
            name: request?.newProject?.name || "Untitled",
            cover: request?.newProject?.cover || null,
            description: request?.newProject?.description || null,
            icon: request?.newProject?.icon || "Clock1",
            projectType: "generic",
            ...request?.newProject,
            createdAt: new Date(),
            isPending: true,
          };

          const newData: StandardizeResponse<ProjectApp[]> = {
            ...oldData,
            result: [...(oldData?.result ?? []), newProject],
          };

          return newData;
        });
      }

      return { oldData };
    },
    onError: (_error, _data, context) => {
      if (context?.oldData) {
        queryClient.setQueryData(["projects"], context.oldData);
      }
    },
  });
};
