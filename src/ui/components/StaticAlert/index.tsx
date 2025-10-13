"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { ChevronUp, CircleAlert, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import { cn } from "../../shadcn/lib/utils";

export const staticAlertVariants = cva("p-4 rounded-md", {
  variants: {
    variant: {
      default: "bg-secondary text-secondary-foreground",
      destructive: "bg-destructive/10 text-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface StaticAlertClasses {
  container?: string;
  header?: string;
  headerIcon?: string;
  headerTitle?: string;
  headerContent?: string;
  alertCloseButton?: string;
  alertCloseButtonIcon?: string;
  body?: string;
}

export interface StaticAlertProps
  extends VariantProps<typeof staticAlertVariants> {
  classes?: StaticAlertClasses;
  icon?: LucideIcon;
  title: string;
  body: React.ReactNode;
  onClose?: () => void;
  closeIcon?: LucideIcon;
}

const StaticAlert = ({
  variant,
  classes,
  icon,
  body,
  title,
  onClose,
  closeIcon,
}: StaticAlertProps) => {
  const [hidden, setHidden] = useState(false);
  const Icon = icon ?? CircleAlert;
  const CloseIcon = closeIcon ?? ChevronUp;

  return (
    <div className={cn(staticAlertVariants({ variant }), classes?.container)}>
      <header
        className={cn(
          "flex gap-2 items-center justify-between",
          classes?.header,
        )}
      >
        {/* Header Content */}
        <div className={cn("flex gap-2 items-center", classes?.headerContent)}>
          {/* Icon */}
          <span>
            <Icon className={cn("", classes?.headerIcon)} />
          </span>

          {/* Title */}
          <span>
            <h1 className={cn("text-base", classes?.headerTitle)}>{title}</h1>
          </span>
        </div>

        {/* Close Button */}
        <button
          type="button"
          className={cn("cursor-pointer", classes?.alertCloseButton)}
          onClick={() => {
            if (!onClose) {
              setHidden((prev) => !prev);
            } else {
              onClose?.();
            }
          }}
        >
          <CloseIcon
            className={cn(
              `${hidden ? "rotate-z-180" : ""} transition-all duration-300 w-4 h-4`,
              classes?.alertCloseButtonIcon,
            )}
          />
        </button>
      </header>

      {/* Body */}
      <motion.div
        initial={{ height: "auto" }}
        animate={hidden ? { height: 0 } : { height: "auto" }}
        transition={{
          duration: 0.3,
        }}
        className={cn("text-sm overflow-hidden", classes?.body)}
      >
        <div className="mt-4">{body}</div>
      </motion.div>
    </div>
  );
};

export default StaticAlert;
