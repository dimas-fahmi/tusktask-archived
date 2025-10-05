"use client";

import { ChevronDown, Circle, Ellipsis } from "lucide-react";
import React, { createContext, useContext, useState } from "react";
import { motion } from "motion/react";
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
      <div className={`py-4 px-4 space-y-2`}>{children}</div>
    </motion.div>
  );
};

const item = () => {
  return (
    <div className="flex text-sm hover:bg-secondary hover:text-secondary-foreground transition-shadow duration-200 items-center cursor-pointer gap-1.5 p-2 border rounded-md">
      {/* Toggler */}
      <div>
        <Circle className="w-5 h-5 opacity-70" />
      </div>

      {/* Title */}
      <div className="flex-1 opacity-70">Brush My Teeth</div>

      {/* Controller */}
      <div>
        <button className="cursor-pointer">
          <Ellipsis />
        </button>
      </div>
    </div>
  );
};

const TaskAccordion = {
  root,
  trigger,
  body,
  item,
};

export default TaskAccordion;
