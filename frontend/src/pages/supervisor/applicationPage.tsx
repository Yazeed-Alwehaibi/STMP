import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";



// Define Application interface outside the component for better organization
interface Application {
  studentID: string;
  id: string;
  student_name: string;
  training_venue: string;
  details: string;
}

export default function SupervisorApplications() {
  const { user } = useUser();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);  // Reset error state on new fetch attempt
    try {
        const response = await fetch("http://localhost:3000/api/applications/unassigned", {
            method: "GET",
            credentials: "include", // Include credentials if needed
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Fetched applications:", data);
            setApplications(Array.isArray(data) ? data : []);
        } else {
            setError("Failed to fetch applications. Please try again.");
        }
    } catch (error) {
        console.error("Error fetching applications:", error);
        setError("Network error. Please try again later.");
        setApplications([]);
    } finally {
        setIsLoading(false);
    }
};



  const handleDecision = async (id: string, decision: "accepted" | "denied"): Promise<void> => {
    try {
      await axios.post(`/api/applications/${id}/decision`, { decision, supervisorId: user?.userId });
      setApplications((prevApplications) => prevApplications.filter((app) => app.id !== id));
      setOpen(false);
    } catch (error) {
      console.error("Error updating application status:", error);
      setError("Failed to update application status. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="font-bold mb-4">Pending Student Applications</h1>

      {isLoading ? (
        <p>Loading applications...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : applications.length === 0 ? (
        <p>No unassigned applications available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((app) => (
            <Card
              key={app.id}
              className="p-4 cursor-pointer"
              onClick={() => {
                setSelectedApplication(app);
                setOpen(true);
              }}
            >
              <CardContent>
                <p className="text-lg font-semibold">{app.student_name}</p>
                <p className="text-sm text-gray-500">{app.training_venue}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedApplication && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogTitle>Application Details</DialogTitle>
            <p><strong>Student:</strong> {selectedApplication.student_name}</p>
            <p><strong>StudentID:</strong> {selectedApplication.studentID}</p>
            <p><strong>Training Venue:</strong> {selectedApplication.training_venue}</p>
            <p><strong>Details:</strong> {selectedApplication.details}</p>
            <div className="flex gap-4 mt-4">
              <Button onClick={() => handleDecision(selectedApplication.id, "accepted")} className="bg-green-500">Accept</Button>
              <Button onClick={() => handleDecision(selectedApplication.id, "denied")} className="bg-red-500">Deny</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
