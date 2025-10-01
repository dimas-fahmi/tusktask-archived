import {
  Calendar1,
  CalendarArrowUp,
  CalendarClock,
  CalendarX,
  Folder,
  LayoutDashboard,
  Timer,
} from "lucide-react";

export const navigations = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Today",
    href: "/dashboard/tasks/today",
    icon: Calendar1,
  },
  {
    title: "Tomorrow",
    href: "/dashboard/tasks/tomorrow",
    icon: CalendarArrowUp,
  },
  {
    title: "Upcoming",
    href: "/dashboard/tasks/upcoming",
    icon: CalendarClock,
  },
  {
    title: "Overdue",
    href: "/dashboard/tasks/overdue",
    icon: CalendarX,
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: Folder,
  },
  {
    title: "Pomodoro",
    href: "/dashboard/pomodoro",
    icon: Timer,
  },
];
