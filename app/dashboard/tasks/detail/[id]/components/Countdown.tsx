"use client";

import { AlertCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useCountdown } from "@/src/lib/hooks/ui/useCountdown";
import { useTaskStore } from "@/src/lib/stores/ui/taskStore";
import type { TaskApp } from "@/src/lib/types/tasks";
import { Button } from "@/src/ui/shadcn/components/ui/button";
import { Card, CardContent } from "@/src/ui/shadcn/components/ui/card";

const Countdown = ({ task }: { task: TaskApp }) => {
  const { openRescheduleDialog } = useTaskStore();

  const { calculateTimeLeft } = useCountdown(task?.deadlineAt);

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  } | null>(calculateTimeLeft);

  useEffect(() => {
    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

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
        className={`text-4xl font-header font-bold ${timeLeft.isPast ? "text-destructive" : "text-primary"}`}
        suppressHydrationWarning
      >
        {value.toString().padStart(2, "0")}
      </div>
      <div
        className={`text-xs uppercase ${timeLeft.isPast ? "text-destructive" : "text-muted-foreground"} tracking-wide`}
      >
        {label}
      </div>
    </div>
  );

  return (
    <Card
      className={`border-2 ${timeLeft.isPast ? "border-destructive/20 bg-destructive/20 text-destructive" : "border-border"}`}
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
          variant={timeLeft.isPast ? "destructive" : "default"}
          className="block w-full"
          onClick={() => openRescheduleDialog(task)}
        >
          Reschedule
        </Button>
      </CardContent>
    </Card>
  );
};

export default Countdown;
