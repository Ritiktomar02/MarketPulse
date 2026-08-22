import { useState } from "react";

import api, { PROFILE } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    picture: user?.picture || "",
  });

  const [passwordForm, setPasswordForm] =
    useState({
      currentPassword: "",
      newPassword: "",
    });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] =
    useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await api.patch(
        PROFILE.UPDATE,
        form
      );

      setUser(response.data.user);

      setMessage(
        "Profile updated successfully"
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Profile update failed"
      );
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await api.patch(
        PROFILE.UPDATE_PASSWORD,
        passwordForm
      );

      setMessage(response.data.message);

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Password update failed"
      );
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();

      formData.append("picture", file);

      const response = await api.patch(
        PROFILE.UPDATE_PICTURE,
        formData
      );

      const newPicture =
        response.data.picture;

      setForm((previous) => ({
        ...previous,
        picture: newPicture,
      }));

      setUser({
        ...user,
        picture: newPicture,
      });

      setMessage(
        "Profile picture updated successfully"
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Picture upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold text-white">
        My Profile
      </h1>

      {message && (
        <div className="mb-5 rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-green-400">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Picture */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-6 text-xl font-bold text-white">
            Profile Picture
          </h2>

          <div className="flex flex-wrap items-center gap-6">
            {form.picture ? (
              <img
                src={form.picture}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10 text-2xl font-bold text-emerald-400">
                {form.username
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>
            )}

            <label className="cursor-pointer rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-600">
              {uploading
                ? "Uploading..."
                : "Upload Photo"}

              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Profile Details */}
        <form
          onSubmit={handleUpdateProfile}
          className="rounded-xl border border-slate-800 bg-slate-900 p-6"
        >
          <h2 className="mb-6 text-xl font-bold text-white">
            Profile Details
          </h2>

          <div className="space-y-4">
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
            />

            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Bio"
              maxLength={300}
              rows={4}
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
            />

            <input
              name="picture"
              value={form.picture}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
            />

            <button
              type="submit"
              className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600"
            >
              Save Changes
            </button>
          </div>
        </form>

        {user?.authProvider !== "google" && (
          <form
            onSubmit={handleUpdatePassword}
            className="rounded-xl border border-slate-800 bg-slate-900 p-6"
          >
            <h2 className="mb-6 text-xl font-bold text-white">
              Change Password
            </h2>

            <div className="space-y-4">
              <input
                type="password"
                name="currentPassword"
                value={
                  passwordForm.currentPassword
                }
                onChange={handlePasswordChange}
                placeholder="Current Password"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
              />

              <input
                type="password"
                name="newPassword"
                value={
                  passwordForm.newPassword
                }
                onChange={handlePasswordChange}
                placeholder="New Password"
                minLength={6}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
              />

              <button
                type="submit"
                className="rounded-lg bg-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-600"
              >
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
};

export default Profile;