"use client";

import React, { useState } from "react";

export type HighlightedWord = { word: string; className?: string };

export interface HighlightInputProps {
  words?: HighlightedWord[];
}

export default function HighlightInput({ words = [] }: HighlightInputProps) {
  const [value, setValue] = useState("");

  const highlight = (text: string) => {
    // Build regex: match either words from the array OR numbers
    const regex = new RegExp(
      `\\b(${words.map((w) => escapeRegExp(w.word)).join("|")})\\b|(\\d+)`,
      "gi"
    );

    const parts = text.split(regex);

    return parts.map((part, i) => {
      if (!part) return null; // skip empty splits

      // Numbers → always use fixed style
      if (/^\d+$/.test(part)) {
        return (
          <span key={i} className="bg-destructive/10 text-destructive">
            {part}
          </span>
        );
      }

      // Words from the config
      const wordConfig = words.find(
        (w) => w.word.toLowerCase() === part.toLowerCase()
      );

      if (wordConfig) {
        return (
          <span key={i} className={wordConfig.className}>
            {part}
          </span>
        );
      }

      // Everything else = plain text
      return <span key={i}>{part}</span>;
    });
  };

  // Escape regex special chars in case the word has symbols
  const escapeRegExp = (string: string) =>
    string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return (
    <div className="relative w-full border">
      {/* Highlighted mirror */}
      <div
        className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-words p-2 flex"
        suppressHydrationWarning
      >
        {highlight(value)}
      </div>
      {/* Input on top */}
      <input
        className="relative w-full p-2 border bg-transparent text-transparent caret-foreground"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        suppressHydrationWarning
      />
    </div>
  );
}
