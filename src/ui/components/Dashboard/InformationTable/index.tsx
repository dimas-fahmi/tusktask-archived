import { Clock1, ClockAlert, Info, LucideIcon, Zap } from "lucide-react";
import React from "react";
import PriorityBadge, { PriorityBadgeProps } from "../PriorityBadge";

export interface InformationObject {
  icon: LucideIcon;
  title: string;
  content: React.ReactNode;
}

export interface InformationTableProps {
  deadline?: Date | null;
  priorityLevel?: PriorityBadgeProps["priority"];
  status?: string;
  rows?: InformationObject[];
  rowsAfter?: InformationObject[];
}

const InformationTable = ({
  deadline,
  priorityLevel,
  status,
  rows,
  rowsAfter,
}: InformationTableProps) => {
  return (
    <table className="w-full text-xs border rounded-md block p-4">
      <tbody className="grid grid-cols-1 w-full gap-2">
        {/* Rows Before */}
        {rows &&
          Array.isArray(rows) &&
          rows.length > 0 &&
          rows.map((item, index) => {
            const Icon = item.icon;
            return (
              <tr className="grid grid-cols-2" key={index}>
                <td className="flex items-center gap-1.5 opacity-70">
                  <Icon className={"w-5 h-5"} />
                  {item.title}
                </td>
                <td className="flex items-center">{item.content}</td>
              </tr>
            );
          })}

        {/* Deadline */}
        {deadline && (
          <tr className="grid grid-cols-2 w-full">
            <td className="flex items-center gap-1.5 opacity-70">
              <ClockAlert className={"w-5 h-5"} />
              Deadline
            </td>
            <td className="flex items-center">
              {deadline ? "Today, 21 July 2025" : "Not set"}
            </td>
          </tr>
        )}

        {/* Time */}
        {deadline && (
          <tr className="grid grid-cols-2">
            <td className="flex items-center gap-1.5 opacity-70">
              <Clock1 className={"w-5 h-5"} />
              Time
            </td>
            <td className="flex items-center">
              {deadline ? "10:00 pm" : "Not set"}
            </td>
          </tr>
        )}

        {/* Priority */}
        <tr className="grid grid-cols-2">
          <td className="flex items-center gap-1.5 opacity-70">
            <Zap className={"w-5 h-5"} />
            Priority Level
          </td>
          <td className="flex items-center">
            <PriorityBadge
              priority={priorityLevel || "low"}
              className="p-0 px-4"
            />
          </td>
        </tr>

        {/* Status */}
        {status && (
          <tr className="grid grid-cols-2">
            <td className="flex items-center gap-1.5 opacity-70">
              <Info className={"w-5 h-5"} />
              Status
            </td>
            <td className="flex items-center">{status}</td>
          </tr>
        )}

        {/* Rows After */}
        {rowsAfter &&
          Array.isArray(rowsAfter) &&
          rowsAfter.length > 0 &&
          rowsAfter.map((item, index) => {
            const Icon = item.icon;
            return (
              <tr className="grid grid-cols-2" key={index}>
                <td className="flex items-center gap-1.5 opacity-70">
                  <Icon className={"w-5 h-5"} />
                  {item.title}
                </td>
                <td className="flex items-center">{item.content}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default InformationTable;
