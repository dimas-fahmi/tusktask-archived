// Bundle export

// Profiles Schema
import { profiles, profilesRelations } from "./profiles";

// Projects Schema
import { projects, projectsRelations } from "./projects";
import {
  masterTasks,
  masterTasksRelations,
  tasks,
  tasksRelations,
} from "./tasks";

const schema = {
  // Profiles Table
  profiles,
  profilesRelations,

  // Projects Table
  projects,
  projectsRelations,

  // Tasks Table
  tasks,
  tasksRelations,
  masterTasks,
  masterTasksRelations,
};

export default schema;
