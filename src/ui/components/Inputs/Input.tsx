"use client";

import { Eye, EyeClosed, LucideIcon } from "lucide-react";
import React, { useState } from "react";
import { cn } from "../../shadcn/lib/utils";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

export interface InputClasses {
  container?: string;
  icon?: string;
  input?: string;
}

export interface InputProps<T extends FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  icon: LucideIcon;
  classes?: InputClasses;
  control: Control<T>;
  name: keyof T;
  placeholder: string;
}

const Input = <T extends FieldValues>({
  icon,
  classes,
  control,
  name,
  placeholder,
  ...props
}: InputProps<T>) => {
  // Focus State
  const [focus, setFocus] = useState(false);
  const [hide, setHide] = useState(true);

  // Icons
  const Icon = icon;
  const HideIcon = hide ? EyeClosed : Eye;

  return (
    <Controller
      control={control}
      name={name as Path<T>}
      render={({ field, fieldState }) => (
        <div>
          {/* Input */}
          <div
            className={cn(
              `${focus ? "outline-2" : ""} ${fieldState?.error ? "outline-2 outline-destructive text-destructive" : ""} border flex items-center rounded-md`,
              classes?.container
            )}
          >
            {/* Icon */}
            <label htmlFor={name as Path<T>} className="p-2">
              <Icon className="opacity-50" />
            </label>
            <input
              id={name as Path<T>}
              {...props}
              {...field}
              className={cn("flex-1 py-2 px-1 outline-0", classes?.input)}
              onFocus={() => {
                setFocus(true);
              }}
              onBlur={() => {
                setFocus(false);
              }}
              placeholder={placeholder}
              type={hide && props?.type === "password" ? props.type : "text"}
              suppressHydrationWarning
            />
            {props?.type === "password" && (
              <button
                type="button"
                onClick={() => setHide((prev) => !prev)}
                className="p-2 cursor-pointer"
              >
                <HideIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Error */}
          {fieldState?.error && (
            <p className="text-xs mt-1.5 text-destructive">
              {fieldState?.error?.message}
            </p>
          )}
        </div>
      )}
    />
  );
};
Input.displayName = "Input";

export default Input;
