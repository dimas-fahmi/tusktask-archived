"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/ui/shadcn/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/src/ui/shadcn/components/ui/chart";

export const description = "A donut chart with text";

const chartData = [
  { collection: "overdue", count: 4, fill: "var(--color-overdue)" },
  { collection: "soon", count: 3, fill: "var(--color-soon)" },
  { collection: "tomorrow", count: 5, fill: "var(--color-tomorrow)" },
  { collection: "ongoing", count: 11, fill: "var(--color-ongoing)" },
];

const chartConfig = {
  count: {
    label: "Tasks Count",
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

export function ChartPieDonutText() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className="gap-4" hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="collection"
              innerRadius={60}
              strokeWidth={5}
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
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Tasks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
