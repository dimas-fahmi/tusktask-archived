"use client";

import React from "react";
import CircularProgress from "../CircularProgress";
import { Circle, Clock } from "lucide-react";
import { TaskCardProps } from ".";
import { formatDistance } from "date-fns";
import { useRouter } from "next/navigation";

const Card = React.forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, ...props }, ref) => {
    const router = useRouter();
    return (
      <div
        onClick={() => {
          router.push(`/dashboard/tasks/${task?.id}`);
        }}
        ref={ref}
        className="group/card border min-h-37 max-h-37 p-4 rounded-md cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex flex-col"
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          {/* Task Name */}
          <h2
            className="text-sm font-header font-semibold line-clamp-1"
            title={task?.name || "Untitled"}
          >
            {task?.name}
          </h2>

          {/* Complete Button */}
          <button
            title="Mark this as completed?"
            className="cursor-pointer opacity-50 hover:opacity-100 transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Circle />
          </button>
        </div>

        {/* Details */}
        <div className="text-xs flex flex-1">
          {/* Descriptions & Deadline */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Description */}
            <p
              className="overflow-hidden font-body opacity-70 line-clamp-2 flex-1"
              title={task?.description || "No description"}
            >
              {task?.description || "No description"}
            </p>

            {/* Deadline */}
            <div className="flex items-center gap-1 mt-10">
              <Clock className="w-3 h-3" />{" "}
              <span>
                {task?.deadlineAt
                  ? formatDistance(new Date(task?.deadlineAt), new Date(), {
                      addSuffix: true,
                    })
                  : "Deadline's not set"}
              </span>
            </div>
          </div>

          {/* Completion Percentage */}
          <div className="pt-4 flex items-end">
            <CircularProgress
              size={50}
              strokeWidth={5}
              totalNumber={1}
              currentNumber={0}
            />
          </div>
        </div>
      </div>
    );
  }
);

Card.displayName = "TaksCard";

export default Card;
