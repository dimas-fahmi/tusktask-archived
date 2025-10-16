import { motion } from "motion/react";
import { getFilteredCTsDescription } from "@/src/lib/utils/filterCategorizedTasks";
import TaskAccordion from "@/src/ui/components/Dashboard/TaskAccordion";
import { useTaskPageIndexContext } from "../TaskPageIndex";

const FilteredResult = () => {
  const { prioritySituationFilter, ongoingSituationFilter, filtered } =
    useTaskPageIndexContext();

  return (
    <div
      className={`${(prioritySituationFilter === "all" && ongoingSituationFilter === "all") || (!prioritySituationFilter && !ongoingSituationFilter) ? "hidden" : ""}`}
    >
      <TaskAccordion.root defaultOpen>
        <TaskAccordion.trigger
          title={`${getFilteredCTsDescription(
            ongoingSituationFilter,
            prioritySituationFilter,
          )}`}
          label={`${
            filtered?.length?.toString().padStart(2, "0") || "No"
          } Tasks`}
        />
        <TaskAccordion.body>
          {!filtered?.length && (
            <div className="min-h-52 border-dashed mt-4 mx-4 flex items-center justify-center border-2">
              <div className="grid grid-cols-1 gap-4 text-center">
                <p className="text-center capitalize text-sm opacity-60">
                  No Task With This Filter
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
            <TaskAccordion.itemContainer className="grid grid-cols-1 md:grid-cols-1 md:px-0">
              {filtered?.map((item) => (
                <TaskAccordion.item key={item?.id} task={item} />
              ))}
            </TaskAccordion.itemContainer>
          </motion.div>
        </TaskAccordion.body>
      </TaskAccordion.root>
    </div>
  );
};

export default FilteredResult;
