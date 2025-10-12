import type { CategorizedTasks } from "@/src/lib/utils/categorizedTasks";
import { TaskPageOngoingSituation } from "../components/charts/TaskPageOngoingSituation";

const StatsSection = ({
  categorizedTasks,
}: {
  categorizedTasks: CategorizedTasks;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TaskPageOngoingSituation categorizedTasks={categorizedTasks} />
      <TaskPageOngoingSituation categorizedTasks={categorizedTasks} />
    </div>
  );
};

export default StatsSection;
