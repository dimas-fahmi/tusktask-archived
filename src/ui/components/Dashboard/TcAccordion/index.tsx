"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { formatDistance, isPast } from "date-fns";
import { ChevronRight, Clock } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState } from "react";
import { DEFAULT_ICON } from "@/src/lib/configs";
import type { TaskApp } from "@/src/lib/types/tasks";
import { truncateString } from "@/src/lib/utils/truncateString";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/src/ui/shadcn/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/ui/shadcn/components/ui/tooltip";
import { cn } from "@/src/ui/shadcn/lib/utils";
import RenderLucide from "../../RenderLucide";
import OnProcess from "../Indicators/OnProcess";
import TaskCardContextMenu from "../TaskCard/TaskCardContextMenu";
import TaskScratchButton, {
  type TaskScratchButtonProps,
} from "../TaskScratchButton";

export interface TcAccordionContextValues {
  open: boolean;
  setOpen: (n: boolean) => void;
}

const TcAccordionContext = createContext<TcAccordionContextValues | null>(null);

const useTcAccordionContext = () => {
  const context = useContext(TcAccordionContext);
  if (!context) {
    throw new Error("TcAccordionContext can only be used inside its provider");
  }

  return context;
};

export interface TcAccordionRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
}

const root = React.forwardRef<HTMLDivElement, TcAccordionRootProps>(
  ({ defaultOpen, className, ...props }, ref) => {
    // Open State
    const [open, setOpen] = useState(defaultOpen || false);

    return (
      <TcAccordionContext.Provider
        value={{
          open,
          setOpen,
        }}
      >
        <div ref={ref} {...props} className={cn(``, className)} />
      </TcAccordionContext.Provider>
    );
  },
);

root.displayName = "TcAccordion.root";

export interface TcAccordionTriggerClasses {
  container?: string;
  iconContainer?: string;
  icon?: string;
  titleAndActionContainer?: string;
  titleContainer?: string;
  actionContainer?: string;
}

export const TcAccordionTriggerVariants = cva("", {
  variants: {
    variant: {
      default: "text-foreground border-border",
      destructive: "text-destructive border-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface TcAccordionTriggerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className">,
    VariantProps<typeof TcAccordionTriggerVariants> {
  classes?: TcAccordionTriggerClasses;
  title: string;
  titleTooltip: string;
  action?: React.ReactNode;
  actionTooltip?: string;
}

const trigger = React.forwardRef<HTMLDivElement, TcAccordionTriggerProps>(
  (
    { variant, classes, title, action, titleTooltip, actionTooltip, ...props },
    ref,
  ) => {
    const { open, setOpen } = useTcAccordionContext();

    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          `flex items-center w-full cursor-pointer border-b pb-1 group/button`,
          TcAccordionTriggerVariants({ variant }),
          classes?.container,
        )}
        onClick={(e) => {
          props?.onClick?.(e);

          setOpen(!open);
        }}
      >
        {/* Icon */}
        <div
          className={cn(
            "w-6 h-6 flex items-center justify-center",
            classes?.iconContainer,
          )}
        >
          <ChevronRight
            className={cn(
              "w-5 h-5",
              `${open ? "rotate-z-90" : ""} transition-all duration-300`,
              classes?.icon,
            )}
          />
        </div>

        {/* Title & Action */}
        <div
          className={cn(
            "flex justify-between flex-1 text-sm font-semibold",
            classes?.titleAndActionContainer,
          )}
        >
          {/* Title */}
          <div
            className={cn("font-header font-semibold", classes?.titleContainer)}
          >
            <Tooltip>
              <TooltipTrigger>{title}</TooltipTrigger>
              <TooltipContent className="max-w-55 p-4">
                {titleTooltip}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Action */}
          <div className={cn("", classes?.actionContainer)}>
            <Tooltip>
              <TooltipTrigger asChild>{action}</TooltipTrigger>
              <TooltipContent className="max-w-55 p-4">
                {actionTooltip}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  },
);

trigger.displayName = "TcAccordion.trigger";

export interface TcAccordionBodyClasses {
  rootContainer?: string;
  bodyContainer?: string;
}

export interface TcAccordionBodyProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  classes?: TcAccordionBodyClasses;
}

const body = React.forwardRef<HTMLDivElement, TcAccordionBodyProps>(
  ({ classes, ...props }, ref) => {
    const { open } = useTcAccordionContext();
    return (
      <motion.div
        initial={{ height: 0 }}
        animate={open ? { height: "auto" } : { height: 0 }}
        transition={
          !open
            ? { duration: 0.3 }
            : {
                duration: 0.3,
                type: "spring",
                stiffness: 100,
                damping: 10,
              }
        }
        className={cn("overflow-hidden", classes?.rootContainer)}
      >
        <div
          ref={ref}
          {...props}
          className={cn("mt-4 pb-2", classes?.bodyContainer)}
        />
      </motion.div>
    );
  },
);

body.displayName = "TcAccordion.body";

export interface TcAccordionItemClasses {
  rootContainer?: string;
  scratchButtonContainer?: string;
  contentContainer?: string;
  nameAndDescriptionContainer?: string;
  name?: string;
  description?: string;
  actionContainer?: string;
  metadataContainer?: string;
  timeIcon?: string;
  dateIcon?: string;
  time?: string;
  date?: string;
  project?: string;
  deadlineInformationContainer?: string;
}

export interface TcAccordionItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  task: TaskApp;
  classes?: TcAccordionItemClasses;
  scratchButtonProps?: TaskScratchButtonProps;
  actions?: React.ReactNode;
}

const item = ({
  task,
  classes,
  scratchButtonProps,
  actions,
  ...props
}: TcAccordionItemProps) => {
  const isOverdue = task?.deadlineAt ? isPast(task?.deadlineAt) : false;
  const router = useRouter();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          onClick={() => {
            router.push(`/dashboard/tasks/detail/${task.id}`);
          }}
          {...props}
          className={cn(
            "flex cursor-pointer border-b pb-2 border-transparent hover:border-border ",
            classes?.rootContainer,
          )}
        >
          {/* Scratch Button */}
          <div
            className={cn(
              "flex justify-center",
              classes?.scratchButtonContainer,
            )}
          >
            <TaskScratchButton
              classes={{
                iconClassNames: "w-5 h-5",
              }}
              task={task}
              {...scratchButtonProps}
            />
          </div>

          {/* Content */}
          <div
            className={cn(
              "px-2 flex justify-between w-full",
              classes?.contentContainer,
            )}
          >
            {/* Name & Description */}
            <div className={cn("flex-1", classes?.nameAndDescriptionContainer)}>
              {/* Task Name */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <h1
                    className={cn(
                      "text-sm font-header font-semibold w-fit",
                      classes?.name,
                    )}
                  >
                    {truncateString(task?.name || "Untitled", 14, true)}
                  </h1>
                </TooltipTrigger>
                <TooltipContent>{task?.name || "Untitled"}</TooltipContent>
              </Tooltip>

              {/* Task Description */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <p
                    className={cn(
                      "text-xs font-body opacity-70 w-fit",
                      classes?.description,
                    )}
                  >
                    {truncateString(
                      task?.description || "No description",
                      24,
                      true,
                    )}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  {task?.description || "No description"}
                </TooltipContent>
              </Tooltip>

              {/* Metadata */}
              <div
                className={cn(
                  "mt-3 text-xs flex justify-between gap-2 w-full",
                  classes?.metadataContainer,
                )}
              >
                {/* Deadline Information */}
                {task?.deadlineAt && (
                  <div
                    className={cn(
                      `flex gap-2 ${isOverdue ? "text-destructive" : ""}`,
                      classes?.deadlineInformationContainer,
                    )}
                  >
                    <p
                      className={cn(
                        "flex capitalize items-center gap-1 text-xs opacity-70",
                        classes?.time,
                      )}
                    >
                      <Clock className={cn("w-3 h-3", classes?.timeIcon)} />
                      {task?.deadlineAt
                        ? formatDistance(task?.deadlineAt, new Date(), {
                            addSuffix: true,
                          })
                        : "Deadline not set"}
                    </p>
                  </div>
                )}

                {/* Project */}
                {task?.project && (
                  <p
                    className={cn(
                      "flex capitalize items-center gap-1 text-xs opacity-70",
                      classes?.project,
                    )}
                  >
                    <RenderLucide
                      iconName={task?.project?.icon || DEFAULT_ICON}
                      className="w-3 h-3"
                    />
                    {truncateString(task?.project?.name || "", 5, true)}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className={cn("", classes?.actionContainer)}>
              {actions}

              {/* Indicators */}
              {task?.taskStatus === "on_process" && !task?.completedAt && (
                <OnProcess />
              )}
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="min-w-55">
        <TaskCardContextMenu task={task} />
      </ContextMenuContent>
    </ContextMenu>
  );
};

item.displayName = "TcAccordion.item";

const TcAccordion = {
  root,
  trigger,
  body,
  item,
};

export default TcAccordion;
