import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const SentInterests = () => {
  const { user } = useAuth();
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSentInterests();
  }, []);

  const fetchSentInterests = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/interests/sent", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sent interests");
      }

      const data = await response.json();
      setInterests(data);
    } catch (error) {
      setError("Failed to load sent interests");
      console.error("Error fetching interests:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelInterest = async (interestId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/interests/${interestId}/cancel`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to cancel interest");
      }

      // Remove the interest from the list after canceling
      setInterests(interests.filter((interest) => interest._id !== interestId));
    } catch (error) {
      alert(error.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return null;
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
        <p className="text-gray-600">No interests sent yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Sent Interests
      </h2>
      <div className="space-y-4">
        {interests.map((interest) => (
          <div
            key={interest._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4 mb-4">
              {interest.toUser.profilePhoto ? (
                <img
                  src={`http://localhost:5000${interest.toUser.profilePhoto}`}
                  alt={interest.toUser.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-xl font-semibold">
                    {interest.toUser.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {interest.toUser.name}
                </h3>
                <p className="text-gray-600">
                  {interest.toUser.age} years old
                </p>
                <p className="text-gray-600">{interest.toUser.location}</p>
                <p className="text-gray-600">{interest.toUser.occupation}</p>
                <div className="mt-2">{getStatusBadge(interest.status)}</div>
              </div>
            </div>

            {interest.message && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Your message:</span>{" "}
                  {interest.message}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                Sent on: {new Date(interest.createdAt).toLocaleDateString()}
              </div>
              {interest.status === "pending" && (
                <button
                  onClick={() => cancelInterest(interest._id)}
                  className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel Interest
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentInterests; 