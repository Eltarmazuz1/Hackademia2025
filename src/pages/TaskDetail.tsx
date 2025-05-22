
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTaskById, Task } from "../services/taskService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate("/login");
      return;
    }

    // Get task details
    if (taskId) {
      const foundTask = getTaskById(taskId);
      if (foundTask) {
        setTask(foundTask);
      } else {
        navigate("/home");
      }
    }
  }, [taskId, user, navigate]);

  if (!user || !task) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Task Details</h1>
          <Button variant="outline" onClick={() => navigate("/home")}>Back to Tasks</Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-6">
        <Card>
          <CardHeader>
            <CardTitle>{task.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>This page is currently under development. More details about this task will be available soon.</p>
            
            {/* Basic task info for now */}
            <div className="mt-4 p-4 border border-gray-200 rounded-md bg-white">
              <h3 className="font-semibold text-lg">Task Information</h3>
              <div className="mt-2 space-y-2">
                <p><strong>Status:</strong> {task.status}</p>
                <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
                <p><strong>Description:</strong> {task.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TaskDetail;
