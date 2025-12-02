"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import FormInput from "@/components/common/FormInput";
import FormButton from "@/components/common/FormButton";
import { sendEmailForgetPassword } from "@/services/authServices";

type ForgetPasswordFormInputs = {
  email: string;
};

const ForgetPassword = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordFormInputs>();

  const onSubmit: SubmitHandler<ForgetPasswordFormInputs> = async (data) => {
    try {
      const res = await sendEmailForgetPassword(data.email);
      setMessage(res.message || "Password reset link sent!");
    } catch (err) {
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4"
      style={{ backgroundColor: "#d9637c" }}
    >
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <h1 className="text-2xl font-semibold text-center mb-8 text-gray-700">
          Forgot Password
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Email"
            type="email"
            placeholder="Enter your registered Email ID"
            {...{ register, name: "email", error: errors.email }}
          />

          <FormButton type="submit" variant="primary">
            Send Email
          </FormButton>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-sm font-medium mt-2 text-rose-600"
          >
            Back to Login
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-green-600 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
