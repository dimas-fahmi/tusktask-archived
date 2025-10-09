"use client";

import { ProjectsPatchRequest } from "@/app/api/projects/patch";
import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import { StandardizeResponse } from "../../createResponse";
import { Project } from "@/src/db/schema/projects";

export interface EagerUpdaterResult<T> {
  oldData: StandardizeResponse<T>;
  newData: StandardizeResponse<T>;
  queryKey: string[];
}

const update = (req: ProjectsPatchRequest, queryClient: QueryClient) => {
  const queryKey = queryKeys.projects.detail(req?.id);

  queryClient.cancelQueries({
    queryKey: queryKey,
  });

  const oldData = queryClient.getQueryData(queryKey) as StandardizeResponse<
    Project[]
  >;

  const newData = (() => {
    if (!oldData) return oldData;

    const oldProject = oldData?.result?.find((item) => item?.id === req?.id);

    if (!oldProject) return oldData;

    const newProject = {
      ...oldProject,
      ...req?.newValues,
    };

    const newList = oldData?.result?.map((item) =>
      item?.id === req?.id ? newProject : item
    );

    return {
      ...oldData,
      result: newList,
    };
  })();

  if (oldData) {
    queryClient.setQueryData(queryKey, newData);
    document.title = `${req?.newValues?.name} | TuskTask`;
  }

  return { oldData, newData, queryKey };
};

export const eagerUpdaterProjectsDetail = {
  update,
};
