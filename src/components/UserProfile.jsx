import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}`
        );
        setUser(response.data);
      } catch (error) {
        toast.error("Failed to load profile");
        console.error("Fetch user error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Profile Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The profile you're looking for doesn't exist.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/search"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Search
            </Link>
          </div>

          {/* Profile Photo and Basic Info */}
          <div className="flex items-center space-x-6 mb-8">
            {user.profilePhoto ? (
              <img
                src={`http://localhost:5000${user.profilePhoto}`}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-4xl font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.name}
              </h1>
              <p className="text-lg text-gray-600 mb-1">{user.age} years old</p>
              <p className="text-gray-600 mb-1">{user.location}</p>
              <p className="text-gray-600">{user.occupation}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {user.age} years old
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {user.gender}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{user.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Occupation
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {user.occupation}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Member Since
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* About Section */}
            {user.about && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  About
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{user.about}</p>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{user.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex space-x-4">
            <Link
              to="/search"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Continue Searching
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
