import type { HighlightedWord } from "..";

const baseStyle = "bg-primary text-primary-foreground"; // padding helps readability

export const rRuleHighlightLists: HighlightedWord[] = [
  // Frequencies
  { word: "every", className: `${baseStyle}` },
  { word: "daily", className: `${baseStyle}` },
  { word: "everyday", className: `${baseStyle}` },
  { word: "weekly", className: `${baseStyle}` },
  { word: "monthly", className: `${baseStyle}` },
  { word: "yearly", className: `${baseStyle}` },

  // Interval units
  { word: "day", className: `${baseStyle}` },
  { word: "days", className: `${baseStyle}` },
  { word: "week", className: `${baseStyle}` },
  { word: "weeks", className: `${baseStyle}` },
  { word: "month", className: `${baseStyle}` },
  { word: "months", className: `${baseStyle}` },
  { word: "year", className: `${baseStyle}` },
  { word: "years", className: `${baseStyle}` },

  // Connectors / modifiers
  { word: "on", className: `${baseStyle}` },
  { word: "at", className: `${baseStyle}` },
  { word: "until", className: `${baseStyle}` },
  { word: "by", className: `${baseStyle}` },
  { word: "for", className: `${baseStyle}` },

  // Count / occurrences
  { word: "times", className: `${baseStyle}` },
  { word: "occurrences", className: `${baseStyle}` },
  { word: "forever", className: `${baseStyle}` },

  // Weekdays
  { word: "monday", className: `${baseStyle}` },
  { word: "tuesday", className: `${baseStyle}` },
  { word: "wednesday", className: `${baseStyle}` },
  { word: "thursday", className: `${baseStyle}` },
  { word: "friday", className: `${baseStyle}` },
  { word: "saturday", className: `${baseStyle}` },
  { word: "sunday", className: `${baseStyle}` },

  // Months
  { word: "january", className: `${baseStyle}` },
  { word: "february", className: `${baseStyle}` },
  { word: "march", className: `${baseStyle}` },
  { word: "april", className: `${baseStyle}` },
  { word: "may", className: `${baseStyle}` },
  { word: "june", className: `${baseStyle}` },
  { word: "july", className: `${baseStyle}` },
  { word: "august", className: `${baseStyle}` },
  { word: "september", className: `${baseStyle}` },
  { word: "october", className: `${baseStyle}` },
  { word: "november", className: `${baseStyle}` },
  { word: "december", className: `${baseStyle}` },
];
