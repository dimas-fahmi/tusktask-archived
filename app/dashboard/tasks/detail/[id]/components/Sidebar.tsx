"use client";

import TaskAccordion from "@/src/ui/components/Dashboard/TaskAccordion";
import StatsSection from "../sections/StatsSection";
import { useTaskPageIndexContext } from "../TaskPageIndex";
import Countdown from "./Countdown";

const Sidebar = () => {
  const { categorizedTasks, task } = useTaskPageIndexContext();

  return (
    <aside className="">
      <div className="space-y-4 md:sticky md:top-5 md:max-h-[520px] md:overflow-hidden md:overflow-y-scroll scrollbar-none">
        {/* Countdown */}
        {task?.deadlineAt && (
          <TaskAccordion.root defaultOpen>
            <TaskAccordion.trigger title="Countdown" label="" />
            <TaskAccordion.body className="pt-4">
              <div>{task?.deadlineAt && <Countdown task={task} />}</div>
            </TaskAccordion.body>
          </TaskAccordion.root>
        )}

        {/* Content */}
        <StatsSection categorizedTasks={categorizedTasks} />
      </div>
    </aside>
  );
};

export default Sidebar;
