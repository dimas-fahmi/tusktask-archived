"use client";

import { ChartBar, Diamond } from "lucide-react";
import { motion, type Variants } from "motion/react";
import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  Rectangle,
  XAxis,
  YAxis,
} from "recharts";
import { PRIORITIES } from "@/src/db/schema/configs";
import type { PriorityLevel } from "@/src/lib/types/tasks";
import type { CategorizedTasks } from "@/src/lib/utils/categorizedTasks";
import { CustomRadarDot } from "@/src/ui/components/Charts/Customs/CustomRadarDot";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/ui/shadcn/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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

export const description =
  "An interactive pie chart of ongoing tasks situation";

// Define variants for smoother mode switching
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0, transition: { duration: 0.3 }, height: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    height: "auto",
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const chartConfig = {
  tasks: {
    label: "Active Tasks",
    color: "var(--primary)",
  },
  collection: {
    label: "Collection",
  },
  low: {
    label: "Low",
    color: "var(--chart-1)",
  },
  medium: {
    label: "Medium",
    color: "var(--chart-2)",
  },
  high: {
    label: "High",
    color: "var(--chart-3)",
  },
  urgent: {
    label: "Urgent",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export interface PrioritySituationProps {
  activeFilter?: PriorityLevel;
  setActiveFilter?: (n?: PriorityLevel) => void;
  categorizedTasks: CategorizedTasks;
}

export function TaskPagePrioritySituation({
  activeFilter,
  setActiveFilter,
  categorizedTasks,
}: PrioritySituationProps) {
  const id = "priority-situation-chart";
  const [mode, setMode] = React.useState<"pie" | "bar">("pie");
  const filter: PriorityLevel = ((): PriorityLevel => {
    if (!activeFilter) return "medium";
    if (PRIORITIES.includes(activeFilter as (typeof PRIORITIES)[number])) {
      return activeFilter as PriorityLevel;
    }

    return "all";
  })();

  const situationData = [
    {
      collection: "low",
      label: "Low",
      tasks: categorizedTasks.lowPriority?.filter((item) => !item?.completedAt)
        ?.length,
      fill: "var(--color-low)",
    },
    {
      collection: "medium",
      label: "Medium",
      tasks: categorizedTasks.mediumPriority?.filter(
        (item) => !item?.completedAt,
      )?.length,
      fill: "var(--color-medium)",
    },
    {
      collection: "high",
      label: "High",
      tasks: categorizedTasks.highPriority?.filter((item) => !item?.completedAt)
        ?.length,
      fill: "var(--color-high)",
    },
    {
      collection: "urgent",
      label: "Urgent",
      tasks: categorizedTasks.urgentPriority?.filter(
        (item) => !item?.completedAt,
      )?.length,
      fill: "var(--color-urgent)",
    },
  ];

  const descriptions: Record<PriorityLevel, string> = {
    low: "Showing tasks flagged with low priority",
    medium: "Showing tasks flagged with medium priority",
    high: "Showing tasks flagged with high priority",
    urgent: "Showing tasks flagged with urgent priority",
    all: "Showing all priorities",
  };

  const activeIndex = React.useMemo(
    () => situationData.findIndex((item) => item.collection === activeFilter),
    [activeFilter, situationData.findIndex],
  );
  const collections = React.useMemo(
    () => situationData.map((item) => item.collection),
    [situationData.map],
  );

  return (
    <Card data-chart={id} className="flex flex-col justify-between">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle className="text-2xl font-header">
            Priority Situation
          </CardTitle>
          <CardDescription>
            This is your priority report for ongoing tasks.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {/* Style Picker */}
        <div className="flex justify-end mb-2">
          <div className="relative inline-flex border rounded-full w-42 justify-between">
            {["pie", "bar"].map((value) => {
              const Icon = value === "bar" ? ChartBar : Diamond;

              return (
                <button
                  type="button"
                  key={value}
                  onClick={() => setMode(value as "bar" | "pie")}
                  className={`${
                    mode === value ? "text-muted-foreground" : ""
                  } relative z-10 flex-1 py-1 text-center text-xs uppercase cursor-pointer`}
                >
                  <Icon className="block mx-auto w-4 h-4" />
                  {mode === value && (
                    <motion.div
                      layoutId="highlight"
                      className="absolute inset-0 z-[-1] bg-muted rounded-full shadow-sm border"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart - Pie */}
        <div className="flex-1">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={mode === "pie" ? "visible" : "exit"}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid flex-1 min-h-72 max-h-72 pb-0">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square h-full"
              >
                <RadarChart data={situationData}>
                  <ChartTooltip
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <PolarAngleAxis
                    onClickCapture={(data) => {
                      console.log(data);
                    }}
                    dataKey="collection"
                  />
                  <PolarGrid />
                  <Radar
                    dataKey="tasks"
                    fill="var(--color-tasks)"
                    fillOpacity={0.6}
                    dot={
                      <CustomRadarDot
                        cx={0}
                        cy={0}
                        onClick={(data) => {
                          setActiveFilter?.(
                            (data?.payload?.name as PriorityLevel) || "low",
                          );
                        }}
                        activeFilter={activeFilter}
                      />
                    }
                  />
                  <ChartLegend
                    className="mt-8"
                    content={<ChartLegendContent />}
                  />
                </RadarChart>
              </ChartContainer>
            </div>
          </motion.div>
        </div>

        {/* Chart - Bar */}
        <div className="flex-1 h-full mt-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={mode === "bar" ? "visible" : "exit"}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 min-h-72 max-h-72 pb-0">
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={situationData}
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
                    radius={4}
                    activeIndex={activeIndex}
                    className="cursor-pointer fill-(--primary)"
                    onClick={(data) => {
                      setActiveFilter?.(data?.payload?.collection);
                    }}
                    activeBar={({ ...props }) => {
                      return (
                        <Rectangle
                          {...props}
                          fillOpacity={0.8}
                          // eslint-disable-next-line react/prop-types
                          stroke={props?.payload?.fill}
                          strokeDasharray={4}
                          strokeDashoffset={4}
                        />
                      );
                    }}
                  >
                    <LabelList
                      dataKey="label"
                      position="insideLeft"
                      className="fill-(--primary-foreground)"
                      offset={8}
                      fontSize={12}
                    />
                    <LabelList
                      dataKey="tasks"
                      position="insideRight"
                      className="fill-(--primary-foreground)"
                      offset={8}
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </motion.div>
        </div>
      </CardContent>

      {/* Select */}
      <div className="px-4 md:px-6">
        {/* Description */}
        <div className="mb-4">
          <h1 className="text-xl font-header">Description</h1>
          <p className="text-xs">{descriptions[filter]}</p>
        </div>
        <Select
          value={filter}
          onValueChange={(e) => {
            setActiveFilter?.(e as PriorityLevel);
          }}
        >
          <SelectTrigger
            className="h-7 w-full border border-card-foreground/20 shadow-md"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select Priority" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            <SelectItem value={"all"} className="rounded-lg [&_span]:flex">
              <div className="flex items-center gap-2 text-xs">
                <span
                  className="flex h-3 w-3 shrink-0 rounded-xs"
                  style={{
                    backgroundColor: `var(--primary)`,
                  }}
                />
                All
              </div>
            </SelectItem>
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
    </Card>
  );
}
