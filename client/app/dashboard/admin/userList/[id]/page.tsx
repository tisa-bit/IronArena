"use client";

import Card from "@/components/common/Cards";
import { fetchUsersById } from "@/services/adminServices";
import { User } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UserDetails = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    const loadUser = async () => {
      setLoading(true);
      const res = await fetchUsersById(id);
      setUser(res);
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
  if (!user)
    return (
      <div className="flex items-center justify-center h-40 text-gray-500">
        User not found
      </div>
    );

  return (
    <Card title="User Details" onClose={() => router.back()}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <strong className="text-gray-700 w-40">Name:</strong>
          <span className="text-gray-800">
            {user.firstname} {user.lastname}
          </span>
        </div>
        <div className="flex gap-2">
          <strong className="text-gray-700 w-40">Email:</strong>
          <span className="text-gray-800">{user.email}</span>
        </div>
        <div className="flex gap-2">
          <strong className="text-gray-700 w-40">Company Name:</strong>
          <span className="text-gray-800">{user.companyname || "-"}</span>
        </div>
      </div>
    </Card>
  );
};

export default UserDetails;
