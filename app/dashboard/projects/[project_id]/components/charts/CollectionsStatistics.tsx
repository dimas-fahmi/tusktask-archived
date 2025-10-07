"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import React from "react";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/src/ui/shadcn/components/ui/chart";
import { CategorizedTasks } from "@/src/lib/utils/categorizedTasks";

export const description = "A horizontal bar chart";

const chartConfig = {
  tasks: {
    label: "Tasks",
    color: "var(--chart-1)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig;

export function CollectionsStatistics({
  categorizedTasks,
}: {
  categorizedTasks: CategorizedTasks;
}) {
  const collectionData = [
    { collection: "overdue", tasks: categorizedTasks.overdue.length },
    { collection: "soon", tasks: categorizedTasks.overdueSoon.length },
    { collection: "tomorrow", tasks: categorizedTasks.tomorrow.length },
    { collection: "ongoing", tasks: categorizedTasks.ongoing.length },
    { collection: "archived", tasks: categorizedTasks.archived.length },
    { collection: "completed", tasks: categorizedTasks.completed.length },
  ];

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <div className="grid gap-1">
          <CardTitle className="text-2xl font-header">
            Collections Statistic
          </CardTitle>
          <CardDescription>
            This is the task statistic as of today
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={collectionData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="collection"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="tasks" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="tasks"
              layout="vertical"
              fill="var(--color-tasks)"
              radius={4}
            >
              <LabelList
                dataKey="collection"
                position="insideLeft"
                offset={8}
                className="fill-(--color-label) capitalize"
                fontSize={12}
              />
              <LabelList
                dataKey="tasks"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>

        <div className="grid grid-cols-1 gap-2 text-sm mt-4">
          <div className="mt-4">
            <h1 className="text-xl font-header">Statistics</h1>
            <div className="grid grid-cols-3 w-full gap-2 mt-2">
              {collectionData.map((item, index) => (
                <div
                  key={index}
                  className="border flex flex-col justify-center items-center p-2 rounded-md"
                >
                  <span className="text-xs capitalize">{item.collection}</span>
                  <span className="text-xs">{item.tasks}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
