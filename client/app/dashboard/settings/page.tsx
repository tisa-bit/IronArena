"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  setupTwoFA,
  verifySetupTwoFA,
  changePassword,
} from "@/services/authServices";

import { User } from "@/types/types";
import { useRouter } from "next/navigation";
import { UserIcon } from "lucide-react";
import UsersForm from "../../../components/form/UsersForm";
import { fetchUsersById } from "@/services/userServices";
import Card from "@/components/common/Cards";
import { useAuthStorage } from "@/hooks/useAuthStorage";

export default function SettingsPage() {
  const router = useRouter();
  const { clearAll } = useAuthStorage();

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<"idle" | "setup" | "enabled">("idle");
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cpError, setCpError] = useState("");
  const [cpSuccess, setCpSuccess] = useState("");

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [editProfile, setEditProfile] = useState<User | null>(null);

  const [editModal, setEditModal] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const userStr = localStorage.getItem("users");
      if (!userStr) return;

      const storedUser = JSON.parse(userStr);
      setUser(storedUser);
      setStatus(storedUser.istwoFAEnabled ? "enabled" : "idle");
    };
    loadUser();
  }, []);

  console.log(editProfile);

  const handleLogout = () => {
    clearAll();
    router.replace("/");
  };

  const handleStartSetup = async () => {
    setError("");
    const res = await setupTwoFA();
    setQrCode(res.qrCode || res.qr);
    setStatus("setup");
  };

  const handleVerifySetup = async () => {
    setError("");
    await verifySetupTwoFA(otp);
    setStatus("enabled");
    alert("2FA enabled!");
  };

  const handleChangePassword = async () => {
    setCpError("");
    setCpSuccess("");
    if (newPassword !== confirmPassword) {
      setCpError("Passwords do not match.");
      return;
    }
    await changePassword({ currentPassword, newPassword });
    setCpSuccess("Password updated!");
    router.replace("/");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleProfileClick = async () => {
    if (!user) return;
    const data = await fetchUsersById(user.id.toString());
    setProfileUser(data);
    setShowProfileModal(true);
  };

  const handleEdit = () => {
    setEditModal(true);
    setEditProfile(profileUser);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="relative flex justify-end items-center gap-5">
        <UserIcon
          onClick={handleProfileClick}
          className="text-gray-600 w-6 h-6 cursor-pointer hover:text-gray-800"
        />
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
        >
          Logout
        </button>
      </div>

      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Account Settings
      </h1>

      {showProfileModal && profileUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-40 ">
          <div className="relative w-screen h-max">
            <Card
              title="Control Details"
              onClose={() => setShowProfileModal(false)}
            >
              <div className="flex flex-col gap-2 mb-4">
                <p>
                  <span className="font-medium text-black">
                    First Name: {profileUser.firstname}
                  </span>
                </p>
                {profileUser?.profilePic && (
                  <Image
                    loader={({ src }) => `http://localhost:8087${src}`}
                    src={profileUser.profilePic}
                    width={100}
                    height={100}
                    alt="profile pic"
                  />
                )}
                <p>
                  <span className="font-medium text-black">
                    Last Name: {profileUser.lastname}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-black">
                    Email: {profileUser.email}
                  </span>
                </p>
              </div>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600"
              >
                Edit Profile
              </button>
            </Card>
          </div>
        </div>
      )}

      {editModal && profileUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <UsersForm
              onClose={() => setEditModal(false)}
              user={profileUser}
              onUserUpdate={(updatedUser) => setProfileUser(updatedUser)}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white shadow-md rounded-lg p-6 flex flex-col items-center gap-4">
          {status === "idle" && (
            <button
              onClick={handleStartSetup}
              className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600"
            >
              Enable Authenticator
            </button>
          )}

          {status === "setup" && (
            <>
              <h3 className="text-lg font-medium text-gray-700">
                Scan this QR code
              </h3>
              {qrCode && (
                <Image src={qrCode} alt="2FA QR" width={150} height={150} />
              )}
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
              <button
                onClick={handleVerifySetup}
                className="px-4 py-2 bg-rose-500 text-white rounded-md"
              >
                Verify & Enable
              </button>
            </>
          )}

          {status === "enabled" && (
            <div className="flex justify-center py-40">
              <p className="text-green-600 font-medium">
                Two-factor authentication is enabled ✔️
              </p>
            </div>
          )}

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div className="flex-1 bg-white shadow-md rounded-lg p-6 flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Change Password
          </h2>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="px-3 py-2 border text-black rounded-md focus:outline-none"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="px-3 py-2 border text-black rounded-md focus:outline-none"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="px-3 py-2 border text-black rounded-md focus:outline-none"
          />
          <button
            onClick={handleChangePassword}
            className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600"
          >
            Update Password
          </button>
          {cpError && <p className="text-red-500">{cpError}</p>}
          {cpSuccess && <p className="text-green-500">{cpSuccess}</p>}
        </div>
      </div>
    </div>
  );
}
