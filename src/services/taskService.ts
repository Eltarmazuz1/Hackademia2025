import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

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
    title: "Solve the equation:",
    description: "x<sup>2</sup> − 6x + 9 = 0",
    status: "pending",
    dueDate: "2025-06-01",
    correctAnswer: "3"
  },
  {
    id: "2",
    title: "Solve the equation:",
    description: "x<sup>2</sup> − 4x + 4 = 0",
    status: "in-progress",
    dueDate: "2025-05-25",
    correctAnswer: "2"
  },
  {
    id: "3",
    title: "Solve the equation:",
    description: "x<sup>2</sup> − 16x + 64 = 0",
    status: "pending",
    dueDate: "2025-05-28",
    correctAnswer: "8"
  },
  {
    id: "4",
    title: "Solve the equation:",
    description: "x<sup>2</sup> − 18x + 81 = 0",
    status: "pending",
    dueDate: "2025-05-23",
    correctAnswer: "9"
  }
];

export const getUserTasks = (): Task[] => {
  return tasks;
};

export const getTaskById = (id: string): Task | undefined => {
  return tasks.find(task => task.id === id);
};


export const checkAnswer = (taskId: string, answer: string): boolean => {
  const correctAnswers: Record<string, string> = {
    "1": "3",
    "2": "2",
    "3": "8",
    "4": "9"
  };

  const normalized = (s: string) => s.replace(/\s+/g, "").toLowerCase();
  return normalized(answer) === normalized(correctAnswers[taskId] || "");
};
