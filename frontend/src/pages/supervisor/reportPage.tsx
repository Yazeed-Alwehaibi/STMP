import { useEffect, useState } from "react";
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
import { useUser } from "../../context/UserContext";

interface Report {
  id: string;
  studentName: string;
  title: string;
  fileUrl: string;
  supervisorID: string;
  mark?: number;
  feedback?: string;
}

export default function ReportMarkingPage() {
  const { user } = useUser();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [mark, setMark] = useState<number | undefined>(undefined);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      if (!user?.systemID) {
        console.warn("User systemID not available yet");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/reports", {
          withCredentials: true,
        });

        console.log("Fetched reports:", response.data);
        setReports(response.data);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || "Failed to fetch reports");
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user?.systemID]);

  const handleSubmit = async () => {
    if (!selectedReport?.id) {
      setError("No report selected.");
      return;
    }

    if (mark === undefined || mark < 0 || mark > 100) {
      setError("Please enter a valid mark between 0 and 100.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/api/reports/${selectedReport.id}/mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mark, feedback }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to submit mark.");

      alert("Mark submitted successfully!");

      setReports((prev) =>
        prev.map((r) =>
          r.id === selectedReport.id ? { ...r, mark, feedback } : r
        )
      );

      setSelectedReport(null);
      setMark(undefined);
      setFeedback("");
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Error marking report: " + err.message);
      } else {
        setError("An unknown error occurred while marking the report.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Report Viewing & Marking</h1>

      {loading ? (
        <p>Loading reports...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="p-4">
              <CardContent className="space-y-2">
                <h2 className="text-lg font-semibold">{report.title}</h2>
                <p className="text-sm text-gray-600">Submitted by {report.studentName}</p>
                <a
                  href={report.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Report
                </a>
                <Button className="mt-2" onClick={() => setSelectedReport(report)}>
                  Review & Mark
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Report</DialogTitle>
            <DialogDescription>
              Provide a mark and feedback for this report.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <h2 className="font-semibold">{selectedReport?.title}</h2>
            <p className="text-sm text-gray-600">By {selectedReport?.studentName}</p>
            <Input
              type="number"
              placeholder="Enter mark"
              value={mark ?? ""}
              onChange={(e) =>
                setMark(e.target.value ? Number(e.target.value) : undefined)
              }
            />
            <Textarea
              placeholder="Enter feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <Button onClick={handleSubmit} disabled={loading}>
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
