"use client";
import Footer from "@/components/common/Footer";
import SideNav from "@/components/sidenav/SideBar";
import { Role } from "@/types/types";
import { useEffect, useState } from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role | undefined>(undefined);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("users") || "{}");
    setRole(user.role);
  }, []);

  if (!role)
    return (
      <div className="flex items-center justify-center h-screen w-screen overflow-hidden">
        Loading...
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <SideNav role={role} />
        <div className="ml-64 flex-1 h-full p-8 overflow-auto">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
