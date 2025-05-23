
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
  const [answer, setAnswer] = useState(""); //  

const HintSection = ({ hint }: { hint: string }) => {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setShowHint(!showHint)}
        className="mb-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {showHint ? "Hide Hint" : "Show Hint"}
      </button>

      {showHint && (
        <div className="p-3 border border-gray-300 rounded bg-yellow-50 text-gray-800">
          <strong>Hint:</strong> {hint}
        </div>
      )}
    </div>
  );
};


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
    if (!taskId) return;

    const isCorrect = checkAnswer(taskId, answer);

      if (isCorrect) {
    alert("Correct! ✅");
  } else {
    alert("Incorrect ❌ Try again.");
  }
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
          <p dangerouslySetInnerHTML={{ __html: task.description }} />
            {task.hint && (
            <HintSection hint={task.hint} />
            )}
            {/* Basic task info for now */}
            <div className="mt-4 p-4 border border-gray-200 rounded-md bg-white">
              <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Answer:</label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontWeight: "bold", fontSize: "16px" }}>x=</span>
              <Input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer"
                style={{ width: "250px" }}
              />
              <Button onClick={handleSubmit}>Submit Answer</Button>
            </div>

            </div>  {}
          </div>    {}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TaskDetail;
