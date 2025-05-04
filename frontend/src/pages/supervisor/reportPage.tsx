import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import SupervisorLayout from '../../components/layouts/supervisor_layout';


type Report = {
  reportID: number;
  mark: number | null;
  feedback: string | null;
  studentID: number;
  trainingRepID: number | null;
  supervisorID: number;
  applicationID: number;
  submissionDate: string;
  type: string;
  status: string;
  content: string;
  fileUrl: string;
};

const ReportMarkingPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [mark, setMark] = useState<number | string>("");
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/reports", { withCredentials: true });

        // Check if the response is as expected (an array of reports)
        if (Array.isArray(response.data)) {
          setReports(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  const handleMarkReport = async () => {
    if (!selectedReport || !mark || !feedback) {
      alert("Please provide both mark and feedback");
      return;
    }
  
    // Ensure mark is sent as a number
    const numericMark = parseFloat(mark.toString());
  
    if (isNaN(numericMark)) {
      alert("Invalid mark value");
      return;
    }
  
    const data = { mark: numericMark, feedback };
  
    try {
      console.log("Sending data to backend:", data); // Log the data being sent
  
      const response = await axios.post(
        `http://localhost:3000/api/reports/${selectedReport.reportID}/mark`,
        data,
        { withCredentials: true }
      );
  
      if (response.status === 200) {
        alert("Report marked successfully");
        setSelectedReport(null); // Close dialog
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error marking report:", error.response?.data || error.message);
      } else {
        console.error("Error marking report:", error);
      }
      alert("Failed to mark the report.");
    }
  };
  
  return (
    <SupervisorLayout>
      <div className="row-span-12 col-span-12 bg-[#e7e7f3] rounded-2xl mb-4 p-4">
        <h1 className="text-2xl font-bold mb-4">Report Viewing & Marking</h1>
        <div className="grid grid-col-3 bg-[rgb(81,181,214)] rounded-2xl mb-4 p-2">
          {reports.length === 0 ? (
            <p>No reports found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reports.map((report) => (
                <Card
                  key={report.reportID}
                  className="cursor-pointer"
                  onClick={() => setSelectedReport(report)}
                >
                  <CardContent>
                    <h3 className="text-xl font-semibold">{report.reportID}</h3>
                    <p>{report.feedback ? report.feedback : "No feedback yet"}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Mark Report</DialogTitle>
                <DialogDescription>Select the mark and provide feedback</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="number"
                  placeholder="Mark"
                  value={mark}
                  onChange={(e) => setMark(e.target.value)}
                  className="w-full"
                />
                <Textarea
                  placeholder="Feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button onClick={handleMarkReport} className="mt-4">
                Submit Mark
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </SupervisorLayout>
  );
};

export default ReportMarkingPage;
