import type { CategorizedTasks } from "@/src/lib/utils/categorizedTasks";
import TaskAccordion from "@/src/ui/components/Dashboard/TaskAccordion";

const TasksSection = ({
  categorizedTasks,
}: {
  categorizedTasks: CategorizedTasks;
}) => {
  return (
    <div className="relative min-h-[520px]">
      {!categorizedTasks?.completed.length &&
      !categorizedTasks?.todos.length ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div>
            <span className="text-sm opacity-70 capitalize">
              no subTasks, create a new one!
            </span>
          </div>
        </div>
      ) : (
        <div>
          {/* Tasks todo */}
          {categorizedTasks?.todos.length > 0 && (
            <TaskAccordion.root defaultOpen>
              <TaskAccordion.trigger
                title="Tasks Todo"
                label={`${categorizedTasks.todos.length || "No"} Tasks`}
              />
              <TaskAccordion.body>
                {categorizedTasks?.todos?.map((item) => (
                  <TaskAccordion.item key={item?.id} task={item} />
                ))}
              </TaskAccordion.body>
            </TaskAccordion.root>
          )}

          {/* Completed tasks */}
          {categorizedTasks?.completed.length > 0 && (
            <TaskAccordion.root defaultOpen>
              <TaskAccordion.trigger
                title="Completed Tasks"
                label={`${categorizedTasks.completed.length || "No"} Tasks`}
              />
              <TaskAccordion.body>
                {categorizedTasks?.completed?.map((item) => (
                  <TaskAccordion.item key={item?.id} task={item} />
                ))}
              </TaskAccordion.body>
            </TaskAccordion.root>
          )}
        </div>
      )}
    </div>
  );
};

export default TasksSection;
