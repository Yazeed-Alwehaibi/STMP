import { useEffect, useState } from "react";
import axios from "axios";

type Offer = {
  offerID: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
};

const OffersList = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [appliedOffers, setAppliedOffers] = useState<number[]>([]); // Track applied offers

  // Fetch available offers on component mount
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/fetchOffers");
        setOffers(response.data);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
  }, []);

  // Handle apply button click
  const handleApply = async (offerID: number) => {

    try {
      // POST request to apply for the offer
      const response = await axios.post(
        "http://localhost:3000/api/applyToOffer",
        {
          offerID,
        },
        {
          withCredentials: true, // 🔐 Include cookies
        }
      );
      

      console.log(response.data);
      alert("Applied successfully! 🎉");
      setAppliedOffers([...appliedOffers, offerID]); // Add the applied offerID to the list
      setSelectedOffer(null); // Close the dialog
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          alert("You have already applied for this offer.");
        } else {
          alert(error.response.data?.error || "Failed to apply.");
        }
      } else {
        console.error("Error applying:", error);
        alert("Failed to apply.");
      }
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Display the offers */}
      {offers.map((offer) => (
        <div
          key={offer.offerID}
          className="bg-white p-4 shadow-md rounded-lg border cursor-pointer hover:shadow-lg"
          onClick={() => setSelectedOffer(offer)}
        >
          <h2 className="text-lg font-bold text-center">{offer.title}</h2>
        </div>
      ))}

      {/* Dialog for offer details */}
      {selectedOffer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedOffer(null)}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedOffer.title}</h2>
            <p className="mb-2">{selectedOffer.description}</p>
            <p className="text-sm text-gray-600">
              Start: {new Date(selectedOffer.startDate).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              End: {new Date(selectedOffer.endDate).toLocaleString()}
            </p>

            {/* Apply Button */}
            <button
              className={`mt-4 w-full py-2 rounded ${appliedOffers.includes(selectedOffer.offerID) ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              onClick={() => {
                if (!appliedOffers.includes(selectedOffer.offerID)) {
                  handleApply(selectedOffer.offerID); // Apply for the offer
                }
              }}
              disabled={appliedOffers.includes(selectedOffer.offerID)} // Disable if already applied
            >
              {appliedOffers.includes(selectedOffer.offerID) ? 'Applied ✅' : 'Apply'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersList;
