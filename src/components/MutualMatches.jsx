import { useState, useEffect } from "react";

const MutualMatches = ({ refreshTrigger }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [interactions, setInteractions] = useState({});
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChatMessage, setShowChatMessage] = useState({});

  useEffect(() => {
    fetchMutualMatches();
  }, [refreshTrigger]);

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

  const handleInteraction = (userId, type, userInfo) => {
    setInteractions((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [type]: !prev[userId]?.[type],
      },
    }));

    if (type === "chat") {
      // Show temporary message for chat
      setShowChatMessage((prev) => ({ ...prev, [userId]: true }));
      // Hide message after 3 seconds
      setTimeout(() => {
        setShowChatMessage((prev) => ({ ...prev, [userId]: false }));
      }, 3000);
    } else if (type === "connect") {
      // Show connect modal with real user contact information
      setSelectedUser(userInfo);
      setShowConnectModal(true);
    }
  };

  const closeConnectModal = () => {
    setShowConnectModal(false);
    setSelectedUser(null);
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

            <div className="text-xs text-gray-500 mb-4">
              Matched on: {new Date(match.matchedAt).toLocaleDateString()}
            </div>

            {/* Chat message */}
            {showChatMessage[match.user._id] && (
              <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-purple-700 font-medium">
                    💬 Chat functionality will be implemented in the future!
                  </p>
                </div>
                <p className="text-xs text-purple-600 mt-1">
                  Stay tuned for real-time messaging features.
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() =>
                  handleInteraction(match.user._id, "chat", match.user)
                }
                className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg ${
                  interactions[match.user._id]?.chat
                    ? "bg-gradient-to-r from-purple-800 to-pink-800 text-white"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                }`}
              >
                💬 {interactions[match.user._id]?.chat ? "Chatted" : "Chat"}
              </button>
              <button
                onClick={() =>
                  handleInteraction(match.user._id, "connect", match.user)
                }
                className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg ${
                  interactions[match.user._id]?.connect
                    ? "bg-gradient-to-r from-green-800 to-emerald-800 text-white"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                }`}
              >
                🤝{" "}
                {interactions[match.user._id]?.connect
                  ? "Connected"
                  : "Connect"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Connect Modal */}
      {showConnectModal && selectedUser && (
        <div className="fixed inset-0 bg-opacity-10 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={closeConnectModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-4 mb-6">
                {selectedUser.profilePhoto ? (
                  <img
                    src={`http://localhost:5000${selectedUser.profilePhoto}`}
                    alt={selectedUser.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-green-200"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center border-4 border-green-200">
                    <span className="text-white text-xl font-bold">
                      {selectedUser.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {selectedUser.name}
                  </h4>
                  <p className="text-green-600 font-medium">
                    Connected Successfully!
                  </p>
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
                <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="mr-2">📞</span>
                  Contact Details
                </h5>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📧</span>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-800 select-all">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📱</span>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-800 select-all">
                        {selectedUser.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📍</span>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-800">
                        {selectedUser.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">💼</span>
                    <div>
                      <p className="text-xs text-gray-500">Occupation</p>
                      <p className="text-sm font-medium text-gray-800">
                        {selectedUser.occupation}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">🎂</span>
                    <div>
                      <p className="text-xs text-gray-500">Age</p>
                      <p className="text-sm font-medium text-gray-800">
                        {selectedUser.age} years old
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">👤</span>
                    <div>
                      <p className="text-xs text-gray-500">Gender</p>
                      <p className="text-sm font-medium text-gray-800 capitalize">
                        {selectedUser.gender}
                      </p>
                    </div>
                  </div>
                  {selectedUser.about && (
                    <div className="col-span-2">
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">💭</span>
                        <div>
                          <p className="text-xs text-gray-500">About</p>
                          <p className="text-sm font-medium text-gray-800">
                            {selectedUser.about}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6">
                <button
                  onClick={closeConnectModal}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MutualMatches;
