import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, updateProfile, uploadProfilePhoto } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      age: user?.age || "",
      location: user?.location || "",
      occupation: user?.occupation || "",
      interestedIn: user?.interestedIn || "",
      about: user?.about || "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    await updateProfile(data);
    setIsLoading(false);
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setPhotoLoading(true);
    await uploadProfilePhoto(file);
    setPhotoLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Edit Profile
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo
              </label>
              <div className="flex items-center space-x-4">
                {user?.profilePhoto ? (
                  <img
                    src={`http://localhost:5000${user.profilePhoto}`}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-2xl font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={photoLoading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {photoLoading && (
                    <p className="text-sm text-gray-600 mt-1">Uploading...</p>
                  )}
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Age */}
            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700"
              >
                Age
              </label>
              <input
                {...register("age", {
                  required: "Age is required",
                  min: {
                    value: 18,
                    message: "Age must be at least 18",
                  },
                  max: {
                    value: 100,
                    message: "Age cannot exceed 100",
                  },
                })}
                type="number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.age && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.age.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <input
                {...register("location", {
                  required: "Location is required",
                })}
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your location"
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Occupation */}
            <div>
              <label
                htmlFor="occupation"
                className="block text-sm font-medium text-gray-700"
              >
                Occupation
              </label>
              <input
                {...register("occupation", {
                  required: "Occupation is required",
                })}
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your occupation"
              />
              {errors.occupation && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.occupation.message}
                </p>
              )}
            </div>

            {/* Interested In */}
            <div>
              <label
                htmlFor="interestedIn"
                className="block text-sm font-medium text-gray-700"
              >
                Interested In
              </label>
              <select
                {...register("interestedIn", {
                  required: "Please specify who you are interested in",
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select preference</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="both">Both</option>
              </select>
              {errors.interestedIn && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.interestedIn.message}
                </p>
              )}
            </div>

            {/* About */}
            <div>
              <label
                htmlFor="about"
                className="block text-sm font-medium text-gray-700"
              >
                About Me
              </label>
              <textarea
                {...register("about", {
                  maxLength: {
                    value: 500,
                    message: "About section cannot exceed 500 characters",
                  },
                })}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tell us about yourself..."
              />
              {errors.about && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.about.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
