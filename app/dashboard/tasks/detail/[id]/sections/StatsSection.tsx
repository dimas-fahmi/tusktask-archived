import type { CategorizedTasks } from "@/src/lib/utils/categorizedTasks";
import TaskAccordion from "@/src/ui/components/Dashboard/TaskAccordion";
import { TaskPageOngoingSituation } from "../components/charts/TaskPageOngoingSituation";
import { TaskPagePrioritySituation } from "../components/charts/TaskPagePrioritySituation";
import { useTaskPageIndexContext } from "../TaskPageIndex";

const StatsSection = ({
  categorizedTasks,
}: {
  categorizedTasks: CategorizedTasks;
}) => {
  const {
    prioritySituationFilter,
    ongoingSituationFilter,
    setOngoingSituationFilter,
    setPrioritySituationFilter,
  } = useTaskPageIndexContext();

  return (
    <div>
      {/* Chart */}
      <TaskAccordion.root defaultOpen>
        <TaskAccordion.trigger title="Ongoing Reports" label="" />
        <TaskAccordion.body className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TaskPageOngoingSituation
              activeFilter={ongoingSituationFilter}
              setActiveFilter={setOngoingSituationFilter}
              categorizedTasks={categorizedTasks}
            />

            <TaskPagePrioritySituation
              categorizedTasks={categorizedTasks}
              activeFilter={prioritySituationFilter}
              setActiveFilter={setPrioritySituationFilter}
            />
          </div>
        </TaskAccordion.body>
      </TaskAccordion.root>
    </div>
  );
};

export default StatsSection;
