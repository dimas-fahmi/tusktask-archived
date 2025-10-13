import type { CategorizedTasks } from "@/src/lib/utils/categorizedTasks";
import { filterCategorizedTasks } from "@/src/lib/utils/filterCategorizedTasks";
import { getTasksCountDescription } from "@/src/lib/utils/getTasksCountDescription";
import TaskAccordionWrapper from "@/src/ui/components/Dashboard/TaskAccordion/TaskAccordionWrapper";

const QuickLists = ({
  categorizedTasks,
}: {
  categorizedTasks: CategorizedTasks;
}) => {
  // No Deadlines
  const noDeadlines = categorizedTasks?.noDeadlines || [];

  // High Priority Soon
  const highPrioritySoon = filterCategorizedTasks(
    categorizedTasks,
    "overdueSoon",
    "high",
  );

  // Urgent Priority Soon
  const urgentPrioritySoon = filterCategorizedTasks(
    categorizedTasks,
    "overdueSoon",
    "urgent",
  );

  const isAtLeastOne =
    !!categorizedTasks?.overdue?.length ||
    !!categorizedTasks?.overdueSoon?.length ||
    !!categorizedTasks?.tomorrow?.length ||
    !!urgentPrioritySoon?.length ||
    !!highPrioritySoon?.length ||
    !!categorizedTasks?.onProcess?.length ||
    !!categorizedTasks?.todos?.length ||
    !!noDeadlines?.length;

  return (
    <div className="space-y-4">
      {isAtLeastOne && <h1 className="text-4xl font-header">Quick Lists</h1>}

      {/* Overdue */}
      {!!categorizedTasks?.overdue.length && (
        <TaskAccordionWrapper
          payload={{
            triggerProps: { variant: "destructive" },
          }}
          title="Overdue"
          label={getTasksCountDescription(categorizedTasks?.overdue.length)}
          data={categorizedTasks?.overdue}
        />
      )}

      {/* Overdue Soon */}
      {!!categorizedTasks?.overdueSoon.length && (
        <TaskAccordionWrapper
          payload={{
            triggerProps: { variant: "destructive" },
          }}
          title="Overdue Soon"
          label={getTasksCountDescription(categorizedTasks?.overdueSoon.length)}
          data={categorizedTasks?.overdueSoon}
        />
      )}

      {/* Overdue Tomorrow */}
      {!!categorizedTasks?.tomorrow.length && (
        <TaskAccordionWrapper
          title="Overdue Tomorrow"
          label={getTasksCountDescription(categorizedTasks?.tomorrow.length)}
          data={categorizedTasks?.tomorrow}
        />
      )}

      {/* Urgent Priority Overdue Soon */}
      {!!urgentPrioritySoon.length && (
        <TaskAccordionWrapper
          payload={{
            triggerProps: { variant: "destructive" },
          }}
          title="Urgent Priority - Overdue Soon"
          label={getTasksCountDescription(urgentPrioritySoon.length)}
          data={urgentPrioritySoon}
        />
      )}

      {/* High Priority Overdue Soon */}
      {!!highPrioritySoon.length && (
        <TaskAccordionWrapper
          payload={{
            triggerProps: { variant: "destructive" },
          }}
          title="High Priority - Overdue Soon"
          label={getTasksCountDescription(highPrioritySoon.length)}
          data={highPrioritySoon}
        />
      )}

      {/* On Process */}
      {!!categorizedTasks?.onProcess.length && (
        <TaskAccordionWrapper
          title="Continue Working On"
          label={getTasksCountDescription(categorizedTasks?.onProcess.length)}
          data={categorizedTasks?.onProcess}
        />
      )}

      {/* Todos */}
      {!!categorizedTasks?.todos.length && (
        <TaskAccordionWrapper
          title="Tasks Todos"
          label={getTasksCountDescription(categorizedTasks?.todos.length)}
          data={categorizedTasks?.todos}
        />
      )}

      {/* Tasks Without Deadlines */}
      {!!noDeadlines.length && (
        <TaskAccordionWrapper
          payload={{
            triggerProps: { variant: "destructive" },
          }}
          title="Tasks Without Deadline"
          label={getTasksCountDescription(noDeadlines.length)}
          data={noDeadlines}
        />
      )}
    </div>
  );
};

export default QuickLists;
