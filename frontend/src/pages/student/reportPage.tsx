import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useUser } from "../../context/UserContext";
import axios, { AxiosError } from "axios";
import StudentLayout from "../../components/layouts/student_layout";

interface ReportFormData {
  type: string;
  content?: string;
  file: FileList;
}

export default function ReportSubmission() {
  const { user } = useUser();
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
      const formData = new FormData();
      formData.append("file", data.file[0]);

      const uploadResponse = await axios.post("http://localhost:3000/api/upload", formData);
      const { fileUrl } = uploadResponse.data;

      await axios.post(
        "http://localhost:3000/api/report/submit",
        {
          reportType: data.type,
          reportContent: data.content ?? "",
          fileUrl,
        },
        { withCredentials: true }
      );

      toast.success("Report submitted successfully.");
      alert("Report submitted successfully.");
      reset();
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      console.error(err);
      toast.error(err.response?.data?.error || "An error occurred while submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StudentLayout>
      <div className="bg-[#e7e7f3] p-4 rounded-2xl mb-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Report Type:</label>
            <select
              {...register("type", { required: true })}
              className="bg-white shadow-lg block w-full border p-2"
            >
              <option value="">Select</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="final">Final</option>
            </select>
            {errors.type && (
              <span className="text-red-500 text-sm">Report type is required</span>
            )}
          </div>

          <div>
            <label>Content:</label>
            <textarea
              {...register("content")}
              className="block w-full border p-2 bg-white shadow-lg"
            />
          </div>

          <div>
            <label>Attach File:</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              {...register("file", { required: true })}
              className="bg-white p-2 shadow-lg"
            />
            {errors.file && (
              <span className="text-red-500 text-sm">File is required</span>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-[rgb(81,181,214)] shadow-lg text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </StudentLayout>
  );
}
