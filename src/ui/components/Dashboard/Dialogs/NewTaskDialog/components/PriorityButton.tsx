import React from "react";
import { FieldValues, Path, UseFormSetValue } from "react-hook-form";
import { NewTaskFormSchema } from "@/src/lib/zod/schemas/taskSchema";
import { PRIORITIES } from "@/src/db/schema/configs";

export interface PriorityButtonProps<T extends FieldValues> {
  priority?: string;
  value: (typeof PRIORITIES)[number];
  setValue: UseFormSetValue<T>;
}

const PriorityButton = ({
  priority,
  setValue,
  value,
}: PriorityButtonProps<NewTaskFormSchema>) => {
  return (
    <button
      type="button"
      className={`${priority?.toLowerCase() === value ? "bg-primary text-primary-foreground" : "hover:bg-primary hover:text-primary-foreground "} p-2 rounded-md border text-xs transition-all duration-300 cursor-pointer capitalize`}
      onClick={() => {
        setValue("taskPriority" as Path<NewTaskFormSchema>, value);
      }}
    >
      {value}
    </button>
  );
};

export default PriorityButton;
