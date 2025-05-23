import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Task {
  id: string;
  title: string;
  description: string;
  correctAnswer: string;
  hint?: string;
  [key: string]: any; // מאפשר שדות נוספים
}


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

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchTask = async () => {
      try {
        const docRef = doc(db, "tasks", taskId!);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTask({ id: docSnap.id, ...docSnap.data() } as Task);
        } else {
          console.error("Task not found");
          navigate("/home");
        }
      } catch (error) {
        console.error("Error fetching task:", error);
        navigate("/home");
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId, user, navigate]);

  const handleSubmit = async () => {
    if (!task) return;

    var isCorrect;

    if (answer === task.correctAnswer) {
      alert("Correct! ✅");
      isCorrect = true;
    } else {
      alert("Incorrect ❌ Try again.");
      isCorrect = false;
    }

    await setDoc(doc(db, "users", user.uid, "answers", taskId), {
      taskId,
      category: task.category,
      isCorrect,
      answeredAt: Timestamp.now(),
    });
  };

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
            <p dangerouslySetInnerHTML={{ __html: task.description }} />

            {task.hint && <HintSection hint={task.hint} />}

            <div className="mt-4 p-4 border border-gray-200 rounded-md bg-white">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Answer:
              </label>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base">x =</span>
                <Input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  className="w-64"
                />
                <Button onClick={handleSubmit}>Submit Answer</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TaskDetail;
