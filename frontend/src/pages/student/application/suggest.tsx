import { useState } from "react";
import axios from "axios";


const departments = [
  { id: 1, name: "Computer Science" },
  { id: 2, name: "Full-Stack" },
  { id: 3, name: "Cybersecurity" },
  { id: 4, name: "Network Engineer" },
  { id: 5, name: "Web Development" },
  { id: 6, name: "Artificial Intelligence" },
  { id: 7, name: "Machine Learning" },
  { id: 8, name: "Software Engineering" },
  { id: 9, name: "Data Science" },
];

interface Venue {
  venueID: number;
  venueName: string;
  location: string;
  rating: number;
  website: string;
}



export default function Suggestions() {
  const [selectedPrefs, setSelectedPrefs] = useState<number[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  

  const handleCheckboxChange = (id: number) => {
    setSelectedPrefs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/match-venues",
        { preferences: selectedPrefs },
        { withCredentials: true } // Include credentials (cookies)
      );
      setVenues(res.data);
    } catch (err) {
      console.error("Failed to fetch venues", err);
    }
  };
  

  const openDialog = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedVenue(null);
  };

  const handleApply = async () => {
    if (!selectedVenue) return;
  
    try {
      await axios.post("http://localhost:3000/api/apply-suggest", {
        venueID: selectedVenue.venueID,
        
      }, { withCredentials: true });
      
      alert(`Application submitted to ${selectedVenue.venueName}`);
      closeDialog();
    } catch (error) {
      console.error("Failed to apply:", error);
      alert("There was an error submitting your application. Please try again.");
    }
  };

  return (
    <div className="flex flex flex-col grid gap-1">
      <div className="bg-[#e7e7f3] p-4 rounded-2xl mb-4">
        <div className="grid grid-cols-2 col-1 row-span-7 gap-1 mb-6">
        <h1 className=" col-span-2 row-1 text-2xl font-bold mb-4">Select Your Training Preferences</h1>
          {departments.map((dept) => (
            <label key={dept.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedPrefs.includes(dept.id)}
                onChange={() => handleCheckboxChange(dept.id)}
                className="accent-blue-600"
              />
              {dept.name}
            </label>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-[rgb(81,181,214)] text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Find Matching Venues
        </button>
      </div>
      

      <div className="bg-[#e7e7f3] rounded-2xl mb-4 p-4">
        <h2 className="row-1 text-xl font-semibold mb-4">Matching Venues</h2>
        {venues.length === 0 ? (
          <p className="">No venues found.</p>
        ) : (
          <div className="grid grid-col-3 bg-[rgb(81,181,214)] rounded-2xl mb-4 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {venues.map((venue) => (
                <div key={venue.venueID} className="border rounded-xl shadow p-4 bg-white">
                  <h3 className="text-lg font-bold">{venue.venueName}</h3>
                  <p>Location: {venue.location}</p>
                  <p>Rating: {venue.rating}</p>
                  <a href={venue.website} className="text-blue-600 underline" target="_blank" rel="noreferrer">
                    Visit Website
                  </a>
                  <button
                    onClick={() => openDialog(venue)}
                    className="mt-3 block w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isDialogOpen && selectedVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative">
            <button
              onClick={closeDialog}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-2">{selectedVenue.venueName}</h3>
            <p><strong>Location:</strong> {selectedVenue.location}</p>
            <p><strong>Rating:</strong> {selectedVenue.rating}</p>
            <p>
              <strong>Website:</strong>{" "}
              <a href={selectedVenue.website} className="text-blue-600 underline" target="_blank" rel="noreferrer">
                {selectedVenue.website}
              </a>
            </p>
            <button
              onClick={handleApply}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
