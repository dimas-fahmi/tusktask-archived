"use client";

import React, { useState } from "react";
import TaskAccordion from "@/src/ui/components/Dashboard/TaskAccordion";
import { Task } from "@/src/db/schema/tasks";
import {
  CategorizedTasks,
  categorizeTasks,
} from "@/src/lib/utils/categorizedTasks";
import { motion } from "motion/react";
import { OngoingSituation } from "../components/charts/OngoingSituation";
import { PrioritySituation } from "../components/charts/PrioritySituation";

const Collection = ({
  collection,
  title,
  variant,
  defaultOpen = false,
}: {
  collection: Task[];
  title: string;
  variant?: "default" | "destructive";
  defaultOpen?: boolean;
}) => {
  return (
    <TaskAccordion.root defaultOpen={defaultOpen}>
      <TaskAccordion.trigger
        title={title}
        label={`${!collection.length ? "No" : collection.length.toString().padStart(2, "0")} tasks`}
        variant={variant}
      />
      <TaskAccordion.body>
        {collection.map((item) => (
          <TaskAccordion.item key={item.id} task={item} />
        ))}
      </TaskAccordion.body>
    </TaskAccordion.root>
  );
};

const TaskCollectionsSection = ({ tasks }: { tasks?: Task[] }) => {
  // Catgorize Task
  const categorizedTasks = categorizeTasks(tasks);
  const { archived, completed, ongoing, overdue, overdueSoon, tomorrow } =
    categorizedTasks;

  const [filter, setFilter] = useState<keyof CategorizedTasks | undefined>(
    () => {
      return overdue.length < 1 ? "ongoing" : "overdue";
    }
  );

  return (
    <section id="taskCollections" className="py-4">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OngoingSituation
          activeFilter={filter}
          setActiveFilter={setFilter}
          categorizedTasks={categorizedTasks}
        />

        <PrioritySituation
          activeFilter={filter}
          setActiveFilter={setFilter}
          categorizedTasks={categorizedTasks}
        />
      </div>
      {/* Filter Controller */}
      <div className="grid grid-cols-6 gap-3"></div>

      <motion.div className="mt-4 min-h-[500px] space-y-4 pb-16">
        {/* Task Accordion - Overdue */}
        {overdue.length > 0 && (
          <Collection
            title="Overdue"
            variant="destructive"
            collection={overdue}
            defaultOpen
          />
        )}

        {/* Task Accordion - Overdue Soon */}
        {overdueSoon.length > 0 && (
          <Collection
            title="Overdue Soon"
            variant="default"
            collection={overdueSoon}
            defaultOpen
          />
        )}

        {/* Task Accordion - Overdue Tomorrow */}
        {tomorrow.length > 0 && (
          <Collection
            title="Overdue Tomorrow"
            variant="default"
            collection={tomorrow}
            defaultOpen
          />
        )}

        {/* Task Accordion - Ongoing */}
        {ongoing.length > 0 && (
          <Collection
            title="Ongoing Tasks"
            variant="default"
            collection={ongoing}
            defaultOpen
          />
        )}

        {/* Task Accordion - Archived */}
        {archived.length > 0 && (
          <Collection
            title="Archived Tasks"
            variant="default"
            collection={archived}
          />
        )}

        {/* Task Accordion - Completed Tasks */}
        {completed.length > 0 && (
          <Collection
            title="Completed Tasks"
            variant="default"
            collection={completed}
          />
        )}
      </motion.div>
    </section>
  );
};

export default TaskCollectionsSection;
