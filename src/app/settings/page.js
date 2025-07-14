"use client";

import { useState, useEffect } from "react";
import { MessageCircle, ArrowLeft, Save, Bell, Shield, User, Key, Trash2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../lib/auth-context";

function PasswordModal({ open, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!open) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => { setSuccessMsg(""); onClose(); }, 1200);
      } else {
        setErrorMsg(data.error || "Failed to change password");
      }
    } catch (err) {
      setErrorMsg("Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold">&times;</button>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Change Password</h3>
        {successMsg && <div className="text-green-600 text-sm mb-2">{successMsg}</div>}
        {errorMsg && <div className="text-red-600 text-sm mb-2">{errorMsg}</div>}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required minLength={6} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required minLength={6} />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
            <button type="submit" disabled={saving} className="bg-custom-blue text-white px-6 py-2 rounded-lg hover:bg-custom-blue transition-colors flex items-center space-x-2 disabled:opacity-60">
              {saving ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> : <Key className="h-4 w-4" />}
              <span>{saving ? "Saving..." : "Save"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteAccountModal({ open, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!open) return null;

  const handleDelete = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/auth/delete-account", { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("Account deleted successfully.");
        setTimeout(() => { onDeleted(); }, 1200);
      } else {
        setErrorMsg(data.error || "Failed to delete account");
      }
    } catch (err) {
      setErrorMsg("Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold">&times;</button>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Delete Account</h3>
        {successMsg && <div className="text-green-600 text-sm mb-2">{successMsg}</div>}
        {errorMsg && <div className="text-red-600 text-sm mb-2">{errorMsg}</div>}
        <p className="mb-4 text-gray-700">Are you sure you want to delete your account? This action cannot be undone.</p>
        <div className="flex justify-end space-x-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
          <button type="button" onClick={handleDelete} disabled={loading} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-60">
            {loading ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> : <Trash2 className="h-4 w-4" />}
            <span>{loading ? "Deleting..." : "Delete"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, loading: authLoading, refreshUser, signOut } = useAuth();
  const originalUsername = user?.user_metadata?.username || user?.email?.split("@")[0] || "";
  const [username, setUsername] = useState(originalUsername);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setUsername(user?.user_metadata?.username || user?.email?.split("@")[0] || "");
  }, [user]);

  // Show loading state if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/update-username", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newUsername: username })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("Username updated successfully!");
        await refreshUser();
      } else {
        setErrorMsg(data.error || "Failed to update username");
      }
    } catch (err) {
      setErrorMsg("Failed to update username");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center space-x-2">
                <img src="/pentastudio.svg" alt="PentaStudio Logo" className="h-5 w-5" />
                <span className="text-2xl font-bold text-gray-900 font-primary">whisprmail</span>
              </div>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 font-primary">Settings</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Profile Settings */}
          <form onSubmit={handleSave} className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900 font-primary">Profile Settings</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {successMsg && <div className="text-green-600 text-sm mb-2">{successMsg}</div>}
              {errorMsg && <div className="text-red-600 text-sm mb-2">{errorMsg}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  minLength={3}
                  pattern="[a-zA-Z0-9_]+"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Username must be at least 3 characters and contain only letters, numbers, and underscores.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>
            <div className="flex justify-end px-6 pb-6">
              {username !== originalUsername && (
                <button type="submit" disabled={saving} className="bg-custom-blue text-white px-6 py-2 rounded-lg hover:bg-custom-blue transition-colors flex items-center space-x-2 disabled:opacity-60">
                  {saving ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> : <Save className="h-4 w-4" />}
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </button>
              )}
            </div>
          </form>

          {/* Account Actions */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 font-primary">Account Actions</h2>
            </div>
            <div className="p-6 space-y-4">
              <button type="button" onClick={() => setShowPasswordModal(true)} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>Change Password</span>
              </button>
              <button type="button" onClick={() => setShowDeleteModal(true)} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2">
                <Trash2 className="h-4 w-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
          <PasswordModal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
          <DeleteAccountModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} onDeleted={signOut} />
        </div>
      </div>
    </div>
  );
} 