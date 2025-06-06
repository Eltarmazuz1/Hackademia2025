import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string | Date;
  status: "pending" | "in-progress" | "completed";
  category: string;
};

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      setLoading(true);
      try {

        const tasksQuery = query(
          collection(db, "tasks"),
          where("category", "==", category)
        );
        const tasksSnapshot = await getDocs(tasksQuery);


        const answersSnapshot = await getDocs(
          collection(db, "users", user.uid, "answers")
        );
        const answersMap = new Map(
          answersSnapshot.docs.map((doc) => [doc.id, doc.data()])
        );


        const fetchedTasks = tasksSnapshot.docs.map((doc) => {
          const data = doc.data() as Omit<Task, "id" | "status">;
          const answerData = answersMap.get(doc.id);
          const isCompleted = answerData?.isCorrect === true;
          return {
            id: doc.id,
            ...data,
            status: isCompleted ? "completed" : "pending",
          } as Task;
        });

        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks or answers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user, category]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/task/${taskId}`);
  };

  if (!user) return null;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold capitalize">{category} Tasks</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Welcome, {user.displayName || user.email}
            </span>
            {user.role === "teacher" && (
              <Button
                onClick={() => navigate("/add-task")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Add Task
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
            <CardDescription>
              You have {tasks.length} tasks assigned to you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-start gap-4 p-4 bg-white rounded-md border border-gray-200 hover:border-primary cursor-pointer transition-colors"
                  onClick={() => handleTaskClick(task.id)}
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.status === "completed"}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between">
                      <label
                        htmlFor={`task-${task.id}`}
                        className={`font-medium ${
                          task.status === "completed"
                            ? "line-through text-gray-500"
                            : ""
                        }`}
                      >
                        {task.title}
                      </label>
                      <span className="text-sm text-gray-500">
                        Due:{" "}
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p
                      className="text-sm text-gray-600 mt-1"
                      dangerouslySetInnerHTML={{ __html: task.description }}
                    />
                    <div className="mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          task.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : task.status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CategoryPage;
