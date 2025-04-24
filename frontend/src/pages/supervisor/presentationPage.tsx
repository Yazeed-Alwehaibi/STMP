import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUser } from "../../context/UserContext";

interface Presentation {
  id: string;
  studentName: string;
  title: string;
  fileUrl: string;
  supervisorID: string;
  date?: string;
}

export default function PresentationPage() {
  const { user } = useUser();
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [selectedPresentation, setSelectedPresentation] = useState<Presentation | null>(null);
  const [date, setDate] = useState<string>(""); // Store the date as a string
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supervisorID = user?.systemID;

  useEffect(() => {
    if (!supervisorID) return;
    setLoading(true);
    fetch(`http://localhost:3000/api/presentations?supervisorID=${supervisorID}`)
      .then((res) => res.json())
      .then((data) => {
        setPresentations(data);
        setError(null);
      })
      .catch(() => setError("Failed to load presentations"))
      .finally(() => setLoading(false));
  }, [supervisorID]);

  const handleSetDate = async () => {
    if (!selectedPresentation || !date) return;
    setLoading(true);
    try {
      await fetch(`http://localhost:3000/api/presentations/${selectedPresentation.id}/set-date`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
      setPresentations((prev) =>
        prev.map((p) =>
          p.id === selectedPresentation.id ? { ...p, date } : p
        )
      );
      setDate("");
      setSelectedPresentation(null);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to set presentation date.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Presentation Scheduling</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {presentations.map((presentation) => (
            <Card key={presentation.id} className="p-4">
              <CardContent>
                <h2 className="text-lg font-semibold">{presentation.title}</h2>
                <p className="text-sm text-gray-600">Submitted by {presentation.studentName}</p>
                <a href={presentation.fileUrl} target="_blank" className="text-blue-500 underline">
                  View Presentation
                </a>
                <p className="mt-2 text-sm">Scheduled Date: {presentation.date || "Not set"}</p>
                <Button className="mt-2" onClick={() => setSelectedPresentation(presentation)}>
                  Set Date
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <Dialog open={!!selectedPresentation} onOpenChange={() => setSelectedPresentation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Presentation Date</DialogTitle>
          </DialogHeader>
          <div>
            <h2 className="font-semibold mb-2">{selectedPresentation?.title}</h2>
            <p className="text-sm text-gray-600 mb-4">By {selectedPresentation?.studentName}</p>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded-md border-black"
            />
            <Button className="mt-4" onClick={handleSetDate} disabled={loading}>
              Save Date
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
