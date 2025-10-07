"use client";

import { ChevronDown } from "lucide-react";
import React, { createContext, useContext, useState } from "react";
import { motion } from "motion/react";
import { Task } from "@/src/db/schema/tasks";
import TaskCard from "../TaskCard";
export interface TaskAccordionContextValues {
  open: boolean;
  setOpen: (n: boolean) => void;
}

const TaskAccordionContext = createContext<TaskAccordionContextValues | null>(
  null
);

const useTaskAccordionContext = () => {
  const context = useContext(TaskAccordionContext);

  if (!context) {
    throw new Error(
      "TaskAccordionContext only available inside the TaskAccordion.root element"
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

const trigger = ({
  title,
  label,
  variant,
}: {
  title: string;
  label: string;
  variant?: "default" | "destructive";
}) => {
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
      className={`flex w-full text-left cursor-pointer group/button items-center gap-4 p-2 border rounded-md ${open ? activeClass.positive : activeClass.negative} shadow-md transition-all duration-200`}
      onClick={() => setOpen(!open)}
    >
      {/* Icon */}
      <div className="group-active/button:scale-90 transition-all duration-300">
        <ChevronDown
          className={`${open ? "" : "-rotate-z-90"} transition-all duration-300`}
        />
      </div>

      {/* Title */}
      <div className="flex-1">{title}</div>

      {/* Label */}
      <div className="text-sm opacity-70">{label}</div>
    </button>
  );
};

const body = ({ children }: { children: React.ReactNode }) => {
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
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:md:grid-cols-3 xl:grid-cols-4 gap-4 p-4`}
      >
        {children}
      </div>
    </motion.div>
  );
};

const item = ({ task }: { task: Task }) => {
  return <TaskCard task={task} />;
};

const TaskAccordion = {
  root,
  trigger,
  body,
  item,
};

export default TaskAccordion;
