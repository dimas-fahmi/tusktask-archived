import { motion } from "motion/react";
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
            {!filtered?.length && (
              <div className="min-h-52 border-dashed mt-4 mx-4 flex items-center justify-center border-2">
                <div className="grid grid-cols-1 gap-4 text-center">
                  <p className="text-center capitalize text-sm opacity-60">
                    No Task With This Filter,{" "}
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => {
                        setOngoingSituationFilter(undefined);
                        setPrioritySituationFilter(undefined);
                      }}
                    >
                      Reset Filter
                    </button>
                  </p>
                </div>
              </div>
            )}

            <motion.div
              key={`${ongoingSituationFilter}-${prioritySituationFilter}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TaskAccordion.itemContainer>
                {filtered
                  ?.filter((item) => !item?.completedAt)
                  ?.map((item) => (
                    <TaskAccordion.item key={item?.id} task={item} />
                  ))}
              </TaskAccordion.itemContainer>
            </motion.div>
          </TaskAccordion.body>
        </TaskAccordion.root>
      </div>
    </div>
  );
};

export default StatsSection;
