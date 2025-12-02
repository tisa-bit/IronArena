"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SubscriptionSuccessPage = () => {
  const router = useRouter();

  useEffect(() => {
    const userString = localStorage.getItem("users");
    if (!userString) {
      router.push("/");
      return;
    }

    const user = JSON.parse(userString);

    if (user.role === "Admin") {
      router.push("/dashboard/admin/dashboard");
    } else if (user.role === "User") {
      router.push("/dashboard/users/dashboard");
    } else {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Thank you! Your subscription is now active.</p>
    </div>
  );
};

export default SubscriptionSuccessPage;
