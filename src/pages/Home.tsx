import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const Home = () => {
  const { user, logout } = useAuth(); // זה Firebase user
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);


  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUsername(data.username || data.fullName || user.email);
        }
      }
    };
    fetchUsername();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const categories = [
    { name: "Calculus", path: "/category/calculus", image: "calculus.png" },
    { name: "Algebra", path: "/category/algebra", image: "algebra.png" },
    { name: "Geometry", path: "/category/geometry", image: "geometry.png" },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Math Tasks</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/chat-with-your-mate")}>chat</Button>
            <Button variant="outline" onClick={() => navigate("/chat-with-your-mate")}>AI agent</Button>
            <span className="text-gray-600">
              Welcome, {username || "user"}
            </span>
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
            <img
              src={`/${category.image}`}
              alt={category.name}
              className="w-full h-70 object-cover rounded-t-md"
            />
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
