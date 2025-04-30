import { useForm } from "react-hook-form";
import axios from "axios";
import { useUser } from "../../../context/UserContext";

const OwnVenueForm = () => {
    const { user } = useUser();
    const { register, handleSubmit, reset, formState: { errors },
          } = useForm({ defaultValues: { name: "", description: "", website: "", startDate: "", endDate: "", }, });

  const onSubmit = async (data: {
      name: string;
      description: string;
      website: string;
      startDate: string;
      endDate: string;
  }) => {
    if (!user) {
      alert("User not found.");
      return;
    }

    const submissionData = {
      venueName: data.name,
      website: data.website,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
    };
    

    try {
      const response = await axios.post("http://localhost:3000/api/applyOwn", submissionData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, 
      });
      

      console.log("Success:", response.data);
      if (response.status === 201) {
        alert("Application submitted successfully");
        reset();
      } else {
        alert("Error submitting venue");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error:", error.response?.data);
      } else {
        console.error("Error:", (error as Error).message);
      }
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data?.error || "Failed to submit venue");
      } else {
        alert("Failed to submit venue");
      }
    }
  };

  return (
    <div className="bg-[#e7e7f3] p-4 rounded-2xl mb-4">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-rows-4 grid-cols-2 gap-1">
        <div className="grid grid-rows-1 grid-cols-2 row-1 col-span-2">
          {user ? (
            <>
              <p className=" col-1 row-1 text-sm font-medium">User ID: <br /> {user?.systemID}</p>
              <p className="col-2 row-1 text-sm font-medium">User Name: <br /> {user?.userName}</p>
            </>
          ) : (
            <p className="text-sm text-red-500">User not logged in</p>
          )}
        </div>

        <div className="col-1 row-2">
          <label className="block text-sm font-medium">Venue Name</label>
          <input {...register("name", { required: "Venue name is required" })} className="w-full border rounded-md border-black" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="col-1 row-3">
          <label className="block text-sm font-medium">Venue Description</label>
          <input {...register("description", { required: "Description is required" })} className="w-full border rounded-md border-black" />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div className="col-1 row-4">
          <label className="block text-sm font-medium">Venue Website</label>
          <input type="url" {...register("website", { required: "Website URL is required" })} className="w-full border rounded-md border-black" />
          {errors.website && <p className="text-red-500 text-sm">{errors.website.message}</p>}
        </div>

        <div className="col-2 row-2">
          <label className="block text-sm font-medium">Start Date</label>
          <input type="date" {...register("startDate", { required: "Start date is required" })} className="w-full border rounded-md border-black" />
          {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
        </div>

        <div className="col-2 row-3">
          <label className="block text-sm font-medium">End Date</label>
          <input type="date" {...register("endDate", { required: "End date is required" })} className="w-full border rounded-md border-black" />
          {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
        </div>

        <button type="submit" className="col-2 row-4 bg-[rgb(81,181,214)] text-white rounded-md">Submit</button>
      </form>
    </div>
  );
};

export default OwnVenueForm;
