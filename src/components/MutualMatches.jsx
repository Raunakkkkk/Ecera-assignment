import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const MutualMatches = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMutualMatches();
  }, []);

  const fetchMutualMatches = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/interests/matches",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch mutual matches");
      }

      const data = await response.json();
      setMatches(data);
    } catch (error) {
      setError("Failed to load mutual matches");
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
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

  if (matches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          No mutual matches yet. Keep showing interest in profiles!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Mutual Matches
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((match) => (
          <div
            key={match.user._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-green-200"
          >
            <div className="flex items-center space-x-4 mb-4">
              {match.user.profilePhoto ? (
                <img
                  src={`http://localhost:5000${match.user.profilePhoto}`}
                  alt={match.user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-xl font-semibold">
                    {match.user.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {match.user.name}
                </h3>
                <p className="text-gray-600">{match.user.age} years old</p>
                <p className="text-gray-600">{match.user.location}</p>
                <p className="text-green-600 text-sm font-medium">
                  ✓ Mutual Match
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Occupation:</span>{" "}
                {match.user.occupation}
              </p>
              {match.user.about && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">About:</span>{" "}
                  {match.user.about.length > 100
                    ? `${match.user.about.substring(0, 100)}...`
                    : match.user.about}
                </p>
              )}
            </div>

            <div className="text-xs text-gray-500">
              Matched on: {new Date(match.matchedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MutualMatches;
