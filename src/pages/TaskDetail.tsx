
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTaskById, Task } from "../services/taskService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { checkAnswer } from "../services/taskService";


const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState(""); // 🆕 תשובה של המשתמש


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
  const handleSubmit = () => {
    
    console.log("Answer submitted:", answer);
    alert(`Answer submitted: ${answer}`);
    };
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
            <p>{task.description}</p>
            
            {/* Basic task info for now */}
            <div className="mt-4 p-4 border border-gray-200 rounded-md bg-white">
            <div className="mt-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Your Answer:</label>
              <Input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your answer here..."
                />
              <Button onClick={handleSubmit}>Submit Answer</Button>
            </div>  {/* <-- סגירת div פנימי */}
          </div>    {/* <-- סגירת div חיצוני */}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TaskDetail;
