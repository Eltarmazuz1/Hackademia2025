import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Button } from "@/components/ui/button";

interface UserScore {
  uid: string;
  username: string;
  correctCount: number;
  incorrectCount: number;
  score: number; // יחס או ניקוד
}

const Matches = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [match, setMatch] = useState<UserScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchMatches = async () => {
      setLoading(true);

      // 1. קרא את כל המשתמשים (אפשר להגביל בהמשך)
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersData = usersSnapshot.docs.map((doc) => ({
        uid: doc.id,
        username: doc.data().username || doc.data().fullName || "No Name",
      }));

      // 2. קרא את התשובות של כל המשתמשים + חשב ציון
      const usersScores: UserScore[] = [];

      for (const u of usersData) {
        const answersSnapshot = await getDocs(collection(db, "users", u.uid, "answers"));
        let correctCount = 0;
        let incorrectCount = 0;
        answersSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.isCorrect) correctCount++;
          else incorrectCount++;
        });

        const score = correctCount / (correctCount + incorrectCount || 1);
        usersScores.push({ ...u, correctCount, incorrectCount, score });
      }

      // 3. מצא את המשתמש עם ציון הכי שונה (לדוגמה - תלמיד חזק + תלמיד חלש)
      const currentUserScore = usersScores.find((u) => u.uid === user.uid);
      if (!currentUserScore) {
        setLoading(false);
        return;
      }

      // לדוגמה: התאמה למשתמש שהציון שלו הכי רחוק (אבל אפשר לשנות לוגיקה)
      let bestMatch: UserScore | null = null;
      let maxDiff = 0;

      for (const u of usersScores) {
        if (u.uid === user.uid) continue;
        const diff = Math.abs(currentUserScore.score - u.score);
        if (diff > maxDiff) {
          maxDiff = diff;
          bestMatch = u;
        }
      }

      setMatch(bestMatch);
      setLoading(false);
    };

    fetchMatches();
  }, [user]);

  if (!user) return <p>Please login</p>;

  if (loading) return <p>Loading matches...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Your Learning Match</h1>

      {match ? (
        <div className="bg-white rounded p-6 shadow-md max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-2">{match.username}</h2>
          <p>
            Correct answers: {match.correctCount} <br />
            Incorrect answers: {match.incorrectCount} <br />
            Score: {(match.score * 100).toFixed(1)}%
          </p>
          <Button className="mt-4" onClick={() => navigate("/chat-with-your-mate")}>
            Start Chatting / Learning
          </Button>
        </div>
      ) : (
        <p>No match found.</p>
      )}
    </div>
  );
};

export default Matches;
