
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  correctAnswer: string;

}

// Mock tasks data
const tasks: Task[] = [
  {
    id: "1",
    title: "Simplify the expression:",
    description: "3(x−4)+2(2x+1)",
    status: "pending",
    dueDate: "2025-06-01",
    correctAnswer: "7x-10"
  },
  {
    id: "2",
    title: "Solve the equation:",
    description: "5x−7=2x+8",
    status: "in-progress",
    dueDate: "2025-05-25",
    correctAnswer: "5"
  },
  {
    id: "3",
    title: "Solve the quadratic equation:",
    description: "x<sup>2</sup> −5x+6=0",
    status: "pending",
    dueDate: "2025-05-28",
    correctAnswer: "7x-10"
  },
  {
    id: "4",
    title: "The sum of two numbers is 30. The second number is twice the first",
    description: "What are the two numbers?",
    status: "pending",
    dueDate: "2025-05-23",
    correctAnswer: "7x-10"
  }
];

export const getUserTasks = (): Task[] => {
  return tasks;
};

export const getTaskById = (id: string): Task | undefined => {
  return tasks.find(task => task.id === id);
};


export const checkAnswer = (taskId: string, userAnswer: string): boolean => {
  const task = getTaskById(taskId);
  if (!task) return false;
  return task.correctAnswer.trim().toLowerCase() === userAnswer.trim().toLowerCase();
};


