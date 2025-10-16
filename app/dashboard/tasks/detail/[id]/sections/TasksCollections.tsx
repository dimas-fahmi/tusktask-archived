"use client";

import { sortTask } from "@/src/lib/utils/sortTask";
import TcAccordion from "@/src/ui/components/Dashboard/TcAccordion";
import { useTaskPageIndexContext } from "../TaskPageIndex";

const TasksCollections = () => {
  // TODO: Finalize this
  const {
    task: _task,
    categorizedTasks,
    completedSubtasks,
  } = useTaskPageIndexContext();
  return (
    <div className="space-y-6">
      {/* Overdue */}
      {!!categorizedTasks?.overdue?.length && (
        <TcAccordion.root defaultOpen>
          <TcAccordion.trigger
            title="Overdue"
            titleTooltip="Overdue Tasks"
            action={<button type="button">More</button>}
            actionTooltip="Click to open more comprehensive list"
            variant={"destructive"}
          />
          <TcAccordion.body
            classes={{
              bodyContainer: "space-y-4",
            }}
          >
            {sortTask({
              tasks: categorizedTasks?.overdue,
              sortBy: "deadlineAt",
              sortDirection: "asc",
            }).map((item) => (
              <TcAccordion.item key={item?.id} task={item} />
            ))}
          </TcAccordion.body>
        </TcAccordion.root>
      )}

      {/* Overdue Soon */}
      {!!categorizedTasks?.overdueSoon.length && (
        <TcAccordion.root defaultOpen>
          <TcAccordion.trigger
            title="Overdue Soon"
            titleTooltip="Tasks overdue within 12 hours"
            action={<button type="button">More</button>}
            actionTooltip="Click to open more comprehensive list"
          />
          <TcAccordion.body
            classes={{
              bodyContainer: "space-y-4",
            }}
          >
            {sortTask({
              tasks: categorizedTasks?.overdueSoon,
              sortBy: "deadlineAt",
              sortDirection: "asc",
            })?.map((item) => (
              <TcAccordion.item key={item?.id} task={item} />
            ))}
          </TcAccordion.body>
        </TcAccordion.root>
      )}

      {/* Tomorrow */}
      {!!categorizedTasks?.tomorrow.length && (
        <TcAccordion.root defaultOpen>
          <TcAccordion.trigger
            title="Tomorrow"
            titleTooltip="Tasks overdue within 24 hours"
            action={<button type="button">More</button>}
            actionTooltip="Click to open more comprehensive list"
          />
          <TcAccordion.body
            classes={{
              bodyContainer: "space-y-4",
            }}
          >
            {sortTask({
              tasks: categorizedTasks?.tomorrow,
              sortBy: "deadlineAt",
              sortDirection: "asc",
            }).map((item) => (
              <TcAccordion.item key={item?.id} task={item} />
            ))}
          </TcAccordion.body>
        </TcAccordion.root>
      )}

      {/* Todos */}
      {!!categorizedTasks?.todos.length && (
        <TcAccordion.root defaultOpen>
          <TcAccordion.trigger
            title="Tasks To Do"
            titleTooltip="Active tasks that you have to work on, sorted oldest to newest."
            action={<button type="button">More</button>}
            actionTooltip="Click to open more comprehensive list."
          />
          <TcAccordion.body
            classes={{
              bodyContainer: "space-y-4",
            }}
          >
            {sortTask({
              tasks: categorizedTasks?.todos,
              sortBy: "createdAt",
              sortDirection: "asc",
            }).map((item) => (
              <TcAccordion.item key={item?.id} task={item} />
            ))}
          </TcAccordion.body>
        </TcAccordion.root>
      )}

      {/* Without Deadline */}
      {!!categorizedTasks?.noDeadlines.length && (
        <TcAccordion.root>
          <TcAccordion.trigger
            title="Tasks Without Deadlines"
            titleTooltip="Tasks without deadlines"
            action={<button type="button">More</button>}
            actionTooltip="Click to open more comprehensive list"
            variant={"destructive"}
          />
          <TcAccordion.body
            classes={{
              bodyContainer: "space-y-4",
            }}
          >
            {sortTask({
              tasks: categorizedTasks?.noDeadlines,
              sortBy: "createdAt",
              sortDirection: "asc",
            }).map((item) => (
              <TcAccordion.item
                key={item?.id || crypto.randomUUID()}
                task={item}
              />
            ))}
          </TcAccordion.body>
        </TcAccordion.root>
      )}

      {/* Completed Subtasks */}
      {!!completedSubtasks?.length && (
        <TcAccordion.root>
          <TcAccordion.trigger
            title="Completed Subtasks"
            titleTooltip="Showing latest 20 completed subtasks"
            action={<button type="button">More</button>}
            actionTooltip="Click to open more comprehensive list"
          />
          <TcAccordion.body
            classes={{
              bodyContainer: "space-y-4",
            }}
          >
            {sortTask({
              tasks: completedSubtasks,
              sortBy: "completedAt",
              sortDirection: "desc",
            }).map((item) => (
              <TcAccordion.item
                key={item?.id || crypto.randomUUID()}
                task={item}
              />
            ))}
          </TcAccordion.body>
        </TcAccordion.root>
      )}
    </div>
  );
};

export default TasksCollections;
