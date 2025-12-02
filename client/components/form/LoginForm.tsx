"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { loginStep1 } from "@/services/authServices";
import { useAuthStorage } from "@/hooks/useAuthStorage";
import FormButton from "../common/FormButton";
import FormInput from "../common/FormInput";
import Link from "next/link";

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const { saveUser, saveTempToken } = useAuthStorage();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      setErrorMessage(null);

      const res = await loginStep1(data);

      // 1️⃣ 2FA flow
      if (res.tempToken) {
        saveTempToken(res.tempToken, "2fa");
        router.push("/auth/verify-otp");
        return;
      }

      // 2️⃣ Extract token and user info
      // const token =
      //   typeof res.token === "string" ? res.token : res.token?.accessToken;
      // const userData = res.userData || res.user;
      // console.log();

      const token = res.accessToken?.accessToken;
      const userData = res.user;
      if (!token || !userData) {
        setErrorMessage("Login failed. Please try again.");
        return;
      }

      console.log("token and userData", token, userData);

      saveUser(userData, token);

      if (res.success === false && res.type === "not_subscribed") {
        router.replace("/subscription");
        return;
      }
      // 3️⃣ Non-subscribed users → subscription page
      if (
        userData.role === "User" &&
        userData.subscriptionStatus !== "active"
      ) {
        router.replace("/subscription");
        return;
      }

      // 4️⃣ Admin dashboard
      if (userData.role === "Admin") {
        router.replace("/dashboard/admin/dashboard");
        return;
      }

      // 5️⃣ Subscribed users
      if (
        userData.role === "User" &&
        userData.subscriptionStatus === "active"
      ) {
        router.replace("/dashboard/users/dashboard");
        return;
      }

      setErrorMessage("Unable to determine user status. Please try again.");
    } catch (err: any) {
      console.error("Login error:", err);

      // Handle normalized backend error
      const errorData = err.response?.data || err;

      if (errorData.type === "not_subscribed") {
        const userData = errorData.userData || errorData.user;
        const token =
          typeof errorData.token === "string"
            ? errorData.token
            : errorData.token?.accessToken;

        if (userData && token) saveUser(userData, token);
        router.replace("/subscription");
        return;
      }

      setErrorMessage(errorData.message || "Login failed. Please try again.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4"
      style={{ backgroundColor: "#d9637c" }}
    >
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <h1 className="text-2xl font-semibold text-center mb-8 text-gray-700">
          Login
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorMessage && (
            <p className="text-center text-red-600 mb-4">{errorMessage}</p>
          )}

          <FormInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            {...{ register, name: "email", error: errors.email }}
          />
          <FormInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            {...{ register, name: "password", error: errors.password }}
          />

          <div className="flex justify-between items-center">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-rose-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <FormButton type="submit" variant="primary">
            Login
          </FormButton>

          <div className="flex justify-between items-center mt-2">
            <Link
              href="/auth/signup"
              className="text-sm text-rose-600 hover:underline"
            >
              New User? Sign up
            </Link>
            <Link
              href="/subscription"
              className="text-sm text-rose-600 hover:underline"
            >
              Subscription
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
