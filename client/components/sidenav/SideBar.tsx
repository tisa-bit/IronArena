"use client";

import { Role } from "@/types/types";
import {
  CheckSquare2Icon,
  File,
  Landmark,
  Layers,
  PieChart,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type sideNavProps = {
  role: Role;
};

const SideNav = ({ role }: sideNavProps) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="h-screen w-64 bg-white shadow-lg fixed left-0 top-0 p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">IronArena</h2>
      </div>

      <nav>
        <ul className="space-y-2">
          {role === "Admin" && (
            <>
              <li>
                <Link
                  href="/dashboard/admin/dashboard"
                  className={`flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${
                    isActive("/dashboard/admin/dashboard")
                      ? "bg-rose-100 text-rose-600"
                      : "hover:bg-rose-50 hover:text-red-600"
                  }`}
                >
                  <PieChart /> Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/admin/categories"
                  className={`flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${
                    isActive("/dashboard/admin/categories")
                      ? "bg-rose-100 text-rose-600"
                      : "hover:bg-rose-50 hover:text-red-600"
                  }`}
                >
                  <File /> Category
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/admin/controls"
                  className={`flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${
                    isActive("/dashboard/admin/controls")
                      ? "bg-rose-100 text-rose-600"
                      : "hover:bg-rose-50 hover:text-red-600"
                  }`}
                >
                  <CheckSquare2Icon /> Controls
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/admin/userList"
                  className={`flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${
                    isActive("/dashboard/admin/userList")
                      ? "bg-rose-100 text-rose-600"
                      : "hover:bg-rose-50 hover:text-red-600"
                  }`}
                >
                  <Users /> Users
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/admin/logs"
                  className={`flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${
                    isActive("/dashboard/users/controls")
                      ? "bg-rose-100 text-rose-600"
                      : "hover:bg-rose-50 hover:text-red-600"
                  }`}
                >
                  <Layers /> Logs
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/admin/transaction"
                  className={`flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${
                    isActive("/dashboard/admin/transaction")
                      ? "bg-rose-100 text-rose-600"
                      : "hover:bg-rose-50 hover:text-red-600"
                  }`}
                >
                  <Landmark /> Transactions
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/settings"
                  className={`flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${
                    isActive("/dashboard/settings")
                      ? "bg-rose-100 text-rose-600"
                      : "hover:bg-rose-50 hover:text-red-600"
                  }`}
                >
                  <Settings /> Settings
                </Link>
              </li>
            </>
          )}

          {role === "User" && (
            <>
              <li>
                <Link
                  href="/dashboard/users/dashboard"
                  className={`flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${
                    isActive("/dashboard/users/dashboard")
                      ? "bg-rose-100 text-rose-600"
                      : "hover:bg-rose-50 hover:text-red-600"
                  }`}
                >
                  <PieChart /> Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/users/controls"
                  className={`flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${
                    isActive("/dashboard/users/controls")
                      ? "bg-rose-100 text-rose-600"
                      : "hover:bg-rose-50 hover:text-red-600"
                  }`}
                >
                  <CheckSquare2Icon /> Controls
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/users/logs"
                  className={`flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${
                    isActive("/dashboard/users/controls")
                      ? "bg-rose-100 text-rose-600"
                      : "hover:bg-rose-50 hover:text-red-600"
                  }`}
                >
                  <Layers /> Logs
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/settings"
                  className={`flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${
                    isActive("/dashboard/settings")
                      ? "bg-rose-100 text-rose-600"
                      : "hover:bg-rose-50 hover:text-red-600"
                  }`}
                >
                  <Settings /> Settings
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default SideNav;
