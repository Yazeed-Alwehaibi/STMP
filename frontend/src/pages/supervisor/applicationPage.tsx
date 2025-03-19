import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface Application {
  studentID: string;
  student_name: string;
  training_venue_name: string;
  training_venue_website: string;
  applicationID: string; // Make sure applicationID is present
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
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/api/applications/unassigned", {
        method: "GET",
        credentials: "include",
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched applications:", data);
  
        // Map API response to match frontend expectations
        const formattedData: Application[] = data.map((app: { applicationID: string; studentID: string; studentName: string; trainingVenueName: string; trainingVenueWebsite: string }) => ({
          studentID: app.studentID,
          student_name: app.studentName,  // Fix key name
          training_venue_name: app.trainingVenueName,  // Fix key name
          training_venue_website: app.trainingVenueWebsite,  // Fix key name
          applicationID: app.applicationID,
        }));
  
        console.log("Formatted applications:", formattedData);
        setApplications(formattedData);
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

  const handleCardClick = (app: Application) => {
    console.log("Selected application:", app);
    setSelectedApplication(app);
    setOpen(true);
  };

  const handleAccept = async (applicationId: string, supervisorID: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/applications/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ applicationId, supervisorID }),
        credentials: "include",  // Ensure cookies are included in the request
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Application accepted:", data);
        alert("Application accepted!");
        setOpen(false);
        fetchApplications();
      } else {
        const errorData = await response.json();
        console.error("Error accepting application:", errorData);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  
  

  const handleRejection = async () => {
    if (selectedApplication) {
      try {
        const response = await fetch("http://localhost:3000/api/applications/reject", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ applicationId: selectedApplication.applicationID , supervisorID: user?.systemID }),
          credentials: "include",
        });

        if (response.ok) {
          alert("Application denied!");
          setOpen(false);
          fetchApplications(); // Refresh the application list
        } else {
          alert("Failed to deny the application.");
        }
      } catch (error) {
        console.error("Error denying application:", error);
        alert("Error denying application.");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="font-bold mb-4">Unassigned Students</h1>
      {isLoading ? (
        <p>Loading applications...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : applications.length === 0 ? (
        <p>No unassigned students available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((app) => (
            <Card
              key={app.studentID}
              className="p-4 cursor-pointer"
              onClick={() => handleCardClick(app)}
            >
              <CardContent>
                <p className="text-lg font-semibold">{app.student_name}</p>
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
            <p><strong>Website:</strong> {selectedApplication.training_venue_website !== "Unknown" ? (
              <a href={selectedApplication.training_venue_website} target="_blank" rel="noopener noreferrer">
                {selectedApplication.training_venue_website}
              </a>
            ) : "N/A"}</p>

            {/* Accept and Deny buttons */}
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => {
                  if (user?.systemID) {
                    handleAccept(selectedApplication.applicationID, user.systemID);
                  } else {
                    console.error("Supervisor ID is undefined.");
                  }
                }}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Accept
              </button>
              <button
                onClick={handleRejection}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                reject
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
