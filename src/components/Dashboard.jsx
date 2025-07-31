import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import PotentialMatches from "./PotentialMatches";
import ReceivedInterests from "./ReceivedInterests";
import SentInterests from "./SentInterests";
import MutualMatches from "./MutualMatches";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("potential");
  const [matchesRefreshTrigger, setMatchesRefreshTrigger] = useState(0);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Refresh matches when switching to matches tab
    if (tabId === "matches") {
      setMatchesRefreshTrigger((prev) => prev + 1);
    }
  };

  const tabs = [
    {
      id: "potential",
      name: "Potential Matches",
      component: PotentialMatches,
      icon: "👥",
      description: "Discover new people who match your preferences",
    },
    {
      id: "received",
      name: "Received Interests",
      component: ReceivedInterests,
      icon: "💌",
      description: "See who has shown interest in you",
    },
    {
      id: "sent",
      name: "Sent Interests",
      component: SentInterests,
      icon: "📤",
      description: "Track your sent interests and their status",
    },
    {
      id: "matches",
      name: "Mutual Matches",
      component: MutualMatches,
      icon: "💕",
      description: "Your successful matches and connections",
      props: { refreshTrigger: matchesRefreshTrigger },
    },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                {user?.profilePhoto ? (
                  <img
                    src={`http://localhost:5000${user.profilePhoto}`}
                    alt={user.name}
                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <span className="text-white text-lg sm:text-2xl font-bold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Ready to find your perfect match?
                </p>
              </div>
            </div>
            <Link
              to="/profile"
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex space-x-1 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 flex flex-col items-center py-4 px-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-white text-purple-600 shadow-md border border-purple-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-2xl mb-1">{tab.icon}</span>
                  <span className="font-semibold">{tab.name}</span>
                  <span className="text-xs text-gray-500 mt-1 hidden md:block">
                    {tab.description}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {ActiveComponent && (
              <ActiveComponent {...(activeTabData?.props || {})} />
            )}
          </div>
        </div>

        {/* Profile Completion Alert */}
        {!user?.isProfileComplete && (
          <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-800">
                  Complete your profile
                </h3>
                <div className="mt-2 text-yellow-700">
                  <p>
                    Add more details to your profile to increase your chances of
                    finding a match.
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    to="/profile"
                    className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Complete Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
