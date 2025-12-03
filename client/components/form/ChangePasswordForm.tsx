"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { changePassword } from "@/services/authServices";
import FormInput from "../common/FormInput";
import FormButton from "../common/FormButton";

type ChangePasswordInputs = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangePasswordForm = () => {
  const router = useRouter();
  const [cpError, setCpError] = useState("");
  const [cpSuccess, setCpSuccess] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordInputs>();

  const onSubmit: SubmitHandler<ChangePasswordInputs> = async (data) => {
    setCpError("");
    setCpSuccess("");

    if (data.newPassword !== data.confirmPassword) {
      setCpError("Passwords do not match.");
      return;
    }

    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setCpSuccess("Password updated!");
      reset();
      router.replace("/");
    } catch (err: any) {
      setCpError(err?.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mt-2"
    >
      <FormInput
        label="Current Password"
        type="password"
        placeholder="Enter current password"
        name="currentPassword"
        register={register}
        error={errors.currentPassword}
      />

      <FormInput
        label="New Password"
        type="password"
        placeholder="Enter new password"
        name="newPassword"
        register={register}
        error={errors.newPassword}
      />

      <FormInput
        label="Confirm Password"
        type="password"
        placeholder="Confirm new password"
        name="confirmPassword"
        register={register}
        error={errors.confirmPassword}
      />

      <FormButton type="submit" variant="primary">
        Update Password
      </FormButton>

      {cpError && <p className="text-red-500 text-sm">{cpError}</p>}
      {cpSuccess && <p className="text-green-600 text-sm">{cpSuccess}</p>}
    </form>
  );
};

export default ChangePasswordForm;
