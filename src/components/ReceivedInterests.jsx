import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const ReceivedInterests = () => {
  const { user } = useAuth();
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReceivedInterests();
  }, []);

  const fetchReceivedInterests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/interests/received",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch received interests");
      }

      const data = await response.json();
      setInterests(data);
    } catch (error) {
      setError("Failed to load received interests");
      console.error("Error fetching interests:", error);
    } finally {
      setLoading(false);
    }
  };

  const respondToInterest = async (interestId, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/interests/${interestId}/respond`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to respond to interest");
      }

      // Remove the interest from the list after responding
      setInterests(interests.filter((interest) => interest._id !== interestId));

      // Show success message
      if (status === "accepted") {
        alert(
          "✅ Interest accepted! Check your Mutual Matches tab to see your new match."
        );
      } else {
        alert("Interest declined.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (interests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No interests received yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Received Interests
      </h2>
      <div className="space-y-4">
        {interests.map((interest) => (
          <div
            key={interest._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4 mb-4">
              {interest.fromUser.profilePhoto ? (
                <img
                  src={`http://localhost:5000${interest.fromUser.profilePhoto}`}
                  alt={interest.fromUser.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-xl font-semibold">
                    {interest.fromUser.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {interest.fromUser.name}
                </h3>
                <p className="text-gray-600">
                  {interest.fromUser.age} years old
                </p>
                <p className="text-gray-600">{interest.fromUser.location}</p>
                <p className="text-gray-600">{interest.fromUser.occupation}</p>
              </div>
            </div>

            {interest.message && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Message:</span>{" "}
                  {interest.message}
                </p>
              </div>
            )}

            <div className="flex space-x-2">
              <button
                onClick={() => respondToInterest(interest._id, "accepted")}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => respondToInterest(interest._id, "rejected")}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceivedInterests;
