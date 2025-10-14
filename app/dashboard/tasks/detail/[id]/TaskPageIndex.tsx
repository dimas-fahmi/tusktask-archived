"use client";

import { ChartPie, ListTodo } from "lucide-react";
import { motion } from "motion/react";
import { createContext, useContext, useEffect, useState } from "react";
import { useFetchUserTasks } from "@/src/lib/hooks/queries/useFetchUserTasks";
import { queries } from "@/src/lib/queries";
import { useTaskStore } from "@/src/lib/stores/ui/taskStore";
import type {
  PriorityLevel,
  SituationKey,
  TaskApp,
} from "@/src/lib/types/tasks";
import { categorizeTasks } from "@/src/lib/utils/categorizedTasks";
import { TaskPageBreadcrumb } from "@/src/ui/components/Dashboard/TaskPageBreadcrumb";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import Countdown from "./components/Countdown";
import HeaderSection from "./sections/HeaderSection";
import QuickLists from "./sections/QuickLists";
import StatsSection from "./sections/StatsSection";
import TasksSection from "./sections/TasksCollections";

export interface TaskPageIndexContextValues {
  activeTab: "stats" | "tasks";
  setActiveTab: (n: "stats" | "tasks") => void;
  ongoingSituationFilter?: SituationKey;
  setOngoingSituationFilter: (n?: SituationKey) => void;
  prioritySituationFilter?: PriorityLevel;
  setPrioritySituationFilter: (n?: PriorityLevel) => void;
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

  // Tabs
  const [activeTab, setActiveTab] = useState<"stats" | "tasks">("stats");

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
  const subtasksQuery = queries.tasks.detailSubtasks(taskFromServer.id);
  const { data: subtasksResponse, isPending: _isLoadingSubtasks } =
    useFetchUserTasks(subtasksQuery.queryKey, subtasksQuery?.context?.request);

  const subtasks = subtasksResponse?.result?.data;

  // Update task store on mount
  useEffect(() => {
    if (task) {
      setActiveTask(task);
    }
  }, [setActiveTask, task]);

  // CategorizedTasks (subtasks)
  const categorizedTasks = categorizeTasks(subtasks);

  return (
    <TaskPageIndexContext.Provider
      value={{
        activeTab,
        setActiveTab,
        setOngoingSituationFilter,
        setPrioritySituationFilter,
        ongoingSituationFilter,
        prioritySituationFilter,
      }}
    >
      <div className="dashboard-padding space-y-6 min-h-[1300px] pb-8">
        <TaskPageBreadcrumb task={task} />

        {/* Header */}
        <HeaderSection task={task} />

        {/* Countdown */}
        <div>{task?.deadlineAt && <Countdown task={task} />}</div>

        {/* Quick Lists */}
        <QuickLists categorizedTasks={categorizedTasks} />

        {/* Advance Content */}
        <div className="space-y-6">
          {/* Header */}
          <header className="flex justify-between">
            <h1 className="text-4xl font-header">Ongoing Situations</h1>

            <div className="flex gap-2 items-center">
              <Button
                variant={activeTab === "stats" ? "default" : "outline"}
                onClick={() => {
                  setActiveTab("stats");
                }}
              >
                <ChartPie />
              </Button>
              <Button
                variant={activeTab === "tasks" ? "default" : "outline"}
                onClick={() => {
                  setActiveTab("tasks");
                }}
              >
                <ListTodo />
              </Button>
            </div>
          </header>

          {/* Content */}
          <div className="relative">
            {/* Statistics */}
            {activeTab === "stats" && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <StatsSection categorizedTasks={categorizedTasks} />
              </motion.div>
            )}

            {/* Tasks Collections */}
            {activeTab === "tasks" && (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <TasksSection categorizedTasks={categorizedTasks} />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </TaskPageIndexContext.Provider>
  );
};

export default TaskPageIndex;
