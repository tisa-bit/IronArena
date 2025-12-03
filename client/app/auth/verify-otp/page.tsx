"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import FormInput from "@/components/common/FormInput";
import FormButton from "@/components/common/FormButton";
import {
  emailOtpVerification,
  verify2FALoginOTP,
} from "@/services/authServices";
import { useAuthStorage } from "@/hooks/useAuthStorage";

type VerifyOtpFormInputs = {
  otp: string;
};

const VerifyOtpPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormInputs>();

  const { saveUser, getTempToken } = useAuthStorage();

  const onSubmit: SubmitHandler<VerifyOtpFormInputs> = async (data) => {
    const tempToken = getTempToken();
    if (!tempToken) {
      alert("Session expired. Please login again.");
      return;
    }

    const otpfor = localStorage.getItem("otpfor");

    let res;
    try {
      if (otpfor === "email") {
        res = await emailOtpVerification(tempToken, data.otp);
      } else {
        res = await verify2FALoginOTP(tempToken, data.otp);
      }

      const finalToken = res?.tempToken || res?.token?.accessToken;
      const user = res?.user;

      if (!finalToken || !user) {
        alert("Verification failed. Please try again.");
        return;
      }

      saveUser(user, finalToken);
      localStorage.removeItem("tempToken");
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
      alert(error?.message || "OTP verification failed");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4 relative"
      style={{ backgroundColor: "#d9637c" }}
    >
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-2">
          Two-Factor Authentication
        </h2>
        <p className="text-center text-black mb-8">
          Enter the 6-digit code from your authenticator app
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="OTP"
            type="text"
            placeholder="Enter OTP"
            {...{ register, name: "otp", error: errors.otp }}
          />

          <FormButton type="submit" variant="primary">
            Verify
          </FormButton>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
