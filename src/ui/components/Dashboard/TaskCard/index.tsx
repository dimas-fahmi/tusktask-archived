import { Circle, Clock } from "lucide-react";
import React from "react";
import CircularProgress from "../CircularProgress";

const TaskCard = () => {
  return (
    <div className="group/card border p-4 rounded-md cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* Task Name */}
        <h2 className="text-sm font-semibold">Wallet App Design</h2>

        {/* Complete Button */}
        <button
          title="Mark this as completed?"
          className="cursor-pointer opacity-50 hover:opacity-100 transition-all duration-300"
        >
          <Circle />
        </button>
      </div>

      {/* Details */}
      <div className="text-xs flex items-center">
        {/* Descriptions & Deadline */}
        <div className="flex-1">
          {/* Description */}
          <p className="min-h-16 max-h-16 overflow-hidden opacity-80">
            No description
          </p>

          {/* Deadline */}
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> In 5 days
          </div>
        </div>

        {/* Completion Percentage */}
        <div className="pt-4">
          <CircularProgress
            size={50}
            strokeWidth={5}
            totalNumber={200}
            currentNumber={50}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
