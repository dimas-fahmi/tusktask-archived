"use client";

import { TaskApp } from "@/src/lib/types/tasks";
import { Card, CardContent } from "@/src/ui/shadcn/components/ui/card";
import React, { useState, useEffect } from "react";
import { Clock, AlertCircle } from "lucide-react";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { useTaskStore } from "@/src/lib/stores/ui/taskStore";
import { useCountdown } from "@/src/lib/hooks/ui/useCountdown";

const Countdown = ({ task }: { task: TaskApp }) => {
  const { setRescheduleDialogOpen } = useTaskStore();

  const { calculateTimeLeft } = useCountdown(task?.deadlineAt);

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  } | null>(calculateTimeLeft);

  useEffect(() => {
    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [task.deadlineAt]);

  if (!timeLeft) {
    return (
      <Card className="border-secondary">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-secondary-foreground">
            <Clock className="h-5 w-5" />
            <span className="text-sm">No deadline set</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col justify-center items-center gap-4">
      <div
        className={`text-4xl md:text-6xl font-header font-bold ${timeLeft.isPast ? "text-destructive" : "text-primary"}`}
        suppressHydrationWarning
      >
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </div>
    </div>
  );

  return (
    <Card
      className={`border-2 ${timeLeft.isPast ? "border-destructive" : "border-border"}`}
    >
      <CardContent
        className="flex flex-col justify-between h-full gap-4"
        suppressHydrationWarning
      >
        <div className="flex flex-col justify-between flex-1 gap-4">
          <div className="flex items-center gap-2">
            {timeLeft.isPast ? (
              <>
                <AlertCircle className="h-5 w-5 text-destructive" />
                <span className="text-sm font-medium text-destructive">
                  Overdue by
                </span>
              </>
            ) : (
              <>
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Time remaining
                </span>
              </>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4 flex-1 grid-rows-1 max-w-xl w-full mx-auto">
            <TimeUnit value={timeLeft.days} label="Days" />
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <TimeUnit value={timeLeft.minutes} label="Mins" />
            <TimeUnit value={timeLeft.seconds} label="Secs" />
          </div>
        </div>

        <Button
          className="block w-full"
          onClick={() => setRescheduleDialogOpen(true)}
        >
          Reschedule
        </Button>
      </CardContent>
    </Card>
  );
};

export default Countdown;
