import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useUser } from "../../context/UserContext"; // Assuming UserContext is in this path

type PresentationFormData = {
  applicationID: string;
  file: FileList;
};

export default function PresentationSubmission() {
  const { user } = useUser(); // Access user context to get systemID
  const systemID = user?.systemID; // Get systemID from user context
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PresentationFormData>();

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: PresentationFormData) => {
    if (!data.file || data.file.length === 0) {
      toast.error("Please attach a PowerPoint file.");
      return;
    }

    setSubmitting(true);

    try {
      // Step 1: Upload the PowerPoint file
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

      // Step 2: Submit presentation data with file URL and systemID from UserContext
      const formData = new FormData();
      formData.append("systemID", systemID ?? "");
      formData.append("presentationFile", fileUrl); // Use the uploaded file URL

      const presentationRes = await fetch("http://localhost:3000/api/presentation/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemID: systemID, // Pass systemID from UserContext
          fileUrl: fileUrl,
        }),
      }); 

      if (presentationRes.ok) {
        alert("Presentation submitted successfully.");
        toast.success("Presentation submitted successfully.");
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
      <div className="space-y-4">
        <div>
          <label className="block text-lg">Attach PowerPoint File (PPTX only):</label>
          <input
            type="file"
            accept="application/pptx"
            {...register("file", { required: "File is required" })}
            className="block w-full p-3 text-lg border rounded"
          />
          {errors.file && <p className="text-red-500 text-sm">{errors.file.message}</p>}
        </div>

        <div className="mt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 text-lg bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Presentation"}
          </button>
        </div>
      </div>
    </form>
  );
}
