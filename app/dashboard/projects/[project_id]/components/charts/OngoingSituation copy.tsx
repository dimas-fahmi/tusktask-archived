"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/ui/shadcn/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/src/ui/shadcn/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/ui/shadcn/components/ui/select";
import { CategorizedTasks } from "@/src/lib/utils/categorizedTasks";

export const description =
  "An interactive pie chart of ongoing tasks situation";

const chartConfig = {
  tasks: {
    label: "Tasks",
  },
  collection: {
    label: "Collection",
  },
  overdue: {
    label: "Overdue Tasks",
    color: "var(--chart-1)",
  },
  soon: {
    label: "Overdue Soon",
    color: "var(--chart-2)",
  },
  tomorrow: {
    label: "Overdue Tomorrow",
    color: "var(--chart-3)",
  },
  ongoing: {
    label: "Ongoing Tasks",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export interface SituationData {
  overdue: number;
  soon: number;
  tomorrow: number;
  ongoing: number;
}

export interface OngoingSituation {
  activeFilter: keyof CategorizedTasks | "soon" | undefined;
  setActiveFilter: (n: keyof CategorizedTasks) => void;
  data: SituationData;
}

export function OngoingSituation({
  activeFilter,
  setActiveFilter,
  data,
}: OngoingSituation) {
  const id = "ongoing-situation-chart";

  const situationData = [
    {
      collection: "overdue",
      tasks: data.overdue,
      fill: "var(--color-overdue)",
    },
    { collection: "soon", tasks: data.soon, fill: "var(--color-soon)" },
    {
      collection: "tomorrow",
      tasks: data.tomorrow,
      fill: "var(--color-tomorrow)",
    },
    {
      collection: "ongoing",
      tasks: data.ongoing,
      fill: "var(--color-ongoing)",
    },
  ];

  const descriptions: Record<keyof CategorizedTasks, string> = {
    overdue: "Showing active tasks that have passed their deadline date",
    overdueSoon: "Showing active tasks due within the next 24 hours",
    tomorrow: "Showing active tasks that are due tomorrow",
    ongoing: "Showing active tasks due later or without a deadline date",
    archived: "Showing tasks that have been archived and stored",
    completed: "Showing tasks that have been marked as completed",
  };

  const activeIndex = React.useMemo(
    () => situationData.findIndex((item) => item.collection === activeFilter),
    [activeFilter, data]
  );
  const collections = React.useMemo(
    () => situationData.map((item) => item.collection),
    []
  );

  const isNotRenderable =
    data?.ongoing < 1 &&
    data?.overdue < 1 &&
    data?.soon < 1 &&
    data?.tomorrow < 1;

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle className="text-2xl font-header">
            Ongoing Situation
          </CardTitle>
          <CardDescription>
            Here is your ongoing tasks report as of today
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart */}
        <div className="flex flex-1 justify-center pb-0">
          <ChartContainer
            id={id}
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[300px]"
          >
            {isNotRenderable ? (
              <div className="w-full h-full text-center flex items-center justify-center">
                Not enough data, report will be shown here once data is
                sufficient.
              </div>
            ) : (
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      className="min-w-38 max-w-38"
                      hideLabel
                    />
                  }
                />
                <Pie
                  data={situationData}
                  dataKey="tasks"
                  nameKey="collection"
                  innerRadius={60}
                  strokeWidth={5}
                  activeIndex={activeIndex}
                  activeShape={({
                    outerRadius = 0,
                    ...props
                  }: PieSectorDataItem) => (
                    <g>
                      <Sector {...props} outerRadius={outerRadius + 10} />
                      <Sector
                        {...props}
                        outerRadius={outerRadius + 25}
                        innerRadius={outerRadius + 12}
                      />
                    </g>
                  )}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {situationData[
                                activeIndex
                              ].tasks.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              {String(activeFilter).charAt(0).toUpperCase() +
                                String(activeFilter).slice(1)}
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            )}
          </ChartContainer>
        </div>

        {/* Description */}
        <div className="mt-4">
          <h1 className="text-xl font-header">Description</h1>
          <p className="text-xs">
            {
              descriptions[
                activeFilter === "soon"
                  ? "overdueSoon"
                  : activeFilter || "overdue"
              ]
            }
          </p>
        </div>

        {/* Select */}
        <div className="mt-4">
          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger
              className="h-7 w-full border border-card-foreground/20 shadow-md"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl">
              {collections.map((key) => {
                const config = chartConfig[key as keyof typeof chartConfig];

                if (!config) {
                  return null;
                }

                return (
                  <SelectItem
                    key={key}
                    value={key}
                    className="rounded-lg [&_span]:flex"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className="flex h-3 w-3 shrink-0 rounded-xs"
                        style={{
                          backgroundColor: `var(--color-${key})`,
                        }}
                      />
                      {config?.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
