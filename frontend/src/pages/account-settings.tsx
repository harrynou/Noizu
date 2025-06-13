import { useState, useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import { spotifySettingsAuth } from "../services/spotifyAuth";
import { soundcloudSettingsAuth } from "../services/soundcloudAuth";
import {
  getUserProfile,
  updateUserProfile,
  getConnections,
  disconnectProvider,
  UserProfile,
  UserConnections,
} from "../services/api";

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accentPrimary"></div>
  </div>
);

// Success/Error message component
const StatusMessage = ({
  type,
  message,
  onClose,
}: {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}) => (
  <div
    className={`p-4 rounded-lg mb-4 ${
      type === "success"
        ? "bg-green-800 bg-opacity-30 border border-green-700 text-green-100"
        : "bg-red-800 bg-opacity-30 border border-red-700 text-red-100"
    }`}>
    <div className="flex justify-between items-center">
      <p>{message}</p>
      <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close message">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </div>
);

// Personal Info Tab Component
const PersonalInfoTab = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordChange, setShowPasswordChange] = useState<boolean>(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await getUserProfile();
      setUserProfile(profile);
      setFormData((prev) => ({
        ...prev,
        email: profile.email,
      }));
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setStatusMessage({ type: "error", message: "Failed to load user profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      setStatusMessage({ type: "error", message: "Email is required" });
      return;
    }

    try {
      setSaving(true);
      await updateUserProfile({ email: formData.email });
      setStatusMessage({ type: "success", message: "Email updated successfully" });
      await fetchUserProfile();
    } catch (error: any) {
      setStatusMessage({
        type: "error",
        message: error?.message || "Failed to update email",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setStatusMessage({ type: "error", message: "All password fields are required" });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setStatusMessage({ type: "error", message: "New passwords do not match" });
      return;
    }

    if (formData.newPassword.length < 8) {
      setStatusMessage({ type: "error", message: "New password must be at least 8 characters long" });
      return;
    }

    try {
      setSaving(true);
      await updateUserProfile({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setStatusMessage({ type: "success", message: "Password changed successfully" });
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setShowPasswordChange(false);
    } catch (error: any) {
      setStatusMessage({
        type: "error",
        message: error?.message || "Failed to change password",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {statusMessage && (
        <StatusMessage
          type={statusMessage.type}
          message={statusMessage.message}
          onClose={() => setStatusMessage(null)}
        />
      )}

      {/* Email Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Email Address</h3>
        <form onSubmit={handleEmailUpdate} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accentPrimary focus:border-accentPrimary"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={saving || formData.email === userProfile?.email}
              className="px-4 py-2 bg-accentPrimary text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
              {saving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Email"
              )}
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, email: userProfile?.email || "" }))}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Password Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="text-lg font-semibold text-white mb-2 sm:mb-0">Password</h3>
          {!showPasswordChange && (
            <button
              onClick={() => setShowPasswordChange(true)}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 text-sm">
              Change Password
            </button>
          )}
        </div>

        {showPasswordChange ? (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accentPrimary focus:border-accentPrimary"
                required
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accentPrimary focus:border-accentPrimary"
                required
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accentPrimary focus:border-accentPrimary"
                required
                minLength={8}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-accentPrimary text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {saving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordChange(false);
                  setFormData((prev) => ({
                    ...prev,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  }));
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <p className="text-gray-400 text-sm">
            Last updated:{" "}
            {userProfile?.passwordLastChanged
              ? new Date(userProfile.passwordLastChanged).toLocaleDateString()
              : "Never"}
          </p>
        )}
      </div>

      {/* Account Information */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Account Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="text-gray-400">Account created:</span>
            <span className="text-white">
              {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : "Unknown"}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <span className="text-gray-400">Last login:</span>
            <span className="text-white">
              {userProfile?.lastLogin ? new Date(userProfile.lastLogin).toLocaleDateString() : "Unknown"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Connections Tab Component
const ConnectionsTab = () => {
  const [connections, setConnections] = useState<UserConnections | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [disconnecting, setDisconnecting] = useState<{ spotify: boolean; soundcloud: boolean }>({
    spotify: false,
    soundcloud: false,
  });
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const connectionsData = await getConnections();
      setConnections(connectionsData);
      console.log(connectionsData);
    } catch (error) {
      console.error("Error fetching connections:", error);
      setStatusMessage({ type: "error", message: "Failed to load connections" });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (provider: "spotify" | "soundcloud") => {
    try {
      if (provider === "spotify") {
        await spotifySettingsAuth();
      } else {
        await soundcloudSettingsAuth();
      }
    } catch (error) {
      console.error(`Error connecting to ${provider}:`, error);
      setStatusMessage({ type: "error", message: `Failed to connect to ${provider}` });
    }
  };

  const handleDisconnect = async (provider: "spotify" | "soundcloud") => {
    const confirmed = window.confirm(
      `Are you sure you want to disconnect your ${provider} account? This will remove access to your ${provider} content.`
    );

    if (!confirmed) return;

    try {
      setDisconnecting((prev) => ({ ...prev, [provider]: true }));
      await disconnectProvider(provider);
      setStatusMessage({ type: "success", message: `${provider} account disconnected successfully` });
      await fetchConnections();
    } catch (error) {
      console.error(`Error disconnecting ${provider}:`, error);
      setStatusMessage({ type: "error", message: `Failed to disconnect ${provider} account` });
    } finally {
      setDisconnecting((prev) => ({ ...prev, [provider]: false }));
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {statusMessage && (
        <StatusMessage
          type={statusMessage.type}
          message={statusMessage.message}
          onClose={() => setStatusMessage(null)}
        />
      )}

      <div className="text-gray-300 mb-6">
        <p>Connect your music streaming accounts to access your content across platforms.</p>
      </div>

      {/* Spotify Connection */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.518 17.34c-.24.36-.66.48-1.08.36-2.94-1.8-6.66-2.22-11.04-1.2-.42.12-.84-.18-.96-.6-.12-.42.18-.84.6-.96 4.8-1.08 8.94-.66 12.18 1.38.42.24.54.78.3 1.02zm1.56-3.48c-.3.42-.78.66-1.26.48-3.36-2.04-8.46-2.64-12.42-1.44-.54.18-1.08-.12-1.26-.66-.18-.54.12-1.08.66-1.26 4.56-1.38 10.08-.72 14.04 1.68.48.3.66.96.36 1.44-.12-.24-.12-.24-.12-.24zm.12-3.66c-4.02-2.4-10.68-2.64-14.52-1.44-.66.18-1.32-.24-1.5-.9-.18-.66.24-1.32.9-1.5 4.44-1.38 11.76-1.08 16.32 1.68.6.36.78 1.14.42 1.74-.36.6-1.14.78-1.74.42-.12 0-.12 0 0 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Spotify</h3>
              <p className="text-sm text-gray-400">
                {connections?.spotify?.connected ? `Connected as ${connections.spotify.displayName}` : "Not connected"}
              </p>
              {connections?.spotify?.connected && connections.spotify.premiumAccount && (
                <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded-full mt-1">
                  Premium
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {connections?.spotify?.connected ? (
              <>
                <button
                  onClick={() => handleDisconnect("spotify")}
                  disabled={disconnecting.spotify}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                  {disconnecting.spotify ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Disconnecting...
                    </>
                  ) : (
                    "Disconnect"
                  )}
                </button>
                <button
                  onClick={() => handleConnect("spotify")}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">
                  Reconnect
                </button>
              </>
            ) : (
              <button
                onClick={() => handleConnect("spotify")}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Connect Spotify
              </button>
            )}
          </div>
        </div>

        {connections?.spotify?.connected && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Last connected:</span>
                <p className="text-white">
                  {connections.spotify.lastConnected
                    ? new Date(connections.spotify.lastConnected).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Account type:</span>
                <p className="text-white">{connections.spotify.premiumAccount ? "Premium" : "Free"}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SoundCloud Connection */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mr-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M7.5 11.5V16h1V11.5h-1zm2.5-1V16h1V10.5h-1zm2.5-3V16h1V7.5h-1zm2.5 1V16h1V8.5h-1zm2.5-1.5V16h1V7h-1zm-11-1V16h1V6h-1zM1 13v3h1v-3H1zm21 1v2h1v-2h-1zm-2-2v4h1v-4h-1z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">SoundCloud</h3>
              <p className="text-sm text-gray-400">
                {connections?.soundcloud?.connected
                  ? `Connected as ${connections.soundcloud.displayName}`
                  : "Not connected"}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {connections?.soundcloud?.connected ? (
              <>
                <button
                  onClick={() => handleDisconnect("soundcloud")}
                  disabled={disconnecting.soundcloud}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                  {disconnecting.soundcloud ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Disconnecting...
                    </>
                  ) : (
                    "Disconnect"
                  )}
                </button>
                <button
                  onClick={() => handleConnect("soundcloud")}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">
                  Reconnect
                </button>
              </>
            ) : (
              <button
                onClick={() => handleConnect("soundcloud")}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                Connect SoundCloud
              </button>
            )}
          </div>
        </div>

        {connections?.soundcloud?.connected && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Last connected:</span>
                <p className="text-white">
                  {connections.soundcloud.lastConnected
                    ? new Date(connections.soundcloud.lastConnected).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Connection Benefits</h3>
        <div className="space-y-4 text-sm text-gray-300">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div>
              <p className="font-medium text-white">Unified Search</p>
              <p>Search for music across both platforms from one place</p>
            </div>
          </div>
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div>
              <p className="font-medium text-white">Cross-Platform Playlists</p>
              <p>Create playlists that include tracks from both services</p>
            </div>
          </div>
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div>
              <p className="font-medium text-white">Seamless Playback</p>
              <p>Play music from different platforms without switching apps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Settings Page Component
const AccountSettingsPage = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<"personal" | "connections">("personal");
  const { isAuthenticated, loading } = useAuth();

  // Redirect if not authenticated
  if (!loading && !isAuthenticated) {
    return (
      <div className="container mx-auto p-4 md:p-6 pb-24 text-textPrimary">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-400 mb-6">You need to be signed in to access settings.</p>
          <a href="/sign-in" className="px-6 py-2 bg-accentPrimary text-white rounded-md">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 pb-24">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 pb-24 text-textPrimary">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and connections</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-700">
        <nav className="flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("personal")}
            className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === "personal"
                ? "border-accentPrimary text-white"
                : "border-transparent text-gray-400 hover:text-white hover:border-gray-300"
            }`}>
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab("connections")}
            className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === "connections"
                ? "border-accentPrimary text-white"
                : "border-transparent text-gray-400 hover:text-white hover:border-gray-300"
            }`}>
            Connections
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl">
        {activeTab === "personal" && <PersonalInfoTab />}
        {activeTab === "connections" && <ConnectionsTab />}
      </div>
    </div>
  );
};

export default AccountSettingsPage;
