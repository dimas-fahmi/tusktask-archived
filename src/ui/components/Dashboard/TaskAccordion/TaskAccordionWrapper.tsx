import type React from "react";
import type { TaskApp } from "@/src/lib/types/tasks";
import TaskAccordion, {
  type TaskAccordionProps,
  type TaskAccordionTriggerProps,
} from ".";

export interface TaskAccordionWrapperPropsPayload {
  rootProps?: TaskAccordionProps;
  triggerProps?: Partial<TaskAccordionTriggerProps>;
  bodyProps?: React.HTMLAttributes<HTMLDivElement>;
  itemContainerProps?: React.HTMLAttributes<HTMLDivElement>;
}

export interface TaskAccordionWrapperProps {
  data: TaskApp[];
  title: string;
  label: string;
  children?: React.ReactNode;
  payload?: TaskAccordionWrapperPropsPayload;
}

const TaskAccordionWrapper = ({
  data,
  label,
  title,
  children,
  payload,
}: TaskAccordionWrapperProps) => {
  return (
    <TaskAccordion.root {...payload?.rootProps}>
      <TaskAccordion.trigger
        title={title}
        label={label}
        {...payload?.triggerProps}
      />
      <TaskAccordion.body {...payload?.bodyProps}>
        {children}
        <TaskAccordion.itemContainer {...payload?.itemContainerProps}>
          {children}

          {data.map((item) => (
            <TaskAccordion.item key={item?.id} task={item} />
          ))}
        </TaskAccordion.itemContainer>
      </TaskAccordion.body>
    </TaskAccordion.root>
  );
};

export default TaskAccordionWrapper;
