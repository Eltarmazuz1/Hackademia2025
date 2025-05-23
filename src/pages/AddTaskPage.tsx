import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AddTaskPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [hint, setHint] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUploading(true);

    let imageUrl = "";
    if (imageFile) {
      const imageRef = ref(storage, `task-images/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    try {
      await addDoc(collection(db, "tasks"), {
        title,
        description,
        correctAnswer,
        dueDate,
        category,
        hint,
        imageUrl,
        status: "pending",
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      navigate(`/category/${category}`);
    } catch (error) {
      console.error("Error adding task:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <Label>Description (HTML allowed)</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div>
              <Label>Correct Answer</Label>
              <Input value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} required />
            </div>
            <div>
              <Label>Due Date</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </div>
            <div>
              <Label>Category</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} required />
            </div>
            <div>
              <Label>Hint (optional)</Label>
              <Textarea value={hint} onChange={(e) => setHint(e.target.value)} />
            </div>
            <div>
              <Label>Optional Image</Label>
              <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            </div>
            <Button type="submit" disabled={uploading}>
              {uploading ? "Adding..." : "Add Task"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTaskPage;
