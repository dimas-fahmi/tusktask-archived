"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import React, { createContext, useContext, useState } from "react";
import type { Task } from "@/src/db/schema/tasks";
import { cn } from "@/src/ui/shadcn/lib/utils";
import TaskCard from "../TaskCard";
export interface TaskAccordionContextValues {
  open: boolean;
  setOpen: (n: boolean) => void;
}

const TaskAccordionContext = createContext<TaskAccordionContextValues | null>(
  null,
);

const useTaskAccordionContext = () => {
  const context = useContext(TaskAccordionContext);

  if (!context) {
    throw new Error(
      "TaskAccordionContext only available inside the TaskAccordion.root element",
    );
  }

  return context;
};

export interface TaskAccordionProps {
  defaultOpen?: boolean;
  children?: React.ReactNode;
}

const root = ({ defaultOpen, children }: TaskAccordionProps) => {
  const [open, setOpen] = useState(defaultOpen || false);

  return (
    <TaskAccordionContext.Provider
      value={{
        open,
        setOpen,
      }}
    >
      <div>{children}</div>
    </TaskAccordionContext.Provider>
  );
};

export interface TaskAccordionTriggerProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  title: string;
  label: string;
  variant?: "default" | "destructive";
}

const trigger = React.forwardRef<HTMLButtonElement, TaskAccordionTriggerProps>(
  ({ title, label, variant, className, ...props }, ref) => {
    const { open, setOpen } = useTaskAccordionContext();
    let activeClass = {
      positive: "bg-primary text-primary-foreground",
      negative: "hover:bg-primary hover:text-primary-foreground",
    };

    switch (variant) {
      case "destructive":
        activeClass = {
          positive: "bg-destructive text-destructive-foreground",
          negative: "hover:bg-destructive/10 text-destructive",
        };
        break;
      default:
        activeClass = {
          positive: "bg-primary text-primary-foreground",
          negative: "hover:bg-primary hover:text-primary-foreground",
        };
        break;
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setOpen(!open)}
        {...props}
        className={cn(
          `capitalize flex w-full text-left cursor-pointer group/button items-center gap-4 p-2 border rounded-md ${open ? activeClass.positive : activeClass.negative} shadow-md transition-all duration-200`,
          className,
        )}
      >
        {/* Icon */}
        <div className="group-active/button:scale-90 transition-all duration-300">
          <ChevronDown
            className={`${open ? "" : "-rotate-z-90"} transition-all duration-300`}
          />
        </div>

        {/* Title */}
        <h1 className="flex-1 font-header">{title}</h1>

        {/* Label */}
        <div className="text-sm opacity-70">{label}</div>
      </button>
    );
  },
);

const body = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => {
  const { open } = useTaskAccordionContext();

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={
        open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
      }
      transition={
        open
          ? {
              duration: 0.3,
              ease: "easeInOut",
              type: "spring",
              damping: 10,
              stiffness: 100,
            }
          : {
              duration: 0.3,
              ease: "easeInOut",
            }
      }
      className="overflow-hidden"
    >
      <div ref={ref} {...props} />
    </motion.div>
  );
});

const itemContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        `grid grid-cols-1 md:grid-cols-3 gap-4 py-4 md:p-4`,
        className,
      )}
    />
  );
});

const item = ({ task }: { task: Task }) => {
  return <TaskCard task={task} />;
};

const TaskAccordion = {
  root,
  trigger,
  body,
  item,
  itemContainer,
};

export default TaskAccordion;
