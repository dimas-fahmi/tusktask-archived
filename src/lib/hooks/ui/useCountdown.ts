"use client";

import { differenceInSeconds, isPast, isValid, parseISO } from "date-fns";
import { useCallback } from "react";

export interface UseCountdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  totalSeconds: number;
  diff: number;
  isValid: boolean;
}

export const useCountdown = (date?: Date | string | null) => {
  const calculateTimeLeft = useCallback((): UseCountdown => {
    const result = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: false,
      totalSeconds: 0,
      diff: 0,
      isValid: false,
    };

    const deadline = typeof date === "string" ? parseISO(date) : date;

    if (!deadline || !isValid(deadline)) {
      return result;
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
      isValid: isValid(deadline),
      totalSeconds,
      diff,
    };
  }, [date]);

  return {
    calculateTimeLeft,
  };
};
