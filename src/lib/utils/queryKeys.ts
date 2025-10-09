export const queryKeys = {
  tasks: {
    all: ["tasks"] as const,
    project: (projectId: string) => [
      ...queryKeys.tasks.all,
      `project-${projectId}`,
    ],
  },
};
