import { useEffect, useState } from "react";
import axios from "axios";

type Offer = {
  offerID: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
};

type Participant = {
  participantID: number;
  status: string;
  userID: number;
  userName: string;
  department: string;
  gpa: string;
};

const RepApplications = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/fetchRepOffers", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (response.data.success && Array.isArray(response.data.offers)) {
          setOffers(response.data.offers);
        } else {
          console.error("Unexpected response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };
  
    fetchOffers();
  }, []);
  

  const fetchParticipants = async (offerID: number) => {
    setLoadingParticipants(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/fetchOfferParticipants?offerID=${offerID}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (response.data.success && Array.isArray(response.data.participants)) {
        setParticipants(response.data.participants);
      } else {
        console.error("Unexpected response:", response.data);
      }
      
    } catch (error) {
      console.error("Error fetching participants:", error);
    } finally {
      setLoadingParticipants(false);
    }
  };

  const handleAccept = async (participantID: number) => {
    try {
      await axios.post(
        "http://localhost:3000/api/acceptParticipant",
        { participantID },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      alert("Participant Accepted!");
      if (selectedOffer) fetchParticipants(selectedOffer.offerID);
    } catch (error) {
      console.error("Error accepting participant:", error);
    }
  };

  const handleReject = async (participantID: number) => {
    try {
      await axios.post(
        "http://localhost:3000/api/rejectParticipant",
        { participantID },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      alert("Participant Rejected!");
      if (selectedOffer) fetchParticipants(selectedOffer.offerID);
    } catch (error) {
      console.error("Error rejecting participant:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Offers</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.offerID}
            className="bg-white p-4 shadow-md rounded-lg border cursor-pointer hover:shadow-lg"
            onClick={() => {
              setSelectedOffer(offer);
              fetchParticipants(offer.offerID);
            }}
          >
            <h2 className="text-lg font-bold text-center">{offer.title}</h2>
          </div>
        ))}
      </div>

      {selectedOffer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedOffer(null)}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">{selectedOffer.title}</h2>

            {loadingParticipants ? (
              <p className="text-center">Loading participants...</p>
            ) : (
              <>
                {participants.length === 0 ? (
                  <p className="text-center text-gray-600">No students have applied yet.</p>
                ) : (
                  <div className="space-y-4">
                    {participants.map((p) => (
                      <div
                        key={p.participantID}
                        className="border p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between"
                      >
                        <div className="space-y-1">
                          <p><strong>User ID:</strong> {p.userID}</p>
                          <p><strong>Name:</strong> {p.userName}</p>
                          <p><strong>Department:</strong> {p.department}</p>
                          <p><strong>GPA:</strong> {p.gpa}</p>
                          <p><strong>Status:</strong> {p.status}</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex gap-2">
                          <button
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            onClick={() => handleAccept(p.participantID)}
                          >
                            Accept
                          </button>
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            onClick={() => handleReject(p.participantID)}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RepApplications;
