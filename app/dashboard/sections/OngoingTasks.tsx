"use client";

import { CirclePlus } from "lucide-react";
import { useFetchUserTasks } from "@/src/lib/hooks/queries/useFetchUserTasks";
import TaskCard from "@/src/ui/components/Dashboard/TaskCard";
import { Button } from "@/src/ui/shadcn/components/ui/button";

const OngoingTasks = () => {
  // Fetch Tasks
  const { data: tasksResult } = useFetchUserTasks(["tasks"], {
    include: "parent",
  });
  const tasks = tasksResult?.result?.data;

  return (
    <section className="mt-6 pb-[1000px]">
      <header className="flex items-center justify-between mb-4">
        <h1 className="font-header text-2xl mb-2">Ongoing Tasks</h1>

        <Button>
          <CirclePlus /> New Task
        </Button>
      </header>

      {/* Card Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tasks &&
          tasks?.length > 0 &&
          tasks.map((item) => <TaskCard key={item?.id} task={item} />)}
      </div>
    </section>
  );
};

export default OngoingTasks;
