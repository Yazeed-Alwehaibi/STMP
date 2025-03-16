import { useState } from "react";
import { useUser } from "../../../context/UserContext";

const VenueForm = () => {
  const { user } = useUser();
  const [venue, setVenue] = useState({
    name: "",
    description: "",
    website: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setVenue({ ...venue, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("User not found.");
      return;
    }
    try {
      const response = await fetch("/api/venues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...venue, userId: user.userId, userName: user.userName })
      });
      if (response.ok) {
        alert("application submitted successfully");
        setVenue({ name: "", description: "", website: "" });
      } else {
        alert("Error submitting venue");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit venue");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-200 space-y-4 p-4 border rounded-lg shadow-md">
      <div className="p-2 border-b mb-4">
        {user ? (
          <>
            <p className="text-sm font-medium">User ID: {user?.userId}</p>
            <p className="text-sm font-medium">User Name: {user?.userName}</p>
          </>
        ) : (
          <p className="text-sm text-red-500">User not logged in</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Venue Name</label>
        <input type="text" name="name" value={venue.name} onChange={handleChange} className="w-full p-2 border rounded-md border-black" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Venue Description</label>
        <textarea name="description" value={venue.description} onChange={handleChange} className="w-full p-2 border rounded-md border-black" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Venue Website</label>
        <input type="url" name="website" value={venue.website} onChange={handleChange} className="w-full p-2 border rounded-md border-black" required />
      </div>
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Submit</button>
    </form>
  );
};

export default VenueForm;
