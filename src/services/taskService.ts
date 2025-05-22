
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
}

// Mock tasks data
const tasks: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Write and submit the Q3 project proposal for client review",
    status: "pending",
    dueDate: "2025-06-01"
  },
  {
    id: "2",
    title: "Review code changes",
    description: "Review pull request #42 with frontend updates",
    status: "in-progress",
    dueDate: "2025-05-25"
  },
  {
    id: "3",
    title: "Update documentation",
    description: "Update the API documentation with new endpoints",
    status: "pending",
    dueDate: "2025-05-28"
  },
  {
    id: "4",
    title: "Weekly team meeting",
    description: "Prepare and attend the weekly team standup",
    status: "completed",
    dueDate: "2025-05-23"
  }
];

export const getUserTasks = (): Task[] => {
  return tasks;
};

export const getTaskById = (id: string): Task | undefined => {
  return tasks.find(task => task.id === id);
};
