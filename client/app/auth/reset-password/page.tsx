"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword, setNewPassword } from "@/services/authServices";
import FormInput from "@/components/common/FormInput";
import FormButton from "@/components/common/FormButton";
import { useAuthStorage } from "@/hooks/useAuthStorage";
import { useState } from "react";

type ResetPasswordInputs = {
  password: string;
  confirmPassword: string;
};

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // console.log("token", token);

  const { saveUser } = useAuthStorage();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInputs>();

  // token validation
  if (!token) {
    return (
      <p className="text-center mt-4 text-red-600">
        Invalid or expired reset link
      </p>
    );
  }

  const onSubmit: SubmitHandler<ResetPasswordInputs> = async (data) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // API call
      const res = await resetPassword(token, data.password);

      console.log("res", res.result);

      if (!res?.result?.updatedUser || !res?.result?.tempToken?.accessToken) {
        alert("Password reset failed. Please try again.");
        return;
      }

      // Save user + JWT normally
      saveUser(res.result.updatedUser, res.result.tempToken.accessToken);

      const user = JSON.parse(localStorage.getItem("users") || "{}");

      if (user.role === "Admin") {
        router.replace("/dashboard/admin/dashboard");
      } else if (user.role === "User") {
        if (user.subscriptionStatus === "active") {
          router.replace("/dashboard/users/dashboard");
        } else {
          router.replace("/subscription");
        }
      }
    } catch (error: any) {
      alert(error?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-[#d9637c]">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <h1 className="text-2xl font-semibold text-center mb-8 text-gray-700">
          Set New Password
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="New Password"
            type="password"
            placeholder="Enter new password"
            {...{ register, name: "password", error: errors.password }}
            validation={{ required: "Password is required" }}
          />

          <FormInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm password"
            {...{
              register,
              name: "confirmPassword",
              error: errors.confirmPassword,
            }}
            validation={{ required: "Confirm your password" }}
          />

          <FormButton disabled={loading} type="submit" variant="primary">
            {loading ? "Updating..." : "Reset Password"}
          </FormButton>

          <button
            type="button"
            className="mt-4 text-sm text-gray-600 hover:underline block text-center"
            onClick={() => router.push("/")}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
