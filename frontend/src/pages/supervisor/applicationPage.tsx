import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import SupervisorLayout from '../../components/layouts/supervisor_layout';


interface Application {
  studentID: string;
  student_name: string;
  training_venue_name: string;
  training_venue_website: string;
  applicationID: string;
}

export default function SupervisorApplications() {
  const { user } = useUser();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:3000/api/applications/unassigned", {
        withCredentials: true,
      });
      interface RawApplication {
        studentID: string;
        studentName: string;
        trainingVenueName: string;
        trainingVenueWebsite: string;
        applicationID: string;
      }

      const formatted: Application[] = response.data.map((app: RawApplication) => ({
        studentID: app.studentID,
        student_name: app.studentName,
        training_venue_name: app.trainingVenueName,
        training_venue_website: app.trainingVenueWebsite,
        applicationID: app.applicationID,
      }));
      setApplications(formatted);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Fetch error:", err.response?.data || err.message);
      } else {
        console.error("Fetch error:", err);
      }
      console.error("Fetch error:", err);
      setError("Could not fetch applications.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (applicationId: string) => {
    try {
      await axios.post(
        "http://localhost:3000/api/applications/accept",
        { applicationId },
        { withCredentials: true }
      );
      alert("Application accepted");
      setOpen(false);
      fetchApplications();
    } catch (err) {
      console.error("Accept error:", err);
      alert("Failed to accept.");
    }
  };

  const handleRejection = async () => {
    if (!selectedApplication) return;
    try {
      await axios.post(
        "http://localhost:3000/api/applications/reject",
        { applicationId: selectedApplication.applicationID },
        { withCredentials: true }
      );
      alert("Application denied");
      setOpen(false);
      fetchApplications();
    } catch (err) {
      console.error("Reject error:", err);
      alert("Failed to reject.");
    }
  };

  return (
    /** (((col-3))) make it so that we have multiple applications in the same row and then next row */
    <SupervisorLayout>
      <div className="row-span-12 col-span-12 bg-[#e7e7f3] rounded-2xl mb-4 p-4">
      <h1 className="font-bold mb-4">Unassigned Students:</h1>
        <div className="grid grid-col-3 bg-[rgb(81,181,214)] rounded-2xl mb-4 p-2">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : applications.length === 0 ? (
            <p>No applications available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {applications.map((app) => (
                <Card key={app.applicationID} onClick={() => {
                  setSelectedApplication(app);
                  setOpen(true);
                }} className="p-4 cursor-pointer">
                  <CardContent>
                    <p className="font-semibold">{app.student_name}</p>
                    <p className="text-sm text-gray-500">{app.training_venue_name}</p>
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
                <p><strong>Student ID:</strong> {selectedApplication.studentID}</p>
                <p><strong>Training Venue:</strong> {selectedApplication.training_venue_name}</p>
                <p><strong>Website:</strong> {
                  selectedApplication.training_venue_website !== "Unknown"
                    ? <a href={selectedApplication.training_venue_website} target="_blank" rel="noreferrer">{selectedApplication.training_venue_website}</a>
                    : "N/A"
                }</p>

                <div className="mt-4 flex justify-between">
                  <button
                    className="bg-green-500 px-4 py-2 text-white rounded"
                    onClick={() => handleAccept(selectedApplication.applicationID)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 px-4 py-2 text-white rounded"
                    onClick={handleRejection}
                  >
                    Reject
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </SupervisorLayout>
  );
}
