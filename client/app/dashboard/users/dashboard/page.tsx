"use client";

import { useEffect, useState } from "react";

import ProgressChart from "@/components/common/Charts";
import usePreventBack from "@/hooks/usePreventBack";

import { progress } from "@/services/userServices";
import StatsSummary from "@/components/common/StatsSummary";
import { totalControl } from "@/services/controlsService";

const UserDashboard = () => {
  usePreventBack();

  const [counts, setCounts] = useState({ controls: 0 });
  const [progressData, setProgressData] = useState({
    implemented: 0,
    notImplemented: 0,
    notApplicable: 0,
  });
  const [user, setUser] = useState<{ id: number; firstname: string } | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total controls count
        const controlsRes = await totalControl();
        setCounts({ controls: controlsRes.data.count });

        // Get user from localStorage
        const storedUser = localStorage.getItem("users");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);

          // Fetch user progress
          const progressRes = await progress(userData.id);
          setProgressData({
            implemented: progressRes.data.implemented,
            notImplemented: progressRes.data.not_implemented,
            notApplicable: progressRes.data.not_applicable,
          });
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col justify-start gap-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Good morning {user?.firstname}, welcome to Iron Arena
      </h1>

      {/* Stats Summary */}
      <StatsSummary
        counts={{
          total: counts.controls,
          implemented: progressData.implemented,
          notImplemented: progressData.notImplemented,
          notApplicable: progressData.notApplicable,
        }}
      />

      {/* Progress Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <ProgressChart
          implemented={progressData.implemented}
          notImplemented={progressData.notImplemented}
          notApplicable={progressData.notApplicable}
        />
      </div>
    </div>
  );
};

export default UserDashboard;
