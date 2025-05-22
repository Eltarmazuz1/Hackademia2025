import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // adjust if not using shadcn/ui

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <img
        src="logo.jpg"
        alt="Welcome"
        className="w-full max-w-md rounded-lg shadow-md mb-8"
      />

      <h1 className="text-4xl font-bold mb-4">Welcome to ...</h1>
      <p className="text-gray-600 mb-6 text-lg">
        Practice math. Track progress. Find your perfect learning partner.
      </p>

      <div className="flex gap-4">
        <Button onClick={() => navigate("/login")}
        className="bg-green-600 hover:bg-green-700 text-white"
        >Sign in</Button>

        <Button variant="outline" onClick={() => navigate("/register")}
        className="border border-green-600 text-green-600 hover:bg-green-100"
        >Register</Button>
      </div>
    </div>
  );
};

export default Index;
