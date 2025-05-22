
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserTasks } from "../services/taskService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const tasks = getUserTasks();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/task/${taskId}`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user.username}</span>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
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
                    checked={task.status === 'completed'}
                    onClick={(e) => e.stopPropagation()} 
                  />
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between">
                      <label 
                        htmlFor={`task-${task.id}`}
                        className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}
                      >
                        {task.title}
                      </label>
                      <span className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
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

export default Home;
