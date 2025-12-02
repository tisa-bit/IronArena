"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStorage } from "./useAuthStorage";

const usePreventBack = () => {
  const router = useRouter();
  const { getUser } = useAuthStorage();

  useEffect(() => {
    // Replace history entry to prevent back navigation
    window.history.replaceState(null, "", window.location.href);

    const handlePopState = () => {
      const currentUser = getUser();
      if (currentUser?.accessToken) {
        const redirectPath =
          currentUser.user.role === "Admin"
            ? "/dashboard/admin/dashboard"
            : "/dashboard/users/dashboard";
        router.replace(redirectPath);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [getUser, router]);
};

export default usePreventBack;
