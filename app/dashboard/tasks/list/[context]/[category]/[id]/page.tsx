import { redirect } from "next/navigation";
import type { Project } from "@/src/db/schema/projects";
import type { Task } from "@/src/db/schema/tasks";
import { APP_URL } from "@/src/lib/configs";
import {
  type CategorizedTasks,
  categories,
  categorizedTasksInformation,
} from "@/src/lib/utils/categorizedTasks";
import { generateMetadata as gm } from "@/src/lib/utils/generateMetadata";
import { getProject } from "@/src/lib/utils/serverQueries/getProject";
import { getTask } from "@/src/lib/utils/serverQueries/getTask";
import TasksListPageIndex from "./TasksListPageIndex";

export interface TasksListPageProps {
  context: "task" | "project";
  category: keyof CategorizedTasks;
  id: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<TasksListPageProps>;
}) {
  const { category, context, id } = await params;

  let contextObject: Project | Task | undefined;

  try {
    if (context === "project") {
      const response = await getProject(id);
      contextObject = response?.result?.[0];
    }

    if (context === "task") {
      const response = await getTask(id);
      contextObject = response?.result?.data?.[0];
    }

    if (!contextObject) {
      throw new Error(
        `Context couldn't be found, looking for: ${context} with id ${id}`,
      );
    }
  } catch (_error) {
    return gm();
  }

  const contextName = contextObject?.name;

  const title = `${categorizedTasksInformation?.[category].long} | ${contextName}`;

  return gm({
    title,
  });
}

const TasksListPage = async ({
  params,
}: {
  params: Promise<TasksListPageProps>;
}) => {
  const { context, category, id } = await params;

  if (!context || (context !== "project" && context !== "task")) {
    redirect(
      `${APP_URL}/dashboard?code=no_context_provided&message=${encodeURIComponent("No context has been provided for the list page, expecting task or a project.")}`,
    );
  }

  if (!categories.includes(category)) {
    redirect(
      `${APP_URL}/dashboard?code=invalid_category&message=${encodeURIComponent("Invalid task category")}`,
    );
  }

  if (!id) {
    redirect(
      `${APP_URL}/dashboard?code=no_context_id_provided&message=${encodeURIComponent("No context id has been provided, expecting UUID")}`,
    );
  }

  return (
    <div>
      <TasksListPageIndex {...(await params)} />
    </div>
  );
};

export default TasksListPage;
