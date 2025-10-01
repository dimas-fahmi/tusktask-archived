import { cn } from "@/src/ui/shadcn/lib/utils";
import React from "react";

/**
 * Props for customizing the CSS classes of the CircularProgress component.
 */
export interface CircularProgressClasses {
  /**
   * Additional classes for the container div.
   *
   * @example
   * ```tsx
   * containerClass="p-4 bg-gray-100 rounded-lg"
   * ```
   */
  containerClass?: string;
  /**
   * Additional classes for the SVG element.
   *
   * @example
   * ```tsx
   * svgClass="drop-shadow-lg"
   * ```
   */
  svgClass?: string;
  /**
   * Additional classes for the track circle.
   * Use this to customize the background track's appearance, such as color.
   *
   * @example
   * ```tsx
   * trackClass="text-gray-300"
   * ```
   */
  trackClass?: string;
  /**
   * Additional classes for the progress circle.
   * Use this to customize the progress arc's appearance, such as color.
   *
   * @example
   * ```tsx
   * progressClass="text-blue-500"
   * ```
   */
  progressClass?: string;
  /**
   * Additional classes for the percentage label.
   * Use this to customize the label's appearance, such as color or font size.
   *
   * @example
   * ```tsx
   * labelClass="text-lg text-green-600 font-bold"
   * ```
   */
  labelClass?: string;
}

/**
 * Props for the CircularProgress component.
 */
export type CircularProgressProps = {
  /**
   * The total number of items or steps.
   *
   * @example 100
   */
  totalNumber: number;
  /**
   * The current number of completed items or steps.
   *
   * @example 75
   */
  currentNumber: number;
  /**
   * The size of the SVG (width and height in pixels).
   *
   * @default 100
   * @example 120
   */
  size?: number;
  /**
   * The stroke width of the circles.
   *
   * @default 10
   * @example 8
   */
  strokeWidth?: number;
  /**
   * Custom CSS classes for the component.
   *
   * The classes object allows fine-grained control over the styling of different parts of the component.
   * Since the component uses Tailwind's `currentColor` for strokes and inherits text color for the label,
   * you can change colors by applying Tailwind color classes (e.g., `text-blue-500`) to the relevant class props.
   *
   * @example
   * ```tsx
   * classes={{
   *   containerClass: "p-4",
   *   progressClass: "text-blue-500", // Changes progress arc to blue
   *   trackClass: "text-gray-300",    // Changes track to light gray
   *   labelClass: "text-blue-600 font-bold" // Changes label to dark blue and bold
   * }}
   * ```
   */
  classes?: CircularProgressClasses;
};

/**
 * A circular progress indicator component that displays the progress as a percentage
 * in a circular SVG, with a track and a progress arc. The percentage is shown in the center.
 *
 * The component is built with Tailwind CSS classes for styling. The track uses `text-muted` (light gray),
 * the progress uses `text-muted-foreground` (darker gray by default), and both circles use `stroke="currentColor"`
 * to inherit the text color. The label inherits the container's text color.
 *
 * To customize colors, apply Tailwind color classes via the `classes` prop:
 * - `progressClass`: Sets the progress arc color (e.g., `text-green-500` for green).
 * - `trackClass`: Sets the track color (e.g., `text-gray-200` for a lighter gray).
 * - `labelClass`: Sets the label color and other styles (e.g., `text-indigo-600 text-sm`).
 *
 * The SVG is rotated -90 degrees to start the progress from the top.
 *
 * @example Basic usage
 * ```tsx
 * <CircularProgress totalNumber={100} currentNumber={75} size={120} />
 * ```
 *
 * @example With custom colors and classes
 * ```tsx
 * <CircularProgress
 *   totalNumber={100}
 *   currentNumber={75}
 *   size={120}
 *   strokeWidth={8}
 *   classes={{
 *     containerClass: "p-6 bg-white rounded-full shadow-lg",
 *     svgClass: "scale-110",
 *     trackClass: "text-gray-200",
 *     progressClass: "text-emerald-500 transition-all duration-1000",
 *     labelClass: "text-emerald-600 font-semibold text-base"
 *   }}
 * />
 * ```
 *
 * @param {CircularProgressProps} props - The component props.
 * @returns {JSX.Element} The rendered circular progress indicator.
 */
const CircularProgress: React.FC<CircularProgressProps> = ({
  totalNumber,
  currentNumber,
  size = 100,
  strokeWidth = 10,
  classes,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(currentNumber / totalNumber, 1);
  const offset = circumference - progress * circumference;
  const percent = Math.round(progress * 100);

  return (
    <div
      className={cn(
        `flex flex-col items-center justify-center`,
        classes?.containerClass
      )}
    >
      <svg
        width={size}
        height={size}
        className={cn(`transform -rotate-90`, classes?.svgClass)}
      >
        <circle
          className={cn(`text-muted`, classes?.trackClass)}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn(`text-muted-foreground`, classes?.progressClass)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div
        className={cn(
          `absolute text-center text-xs font-medium`,
          classes?.labelClass
        )}
      >
        {percent}%
      </div>
    </div>
  );
};

export default CircularProgress;
