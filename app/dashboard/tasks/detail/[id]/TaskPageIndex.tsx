"use client";

import { ChartPie, ListTodo } from "lucide-react";
import { motion } from "motion/react";
import { createContext, useEffect, useState } from "react";
import { useFetchTasks } from "@/src/lib/hooks/queries/useFetchTasks";
import { useTaskStore } from "@/src/lib/stores/ui/taskStore";
import type { TaskApp } from "@/src/lib/types/tasks";
import {
  type CategorizedTasks,
  categorizeTasks,
} from "@/src/lib/utils/categorizedTasks";
import { queryKeys } from "@/src/lib/utils/queryKeys";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import Countdown from "./components/Countdown";
import HeaderSection from "./sections/HeaderSection";
import StatsSection from "./sections/StatsSection";
import TasksSection from "./sections/TasksCollections";

type OngoingSituationFilter = keyof Pick<
  CategorizedTasks,
  "archived" | "todos" | "tomorrow" | "overdueSoon" | "ongoing" | "overdue"
>;

type PrioritySituationFilter = keyof Pick<
  CategorizedTasks,
  "lowPriority" | "mediumPriority" | "highPriority" | "urgentPriority"
>;

export interface TaskPageIndexContextValues {
  activeTab: "stats" | "tasks";
  setActiveTab: (n: "stats" | "tasks") => void;
  ongoingSituationFilter?: OngoingSituationFilter;
  setOngoingSituationFilter: (n?: OngoingSituationFilter) => void;
  prioritySituationFilter?: PrioritySituationFilter;
  setPrioritySituationFilter: (n?: PrioritySituationFilter) => void;
}

const TaskPageIndexContext = createContext<TaskPageIndexContextValues | null>(
  null,
);

const TaskPageIndex = ({ taskFromServer }: { taskFromServer: TaskApp }) => {
  // Pull setters from task store
  const { setActiveTask } = useTaskStore();

  // Tabs
  const [activeTab, setActiveTab] = useState<"stats" | "tasks">("stats");

  // Filter States
  const [ongoingSituationFilter, setOngoingSituationFilter] = useState<
    OngoingSituationFilter | undefined
  >(undefined);

  const [prioritySituationFilter, setPrioritySituationFilter] = useState<
    PrioritySituationFilter | undefined
  >(undefined);

  // Query Task
  const { data: taskResponse, isPending: _isLoadingTask } =
    useFetchTasks<TaskApp>(queryKeys.tasks.detail(taskFromServer?.id), {
      id: taskFromServer?.id,
      include: "subtasks,project",
    });

  const task = taskResponse?.result || taskFromServer;

  // Update task store on mount
  useEffect(() => {
    if (task) {
      setActiveTask(task);
    }
  }, [setActiveTask, task]);

  // CategorizedTasks
  const categorizedTasks = categorizeTasks(task?.subtasks);

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
      <div className="dashboard-padding space-y-4 min-h-[1300px] pb-8">
        {/* Header */}
        <HeaderSection task={task} />
        {/* Countdown */}
        <div>{task?.deadlineAt && <Countdown task={task} />}</div>

        {/* Advance Content */}
        <div className="space-y-4 mt-12">
          {/* Header */}
          <header className="flex justify-between">
            <h1 className="text-4xl font-header">Ongoing Situations</h1>

            <div className="flex gap-2">
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
