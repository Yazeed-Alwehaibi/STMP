import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useUser } from "../../context/UserContext"; // Assuming UserContext is in this path

type ReportFormData = {
  type: string;
  content?: string;
  file: FileList;
};

export default function ReportSubmission() {
  const { user } = useUser(); // Access user context to get systemID
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReportFormData>();

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: ReportFormData) => {
    if (!data.file || data.file.length === 0) {
      toast.error("Please attach a file.");
      return;
    }

    if (!user) {
      toast.error("User not found.");
      return;
    }

    setSubmitting(true);

    try {
      // Step 1: Upload the file
      const uploadForm = new FormData();
      uploadForm.append("file", data.file[0]);

      const uploadRes = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: uploadForm,
      });

      if (!uploadRes.ok) {
        toast.error("File upload failed.");
        return;
      }

      const { fileUrl } = await uploadRes.json();

      // Step 2: Submit report data with file URL and systemID from UserContext
      const reportRes = await fetch("http://localhost:3000/api/report/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemID: user.systemID, // Pass systemID from UserContext
          reportType: data.type,
          reportContent: data.content ?? "",
          fileUrl,
        }),
      });

      if (reportRes.ok) {
        alert("Report submitted successfully.");
        toast.success("Report submitted successfully.");
        reset();
      } else {
        toast.error("Failed to submit report.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Report Type:</label>
        <select {...register("type", { required: true })} className="block w-full border p-2">
          <option value="">Select</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="final">Final</option>
        </select>
        {errors.type && <span className="text-red-500 text-sm">Report type is required</span>}
      </div>

      <div>
        <label>Content (optional):</label>
        <textarea {...register("content")} className="block w-full border p-2" />
      </div>

      <div>
        <label>Attach File:</label>
        <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" {...register("file", { required: true })} />
        {errors.file && <span className="text-red-500 text-sm">File is required</span>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
}
