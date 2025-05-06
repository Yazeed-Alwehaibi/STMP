import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUser } from "../../context/UserContext";
import SupervisorLayout from '../../components/layouts/supervisor_layout';

interface Presentation {
  id: string;
  studentID: string;
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
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!user?.systemID) return;

    setLoading(true);
    axios
      .get("http://localhost:3000/api/presentations", {
        withCredentials: true, // send token cookie
      })
      .then((res) => {
        setPresentations(res.data);
        setError(null);
      })
      .catch(() => setError("Failed to load presentations"))
      .finally(() => setLoading(false));
  }, [user?.systemID]);

  if (!user?.systemID) {
    return <p>Please log in to view this page.</p>;
  }
  
  const handleSetDate = async () => {
    if (!selectedPresentation || !date) return;
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:3000/api/presentations/${selectedPresentation.id}/set-date`,
        { date },
        { withCredentials: true }
      );

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
    <SupervisorLayout>
      <div className="row-span-12 col-span-12 bg-[#e7e7f3] rounded-2xl mb-4 p-4">
        <h1 className="text-2xl font-bold mb-4">Presentation Scheduling</h1>
        <div className="grid grid-col-3 bg-[rgb(81,181,214)] rounded-2xl mb-4 p-2">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {presentations.map((presentation) => (
              <Card key={presentation.id} className="p-4">
                <CardContent>
                  <h2 className="text-lg font-semibold">{presentation.title}</h2>
                  <p className="text-sm text-gray-600">Name: {presentation.studentName}</p>
                  <p className="text-sm text-gray-600">Student ID: {presentation.studentID}</p>
                  <a
                    href={presentation.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Presentation
                  </a>
                  <p className="mt-2 text-sm">Scheduled Date: {presentation.date ? new Date(presentation.date).toLocaleDateString() : "Not submitted"}</p>
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
      </div>
    </SupervisorLayout>
  );
}
