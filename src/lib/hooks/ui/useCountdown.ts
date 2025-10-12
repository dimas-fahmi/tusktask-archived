"use client";

import { Task } from "@/src/db/schema/tasks";
import { differenceInSeconds, isPast, isValid, parseISO } from "date-fns";
import { useCallback } from "react";

export const useCountdown = (task: Task) => {
  const calculateTimeLeft = useCallback(() => {
    const deadline =
      typeof task.deadlineAt === "string"
        ? parseISO(task.deadlineAt)
        : task.deadlineAt;

    if (!deadline || !isValid(deadline)) {
      return null;
    }

    const now = new Date();
    const totalSeconds = Math.abs(differenceInSeconds(deadline, now));
    const diff = now.getTime() - deadline.getTime();
    const isOverdue = isPast(deadline);

    return {
      days: Math.floor(totalSeconds / (60 * 60 * 24)),
      hours: Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60)),
      minutes: Math.floor((totalSeconds % (60 * 60)) / 60),
      seconds: totalSeconds % 60,
      isPast: isOverdue,
      totalSeconds,
      diff,
    };
  }, [task?.deadlineAt]);

  return {
    calculateTimeLeft,
  };
};
