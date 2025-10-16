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
      <div className="grid grid-cols-1 gap-4">
        <TaskAccordion.root defaultOpen>
          <TaskAccordion.trigger title="Ongoing Report" label="" />
          <TaskAccordion.body>
            <div className="py-4">
              <TaskPageOngoingSituation
                activeFilter={ongoingSituationFilter}
                setActiveFilter={setOngoingSituationFilter}
                categorizedTasks={categorizedTasks}
              />
            </div>
          </TaskAccordion.body>
        </TaskAccordion.root>

        <TaskAccordion.root>
          <TaskAccordion.trigger title="Priority Report" label="" />
          <TaskAccordion.body>
            <div className="py-4">
              <TaskPagePrioritySituation
                categorizedTasks={categorizedTasks}
                activeFilter={prioritySituationFilter}
                setActiveFilter={setPrioritySituationFilter}
              />
            </div>
          </TaskAccordion.body>
        </TaskAccordion.root>
      </div>
    </div>
  );
};

export default StatsSection;
