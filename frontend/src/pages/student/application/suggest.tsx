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

export default function Suggestions() {
  const [selectedPrefs, setSelectedPrefs] = useState<number[]>([]);
  interface Venue {
    venueID: number;
    venueName: string;
    location: string;
    rating: number;
    website: string;
  }

  const [venues, setVenues] = useState<Venue[]>([]);

  const handleCheckboxChange = (id: number) => {
    setSelectedPrefs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {
        const res = await axios.post("http://localhost:3000/api/match-venues", {
        preferences: selectedPrefs,
      });
      setVenues(res.data);
    } catch (err) {
      console.error("Failed to fetch venues", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Select Your Training Preferences</h1>

      <div className="grid grid-cols-2 gap-3 mb-6">
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
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Find Matching Venues
      </button>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Matching Venues</h2>
        {venues.length === 0 ? (
          <p>No venues found.</p>
        ) : (
          <ul className="space-y-4">
            {venues.map((venue) => (
              <li key={venue.venueID} className="border p-4 rounded shadow">
                <h3 className="text-lg font-semibold">{venue.venueName}</h3>
                <p>Location: {venue.location}</p>
                <p>Rating: {venue.rating}</p>
                <a href={venue.website} className="text-blue-600 underline" target="_blank" rel="noreferrer">
                  Visit Website
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
