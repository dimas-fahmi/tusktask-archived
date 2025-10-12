"use client";

import Accordion from "@/src/ui/components/Accordion";
import SectionHeader from "@/src/ui/components/SectionHeader";

const Features = () => {
  return (
    <section id="features" className="layout-width mt-6">
      {/* Header */}
      <SectionHeader
        header="Features"
        subtitle="From task and projects management to built-in Pomodoro, Here's what you can do with TuskTask"
      />

      {/* Features Cards */}
      <Accordion className="mt-8">
        <Accordion.Item
          title="Tasks & Subtasks"
          content="With TuskTask, organizing your workload has never been easier. The Tasks & Subtasks feature lets you break down big projects into manageable steps, so you can focus on one thing at a time. Whether it's a simple to-do list, a shopping list with prices, or a complex project with multiple milestones, each task can have its own set of subtasks. This makes it easy to track progress and ensure nothing slips through the cracks. Plus, the app automatically calculates the cost of all subtasks, so you can stay on top of your budget while making progress."
        />
        <Accordion.Item
          title="Projects"
          content="With TuskTask's Projects feature, you can organize your tasks into structured workflows that keep you focused and on track. Each project serves as a container for related tasks, allowing you to stay organized and see the bigger picture. You can easily group multiple tasks together, set deadlines, and prioritize them within the project. Whether you're managing personal goals, work assignments, or collaborative endeavors, Projects help you keep everything aligned and moving forward. Plus, you can invite teammates to work on projects together, ensuring everyone is on the same page and contributing to shared goals."
        />
        <Accordion.Item
          title="Team Co-Operation"
          content="The Teams feature in TuskTask takes collaboration to the next level. You can create a team, invite your friends, colleagues, or collaborators, and assign tasks to each person. Whether you're working on a big project or just need extra hands to get things done, Teams helps you stay coordinated and efficient. Assigning specific tasks ensures accountability, while the ability to share tasks and progress updates keeps everyone in sync. With TuskTask, teamwork is seamless, and together, you can achieve more in less time."
        />
        <Accordion.Item
          title="Email Reminder"
          content="Never miss a deadline again with TuskTask's Email Reminder feature. Stay on top of your tasks with automatic reminders sent straight to your inbox. Whether it's a due date for a project, a task deadline, or a friendly nudge for an upcoming subtask, TuskTask ensures you're always in the loop. Customize reminder times to suit your schedule and ensure that important tasks don't slip through the cracks. It's the perfect way to stay organized and keep your productivity on track, no matter how busy you get."
        />
        <Accordion.Item
          title="Built-In Pomodoro"
          content="Stay focused and boost your productivity with TuskTask’s built-in Pomodoro feature. This time management technique helps you break work into 25-minute intervals of focused effort, followed by a short break. TuskTask keeps track of your Pomodoro sessions, allowing you to maintain steady progress without burning out. Whether you're tackling a single task or working through multiple subtasks, the Pomodoro timer helps you stay in the zone and ensures you take regular breaks to recharge. It's the perfect way to stay productive, maintain focus, and avoid burnout throughout the day."
        />
      </Accordion>
    </section>
  );
};

export default Features;
