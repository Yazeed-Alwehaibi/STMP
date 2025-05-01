import { useForm } from "react-hook-form";
import axios from "axios";
import { useUser } from "../../context/UserContext";

const CreateOfferForm = () => {
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      maxParticipant: 0,
    },
    mode: "onSubmit",
  });
  

  const onSubmit = async (data: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    maxParticipant: number;
  }) => {
    if (!user) {
      alert("User not found.");
      return;
    }

    const submissionData = {
      ...data,
      maxParticipant: Number(data.maxParticipant),
    };
    
    try {
      const response = await axios.post("http://localhost:3000/api/offers", submissionData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      console.log("Success:", response.data);
      if (response.status === 201) {
        alert("Offer submitted successfully");
        reset();
      } else {
        alert("Error submitting offer");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error:", error.response?.data);
        alert(error.response?.data?.error || "Failed to submit offer");
      } else {
        console.error("Error:", (error as Error).message);
        alert("Failed to submit offer");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-200 space-y-4 p-4 border rounded-lg shadow-md">
      <div className="p-2 border-b mb-4">
        {user ? (
          <>
            <p className="text-sm font-medium">User ID: {user.systemID}</p>
            <p className="text-sm font-medium">User Name: {user.userName}</p>
          </>
        ) : (
          <p className="text-sm text-red-500">User not logged in</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          {...register("title", { required: "Title is required" })}
          className="w-full p-2 border rounded-md border-black"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          {...register("description", { required: "Description is required" })}
          className="w-full p-2 border rounded-md border-black"
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Start Date</label>
        <input
          type="date"
          {...register("startDate", { required: "Start date is required" })}
          className="w-full p-2 border rounded-md border-black"
        />
        {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">End Date</label>
        <input
          type="date"
          {...register("endDate", { required: "End date is required" })}
          className="w-full p-2 border rounded-md border-black"
        />
        {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Max Participants</label>
        <input
          type="number"
          {...register("maxParticipant", {
            required: "Max participants is required",
            min: { value: 1, message: "Must be at least 1" },
            valueAsNumber: true, // This is key!
          })}
          className="w-full p-2 border rounded-md border-black"
        />

        {errors.maxParticipant && (
          <p className="text-red-500 text-sm">{errors.maxParticipant.message}</p>
        )}
      </div>

      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Submit Offer
      </button>
    </form>
  );
};

export default CreateOfferForm;
