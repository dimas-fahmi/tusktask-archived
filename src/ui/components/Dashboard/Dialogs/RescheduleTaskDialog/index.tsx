"use client";

import { useTaskStore } from "@/src/lib/stores/ui/taskStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/shadcn/components/ui/dialog";
import React, { useEffect } from "react";
import { DatePicker } from "../../../DatePicker";
import { Controller, useForm } from "react-hook-form";
import {
  AlarmClock,
  ClockAlert,
  Gamepad2,
  Martini,
  Zap,
  Clock,
  Calendar,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { newTaskFormSchema } from "@/src/lib/zod/schemas/taskSchema";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { useUpdateTask } from "@/src/lib/hooks/mutations/useUpdateTasks";

const RescheduleTaskDialog = () => {
  // Pull states and setters from task store
  const { rescheduleDialogOpen, setRescheduleDialogOpen, activeTask } =
    useTaskStore();

  // Form
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(
      newTaskFormSchema.pick({ deadlineAt: true, reminderAt: true })
    ),
    mode: "onChange",
    defaultValues: {
      deadlineAt: null,
      reminderAt: null,
    },
  });

  const deadline = watch("deadlineAt");
  const reminder = watch("reminderAt");
  const isValidReminder =
    deadline && reminder ? deadline?.getTime() > reminder?.getTime() : true;

  useEffect(() => {
    if (!deadline) {
      setValue("reminderAt", undefined);
    }
  }, [deadline, setValue]);

  useEffect(() => {
    if (!rescheduleDialogOpen) {
      reset({ deadlineAt: null, reminderAt: null });
    }
  }, [rescheduleDialogOpen]);

  // Mutate task update
  const { mutate: updateTask, isPending: isUpdatingTask } = useUpdateTask(
    ["update", "task", "reschedule"],
    {
      onMutate: () => {
        setRescheduleDialogOpen(false);
      },
    }
  );

  // Helper functions for date calculations
  const getDateInHours = (hours: number) => {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    return date;
  };

  const getDateInDays = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  };

  const getDateBeforeDeadline = (deadline: Date, hours: number) => {
    const date = new Date(deadline);
    date.setHours(date.getHours() - hours);
    return date;
  };

  return (
    <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
      <DialogHeader className="sr-only">
        <DialogTitle>Reschedule Task</DialogTitle>
        <DialogDescription>
          Set new deadline and reminder for this task
        </DialogDescription>
      </DialogHeader>

      <DialogContent className="p-4">
        {/* Form */}
        <form
          onSubmit={handleSubmit((data) => {
            if (!activeTask) return;
            updateTask({
              old: activeTask,
              req: {
                id: activeTask?.id,
                newValues: {
                  ...data,
                },
              },
            });
          })}
          className="space-y-4"
        >
          {/* Deadline  */}
          <div>
            <header className="mb-2 flex items-center justify-between">
              <h1 className="flex items-center font-header text-xl gap-2">
                <ClockAlert className="w-5 h-5" />
                Deadline
              </h1>

              <div
                className={`${deadline ? "opacity-100" : "opacity-0"} transition-all duration-100 flex items-center gap-2`}
              >
                <Button
                  variant={"destructive"}
                  type="button"
                  className="flex border px-4 py-2 rounded-md items-center gap-1 text-xs cursor-pointer hover:bg-accent transition-colors duration-300"
                  onClick={() => {
                    setValue("deadlineAt", null, {
                      shouldValidate: true,
                    });
                  }}
                  size={"sm"}
                >
                  Clear
                </Button>
              </div>
            </header>

            {/* Container */}
            <div>
              <Controller
                control={control}
                name="deadlineAt"
                render={({ field }) => (
                  <DatePicker
                    value={field.value || undefined}
                    onChange={field.onChange}
                    classes={{ triggerClass: "w-full" }}
                    label="Set Deadline"
                    calendarProps={{
                      disabled: {
                        before: new Date(),
                      },
                    }}
                  />
                )}
              />
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2">
              <button
                type="button"
                className="flex border px-4 py-2 rounded-md items-center gap-1 text-xs cursor-pointer hover:bg-accent transition-colors"
                onClick={() => {
                  setValue("deadlineAt", getDateInHours(1), {
                    shouldValidate: true,
                  });
                }}
              >
                <Zap className="w-4 h-4" /> In 1 Hour
              </button>
              <button
                type="button"
                className="flex border px-4 py-2 rounded-md items-center gap-1 text-xs cursor-pointer hover:bg-accent transition-colors"
                onClick={() => {
                  setValue("deadlineAt", getDateInDays(1), {
                    shouldValidate: true,
                  });
                }}
              >
                <Martini className="w-4 h-4" /> Tomorrow
              </button>
              <button
                type="button"
                className="flex border px-4 py-2 rounded-md items-center gap-1 text-xs cursor-pointer hover:bg-accent transition-colors"
                onClick={() => {
                  setValue("deadlineAt", getDateInDays(7), {
                    shouldValidate: true,
                  });
                }}
              >
                <Gamepad2 className="w-4 h-4" /> Next Week
              </button>
            </div>
          </div>

          {/* Reminder  */}
          <div>
            <h1 className="flex items-center font-header text-xl gap-2 mb-2">
              <AlarmClock className="w-5 h-5" />
              Reminder
            </h1>

            {/* Container */}
            <div>
              <Controller
                control={control}
                name="reminderAt"
                render={({ field }) => (
                  <DatePicker
                    value={field.value || undefined}
                    onChange={field.onChange}
                    classes={{ triggerClass: "w-full" }}
                    label="Set Reminder"
                    calendarProps={{
                      modifiers: {
                        deadline: deadline || undefined,
                      },
                      modifiersClassNames: {
                        deadline:
                          "bg-destructive text-destructive-foreground rounded-md hover:bg-destructive",
                      },
                      disabled: {
                        before: new Date(),
                        after: deadline ? new Date(deadline) : undefined,
                      },
                    }}
                    disabled={!deadline}
                  />
                )}
              />
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="flex border px-4 py-2 rounded-md items-center gap-1 text-xs cursor-pointer hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  if (deadline) {
                    setValue("reminderAt", getDateBeforeDeadline(deadline, 1), {
                      shouldValidate: true,
                    });
                  }
                }}
                disabled={!deadline}
              >
                <Clock className="w-4 h-4" /> 1 Hour Before
              </button>
              <button
                type="button"
                className="flex border px-4 py-2 rounded-md items-center gap-1 text-xs cursor-pointer hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  if (deadline) {
                    setValue(
                      "reminderAt",
                      getDateBeforeDeadline(deadline, 24),
                      { shouldValidate: true }
                    );
                  }
                }}
                disabled={!deadline}
              >
                <Calendar className="w-4 h-4" /> 1 Day Before
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => setRescheduleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button disabled={!isValid || !isValidReminder || isUpdatingTask}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleTaskDialog;
