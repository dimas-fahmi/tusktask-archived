import { motion } from "motion/react";
import { getFilteredCTsDescription } from "@/src/lib/utils/filterCategorizedTasks";
import TcAccordion from "@/src/ui/components/Dashboard/TcAccordion";
import { useTaskPageIndexContext } from "../TaskPageIndex";

const FilteredResult = () => {
  const {
    prioritySituationFilter,
    ongoingSituationFilter,
    filtered,
    setPrioritySituationFilter,
    setOngoingSituationFilter,
  } = useTaskPageIndexContext();

  return (
    <div
      className={`${(prioritySituationFilter === "all" && ongoingSituationFilter === "all") || (!prioritySituationFilter && !ongoingSituationFilter) ? "hidden" : ""}`}
    >
      <TcAccordion.root defaultOpen>
        <TcAccordion.trigger
          title={`${getFilteredCTsDescription(
            ongoingSituationFilter,
            prioritySituationFilter,
          )}`}
          titleTooltip="Filter Result"
          action={
            <button
              type="button"
              onClick={() => {
                setPrioritySituationFilter(undefined);
                setOngoingSituationFilter(undefined);
              }}
            >
              Clear Filter
            </button>
          }
          actionTooltip="Clear Filter"
        />
        <TcAccordion.body>
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
            {filtered?.map((item) => (
              <TcAccordion.item key={item?.id} task={item} />
            ))}
          </motion.div>
        </TcAccordion.body>
      </TcAccordion.root>
    </div>
  );
};

export default FilteredResult;
