"use client";

import Card from "@/components/common/Cards";
import { fetchUsersById } from "@/services/adminServices";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UserDetails = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [userReport, setUserReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    const loadUser = async () => {
      setLoading(true);
      const res = await fetchUsersById(id); // returns { user, reportContent }
      setUserReport(res);
      setLoading(false);
    };
    loadUser();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-40 text-gray-500">
        Loading user details...
      </div>
    );

  if (!userReport)
    return (
      <div className="flex items-center justify-center h-40 text-gray-500">
        User not found
      </div>
    );

  const { user, reportContent } = userReport;
  const { summary, answers } = reportContent;

  return (
    <Card
      title={`User Report: ${user.firstname} ${user.lastname}`}
      onClose={() => router.back()}
    >
      <div className="space-y-6">
        {/* --- User Info --- */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">
            User Information
          </h2>
          <div className="flex gap-2">
            <strong className="w-40 text-gray-700">Name:</strong>
            <span className="text-gray-800">
              {user.firstname} {user.lastname}
            </span>
          </div>
          <div className="flex gap-2">
            <strong className="w-40 text-gray-700">Email:</strong>
            <span className="text-gray-800">{user.email}</span>
          </div>
          <div className="flex gap-2">
            <strong className="w-40 text-gray-700">Company:</strong>
            <span className="text-gray-800">{user.companyname || "-"}</span>
          </div>
          <div className="flex gap-2">
            <strong className="w-40 text-gray-700">Subscription Status:</strong>
            <span className="text-gray-800">{user.subscriptionStatus}</span>
          </div>
        </div>

        {/* --- Summary --- */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">
            Submission Summary
          </h2>
          <div className="grid grid-cols-2 gap-4 text-gray-800">
            <div className="flex justify-between">
              <span>Implemented:</span>
              <span>{summary.implementedCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Not Implemented:</span>
              <span>{summary.not_implementedCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Not Applicable:</span>
              <span>{summary.not_applicableCount}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total Submissions:</span>
              <span>{summary.totalSubmission}</span>
            </div>
          </div>
        </div>

        {/* --- Answers --- */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">
            Submitted Answers
          </h2>
          {answers.length === 0 ? (
            <p className="text-gray-500">No answers submitted yet.</p>
          ) : (
            <div className="space-y-4">
              {answers.map((ans: any, idx: number) => (
                <div key={idx} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex gap-2 text-black">
                    <strong>Control Number:</strong>
                    <span>{ans.controlNumber}</span>
                  </div>
                  <div className="flex gap-2 text-black">
                    <strong>Description:</strong>
                    <span>{ans.controlDescription}</span>
                  </div>
                  <div className="flex gap-2 text-black">
                    <strong>Status:</strong>
                    <span>{ans.status}</span>
                  </div>
                  <div className="flex gap-2 text-black">
                    <strong>Reason:</strong>
                    <span>{ans.reason || "-"}</span>
                  </div>
                  <div className="flex gap-2 text-black">
                    <strong>Submitted At:</strong>
                    <span>{new Date(ans.submittedAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default UserDetails;
