"use client";

import Link from "next/link";
import { constructTPLU } from "@/src/lib/utils/constructTPLU";
import { sortTask } from "@/src/lib/utils/sortTask";
import TcAccordion from "@/src/ui/components/Dashboard/TcAccordion";
import { useTaskPageIndexContext } from "../TaskPageIndex";

const TasksCollections = () => {
  const { task, categorizedTasks, completedSubtasks } =
    useTaskPageIndexContext();
  return (
    task && (
      <div className="space-y-6 min-h-[480px]">
        {/* Overdue */}
        {!!categorizedTasks?.overdue?.length && (
          <TcAccordion.root defaultOpen>
            <TcAccordion.trigger
              title="Overdue"
              titleTooltip="Overdue Tasks"
              action={
                <Link
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  href={constructTPLU("task", "overdue", task.id)}
                  prefetch
                >
                  More
                </Link>
              }
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
        {!!categorizedTasks?.overdueSoon?.length && (
          <TcAccordion.root defaultOpen>
            <TcAccordion.trigger
              title="Overdue Soon"
              titleTooltip="Tasks overdue within 12 hours"
              action={
                <Link
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  href={constructTPLU("task", "overdueSoon", task.id)}
                  prefetch
                >
                  More
                </Link>
              }
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
        {!!categorizedTasks?.tomorrow?.length && (
          <TcAccordion.root defaultOpen>
            <TcAccordion.trigger
              title="Tomorrow"
              titleTooltip="Tasks overdue within 24 hours"
              action={
                <Link
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  href={constructTPLU("task", "tomorrow", task.id)}
                  prefetch
                >
                  More
                </Link>
              }
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
        {!!categorizedTasks?.onProcess?.length && (
          <TcAccordion.root defaultOpen>
            <TcAccordion.trigger
              title="You Are Working On This"
              titleTooltip="You are working on these tasks, get to work and complete these tasks first."
              action={
                <Link
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  href={constructTPLU("task", "todos", task.id)}
                  prefetch
                >
                  More
                </Link>
              }
              actionTooltip="Click to open more comprehensive list."
            />
            <TcAccordion.body
              classes={{
                bodyContainer: "space-y-4",
              }}
            >
              {sortTask({
                tasks: categorizedTasks?.onProcess,
                sortBy: "createdAt",
                sortDirection: "asc",
              }).map((item) => (
                <TcAccordion.item key={item?.id} task={item} />
              ))}
            </TcAccordion.body>
          </TcAccordion.root>
        )}

        {/* Todos */}
        {!!categorizedTasks?.todos?.length && (
          <TcAccordion.root defaultOpen>
            <TcAccordion.trigger
              title="Tasks To Do"
              titleTooltip="Active tasks that you have to work on, sorted oldest to newest."
              action={
                <Link
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  href={constructTPLU("task", "todos", task.id)}
                  prefetch
                >
                  More
                </Link>
              }
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
        {!!categorizedTasks?.noDeadlines?.length && (
          <TcAccordion.root>
            <TcAccordion.trigger
              title="Tasks Without Deadlines"
              titleTooltip="Tasks without deadlines"
              action={
                <Link
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  href={constructTPLU("task", "noDeadlines", task.id)}
                  prefetch
                >
                  More
                </Link>
              }
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
              action={
                <Link
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  href={constructTPLU("task", "completed", task.id)}
                  prefetch
                >
                  More
                </Link>
              }
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
    )
  );
};

export default TasksCollections;
