import { useForm } from "react-hook-form";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

interface ReportFormData {
  applicationID: string;
  type: string;
  content?: string;
  file: FileList;
}

export default function ReportSubmission({ systemID }: { systemID: string }) {
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReportFormData>();
  
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: ReportFormData) => {
    if (!data.file || data.file.length === 0) {
      toast.error("Please attach a PDF file.");
      return;
    }
    
    setSubmitting(true);
    const formData = new FormData();
    formData.append("systemID", systemID);  // Use the correct systemID here
    formData.append("reportType", data.type);
    if (data.content) formData.append("reportContent", data.content);
    formData.append("reportFile", data.file[0]);

    try {
      console.log("Submitting report:", data);
      const response = await fetch("http://localhost:3000/api/report/submit", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        toast.success("Report submitted successfully.");
        reset();
      } else {
        toast.error("Failed to submit report.");
      }
    } catch {
      toast.error("An error occurred while submitting.");
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto mt-10 p-8 shadow-lg bg-white rounded-lg"
    >
      <Card>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-lg">Report Type</Label>
            <select 
              {...register("type", { required: "Report type is required" })} 
              className="w-full p-3 border rounded text-lg"
            >
              <option value="">Select a report type</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="final">Final</option>
            </select>
            {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
          </div>
          <div>
            <Label className="text-lg">Report Content (Optional)</Label>
            <Textarea
              {...register("content")} // Updated to match the data structure
              className="w-full h-48 p-4 text-lg resize-none"
            />
          </div>
          <div>
            <Label className="text-lg">Attachment (PDF only)</Label>
            <Input 
              type="file" 
              accept="application/pdf" 
              {...register("file", { required: "Attachment is required" })} 
              className="w-full p-3 text-lg"
            />
            {errors.file && <p className="text-red-500 text-sm">{errors.file.message}</p>}
          </div>
          <Button type="submit" className="w-full py-3 text-lg" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Report"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}