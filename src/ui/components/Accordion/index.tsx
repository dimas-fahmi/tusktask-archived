"use client";

import { Minus, Plus } from "lucide-react";
import React, { createContext, useContext, useId, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../../shadcn/lib/utils";

// Accordion Context Interface
export interface AccordionContextValues {
  open: string | null;
  setOpen: React.Dispatch<React.SetStateAction<string | null>>;
}

// Accordion Context
const AccordionContext = createContext<AccordionContextValues | null>(null);

// Accordion Root
export interface AccordionRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionRootProps>(
  ({ className, children, ...props }, ref) => {
    // Open State
    const [open, setOpen] = useState<AccordionContextValues["open"]>(null);

    return (
      <AccordionContext.Provider value={{ open, setOpen }}>
        {/* Accordion Container */}
        <div
          className={cn("grid grid-cols-1 gap-6", className)}
          {...props}
          ref={ref}
        >
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { index: index + 1 } as {
                index: number;
              });
            }
            return child;
          })}
        </div>
      </AccordionContext.Provider>
    );
  }
);

AccordionRoot.displayName = "AccordionRoot";

// Accordion Props
export interface AccordionItemProps {
  title: string;
  content: string;
  index?: number;
}

// Accordion Item
const AccordionItem = ({ content, title, index }: AccordionItemProps) => {
  // Unique Id
  const id = useId();

  // Get Context Values and Setters
  const context = useContext(AccordionContext);

  // Validate Context
  if (!context) {
    throw new Error("Accordion Item must be placed inside Accordion component");
  }

  // Destructure
  const { open, setOpen } = context;

  return (
    <div
      className={`${
        open === id ? "bg-primary text-primary-foreground" : ""
      } p-6 md:px-16 rounded-4xl border-[1px_1px_7px_1px] overflow-hidden`}
    >
      {/* Accordion Trigger */}
      <button
        className="w-full min-h-[120px] max-h-[120px] flex justify-between cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((open) => {
            if (open === id) {
              return null;
            }

            return id;
          });
        }}
      >
        {/* Accordion Title */}
        <div className="flex items-center justify-center gap-4 md:gap-6">
          {/* Index */}
          <div className="text-6xl">{String(index).padStart(2, "0")}</div>

          {/* Title */}
          <div>{title}</div>
        </div>

        {/* Accordion Trigger Button */}
        <div className="flex items-center justify-center">
          <motion.div
            initial={{ rotate: 0 }}
            animate={open === id ? { rotate: 180 } : { rotate: 0 }}
            transition={{
              duration: 0.3,
            }}
            className="p-2 bg-tertiary-background border rounded-full w-14 h-14 flex items-center justify-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((open) => {
                if (open === id) {
                  return null;
                }

                return id;
              });
            }}
          >
            {open === id ? <Minus size={40} /> : <Plus size={40} />}
          </motion.div>
        </div>
      </button>

      {/* Accordion Content */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={
          open === id
            ? { height: "auto", opacity: 1 }
            : { height: 0, opacity: 0 }
        }
        transition={
          open === id
            ? {
                duration: 0.3,
                ease: "easeInOut",
                type: "spring",
                damping: 6,
                stiffness: 100,
              }
            : {
                duration: 0.3,
                ease: "easeInOut",
              }
        }
        className="overflow-hidden"
      >
        <div className={`${open === id ? "border-t-2" : ""} py-6`}>
          {content}
        </div>
      </motion.div>
    </div>
  );
};

const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
});

export default Accordion;
