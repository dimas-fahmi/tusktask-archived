import type { CategorizedTasks } from "@/src/lib/utils/categorizedTasks";
import {
  filterCategorizedTasks,
  getFilteredCTsDescription,
} from "@/src/lib/utils/filterCategorizedTasks";
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
  const filtered = filterCategorizedTasks(
    categorizedTasks,
    ongoingSituationFilter,
    prioritySituationFilter,
  );

  return (
    <div>
      {/* Chart */}
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

      {/* Filter Result */}
      <div className="mt-4">
        <TaskAccordion.root defaultOpen>
          <TaskAccordion.trigger
            title={getFilteredCTsDescription(
              ongoingSituationFilter,
              prioritySituationFilter,
            )}
            label={`${filtered?.length?.toString().padStart(2, "0") || "No"} Tasks`}
          />
          <TaskAccordion.body>
            <TaskAccordion.itemContainer>
              {filtered?.map((item) => (
                <TaskAccordion.item key={item?.id} task={item} />
              ))}
            </TaskAccordion.itemContainer>
          </TaskAccordion.body>
        </TaskAccordion.root>
      </div>
    </div>
  );
};

export default StatsSection;
