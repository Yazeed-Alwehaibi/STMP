import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import StudentLayout from "../../components/layouts/student_layout";

type PresentationFormData = {
  file: FileList;
};

export default function PresentationSubmission() {
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PresentationFormData>();

  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    toast.error("User not found.");
    return null;
  }

  const onSubmit = async (data: PresentationFormData) => {
    if (!data.file || data.file.length === 0) {
      toast.error("Please attach a PowerPoint file.");
      return;
    }

    setSubmitting(true);

    try {
      const uploadForm = new FormData();
      uploadForm.append("file", data.file[0]);

      const uploadRes = await axios.post(
        "http://localhost:3000/api/upload",
        uploadForm,
        { withCredentials: true }
      );

      const { fileUrl } = uploadRes.data;

      const presentationRes = await axios.post(
        "http://localhost:3000/api/presentation/submit",
        { fileUrl },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (presentationRes.status === 201) {
        alert("Presentation submitted successfully.");
        reset();
      } else {
        toast.error("Failed to submit presentation.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          alert("You’ve already submitted your presentation.");
        } else if (error.response?.data?.error) {
          alert(error.response.data.error);
        } else {
          alert("An error occurred while submitting.");
        }
      } else {
        alert("An unexpected error occurred.");
      }
    }
    
  };

  return (
    <StudentLayout>
      <div className="bg-[#e7e7f3] p-4 rounded-2xl mb-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-lg">Attach PowerPoint File (PPTX only):</label>
              <input
                type="file"
                accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                {...register("file", { required: "File is required" })}
                className="block w-full p-3 text-lg border rounded shadow-sm"
              />
              {errors.file && (
                <p className="text-red-500 text-sm">{errors.file.message}</p>
              )}
            </div>

            <div className="mt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 text-lg bg-[rgb(81,181,214)] shadow-lg text-white rounded disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Presentation"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </StudentLayout>
  );
}
