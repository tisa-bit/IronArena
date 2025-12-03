"use client";

import React, { useEffect, useState } from "react";
import { progress } from "@/services/adminServices";
import { Users, ToggleRight, Grid2X2Icon } from "lucide-react";
import ProgressChart from "@/components/common/Charts";
import NotificationBell from "@/components/common/NotificationBell";
import { totalCategories } from "@/services/categoryService";
import { totalControl } from "@/services/controlsService";
import { fetchUsers, totalUsers } from "@/services/userService";

type UserType = {
  role: string;
  id: number;
  firstname: string;
  lastname: string;
  email: string;
};

const AdminDashboard = () => {
  const [counts, setCounts] = useState({
    users: 0,
    categories: 0,
    controls: 0,
  });

  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [progressData, setProgressData] = useState({
    implemented: 0,
    notImplemented: 0,
    notApplicable: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const usersRes = await totalUsers();
        const controlsRes = await totalControl();
        const categoriesRes = await totalCategories();

        setCounts({
          users: usersRes.data.count,
          controls: controlsRes.data.count,
          categories: categoriesRes.data.count,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard counts:", error);
      }
    };

    const fetchAllUsers = async () => {
      try {
        const usersRes = await fetchUsers();
        setUsers(usersRes.users);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchCounts();
    fetchAllUsers();
  }, []);

  const handleUserChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = Number(e.target.value);
    const user = users.find((u) => u.id === userId) || null;
    setSelectedUser(user);

    if (user) {
      try {
        const res = await progress(user.id);
        setProgressData({
          implemented: res.data.implemented || 0,
          notImplemented: res.data.notImplemented || 0,
          notApplicable: res.data.notApplicable || 0,
        });
      } catch (err) {
        console.error("Failed to fetch user progress:", err);
        setProgressData({
          implemented: 0,
          notImplemented: 0,
          notApplicable: 0,
        });
      }
    } else {
      setProgressData({ implemented: 0, notImplemented: 0, notApplicable: 0 });
    }
  };

  const filteredUsers = users.filter((user) => user?.role === "User");

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">
        Admin Dashboard
      </h1>

      <div className="flex justify-end items-center">
        <NotificationBell />
      </div>

      <div className="flex gap-5 flex-wrap">
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 flex-1 min-w-[280px] max-w-md">
          <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm text-gray-600 font-medium">Total Users</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {counts.users}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 flex-1 min-w-[280px] max-w-md">
          <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center shrink-0">
            <Grid2X2Icon color="white" size={24} />
          </div>
          <div>
            <h3 className="text-sm text-gray-600 font-medium">
              Total Categories
            </h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {counts.categories}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 flex-1 min-w-[280px] max-w-md">
          <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center">
            <ToggleRight size={24} color="currentColor" />
          </div>
          <div>
            <h3 className="text-sm text-gray-600 font-medium">
              Total Controls
            </h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {counts.controls}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <label className="block mb-2 text-gray-700 font-medium rounded-2xl">
          Select User:
        </label>
        <select
          className="border border-gray-300 text-black rounded-2xl p-2 w-64"
          value={selectedUser?.id || ""}
          onChange={handleUserChange}
        >
          <option value="" className="rounded-2xl border-zinc-800">
            -- Select User --
          </option>
          {filteredUsers.map((user) => (
            <option
              key={user.id}
              value={user.id}
              className="text-black rounded-2xl"
            >
              {user.firstname} {user.lastname}
            </option>
          ))}
        </select>
      </div>

      {selectedUser && (
        <ProgressChart
          key={selectedUser.id}
          implemented={progressData.implemented}
          notImplemented={progressData.notImplemented}
          notApplicable={progressData.notApplicable}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
