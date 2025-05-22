import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const categories = [
    { name: "Calculus", path: "/category/calculus", image: "calculus.jpg" },
    { name: "Algebra", path: "/category/algebra", image: "algebra.jpg" },
    { name: "Geometry", path: "/category/geometry", image: "geometry.jpg" },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Math Tasks</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user.username}</span>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-12 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Card 
            key={category.name} 
            className="cursor-pointer hover:shadow-lg transition-shadow" 
            onClick={() => navigate(category.path)}
          >
            <CardHeader>
              <CardTitle className="text-center text-2xl">{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Explore tasks related to {category.name}.
              </p>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
};

export default Home;
