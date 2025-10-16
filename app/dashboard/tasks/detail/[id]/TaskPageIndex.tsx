"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useFetchUserTasks } from "@/src/lib/hooks/queries/useFetchUserTasks";
import { queries } from "@/src/lib/queries";
import { useTaskStore } from "@/src/lib/stores/ui/taskStore";
import type {
  PriorityLevel,
  SituationKey,
  TaskApp,
} from "@/src/lib/types/tasks";
import {
  type CategorizedTasks,
  categorizeTasks,
} from "@/src/lib/utils/categorizedTasks";
import { filterCategorizedTasks } from "@/src/lib/utils/filterCategorizedTasks";
import { TaskPageBreadcrumb } from "@/src/ui/components/Dashboard/TaskPageBreadcrumb";
import FilteredResult from "./components/FilteredResult";
import HeaderSection from "./sections/HeaderSection";
import StatsSection from "./sections/StatsSection";
import TasksCollections from "./sections/TasksCollections";

export interface TaskPageIndexContextValues {
  ongoingSituationFilter?: SituationKey;
  setOngoingSituationFilter: (n?: SituationKey) => void;
  prioritySituationFilter?: PriorityLevel;
  setPrioritySituationFilter: (n?: PriorityLevel) => void;
  task?: TaskApp;
  categorizedTasks: CategorizedTasks;
  filtered?: TaskApp[];
  subtasks?: TaskApp[];
  completedSubtasks?: TaskApp[];
}

const TaskPageIndexContext = createContext<TaskPageIndexContextValues | null>(
  null,
);

export const useTaskPageIndexContext = () => {
  const context = useContext(TaskPageIndexContext);

  if (!context) {
    throw new Error(
      "TaskPageIndexContext can only be used inside TaskPageIndexContextProvider",
    );
  }

  return context;
};

const TaskPageIndex = ({ taskFromServer }: { taskFromServer: TaskApp }) => {
  // Pull setters from task store
  const { setActiveTask } = useTaskStore();

  // Filter States
  const [ongoingSituationFilter, setOngoingSituationFilter] = useState<
    SituationKey | undefined
  >(undefined);

  const [prioritySituationFilter, setPrioritySituationFilter] = useState<
    PriorityLevel | undefined
  >(undefined);

  // Query Task
  const taskQuery = queries.tasks.detail(taskFromServer.id);
  const { data: taskResponse, isPending: _isLoadingTask } = useFetchUserTasks(
    taskQuery.queryKey,
    taskQuery?.context?.request,
  );

  const task = taskResponse?.result?.data?.[0] || taskFromServer;

  // Query Subtasks
  const subtasksQuery = queries.tasks.detailSubtasks(taskFromServer.id, 100);
  const { data: subtasksResponse, isPending: _isLoadingSubtasks } =
    useFetchUserTasks(subtasksQuery.queryKey, subtasksQuery?.context?.request);

  const subtasks = subtasksResponse?.result?.data;

  // Query Completed tasks
  const completedSubtasksQuery = queries.tasks.completedDetailSubtasks(
    taskFromServer.id,
  );
  const { data: completedDetailSubtasksResponse } = useFetchUserTasks(
    completedSubtasksQuery.queryKey,
    completedSubtasksQuery?.context?.request,
  );

  const completedSubtasks = (
    completedDetailSubtasksResponse?.result?.data || []
  ).filter((item) => item?.completedAt);

  // Update task store on mount
  useEffect(() => {
    if (task) {
      setActiveTask(task);
    }
  }, [setActiveTask, task]);

  // CategorizedTasks (subtasks)
  const categorizedTasks = categorizeTasks(subtasks);

  const filtered = filterCategorizedTasks(
    categorizedTasks,
    ongoingSituationFilter,
    prioritySituationFilter,
  )?.filter((item) => !item?.completedAt);

  return (
    <TaskPageIndexContext.Provider
      value={{
        setOngoingSituationFilter,
        setPrioritySituationFilter,
        ongoingSituationFilter,
        prioritySituationFilter,
        task,
        categorizedTasks,
        filtered,
        completedSubtasks,
      }}
    >
      <div className="dashboard-padding space-y-6 md:flex md:flex-col">
        <TaskPageBreadcrumb task={task} />

        {/* Header */}
        <HeaderSection task={task} />

        <StatsSection categorizedTasks={categorizedTasks} />

        {/* Main Content */}
        <div className="space-y-6">
          {/* Filter Result */}
          <FilteredResult />

          {/* Tasks Collections */}
          <TasksCollections />
        </div>
      </div>
    </TaskPageIndexContext.Provider>
  );
};

export default TaskPageIndex;
