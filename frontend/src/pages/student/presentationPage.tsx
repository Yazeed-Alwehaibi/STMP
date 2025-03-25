import { useForm } from "react-hook-form";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

interface PresentationFormData {
  applicationID: string;
  file: FileList;
}

export default function PresentationSubmission({ systemID }: { systemID: string }) {
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PresentationFormData>();
  
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: PresentationFormData) => {
    if (!data.file || data.file.length === 0) {
      toast.error("Please attach a powerpoint file.");
      return;
    }
    
    setSubmitting(true);
    const formData = new FormData();
    formData.append("systemID", systemID);  
    formData.append("reportFile", data.file[0]);

    try {
      console.log("Submitting report:", data);
      const response = await fetch("http://localhost:3000/api/presentation/submit", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        alert("presentation submitted successfully.");
        toast.success("presentation submitted successfully.");
        reset();
      } else {
        toast.error("Failed to submit presentation.");
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
            <Label className="text-lg">Attachment (powerpoint file only)</Label>
            <Input 
              type="file" 
              accept="application/pptx" 
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