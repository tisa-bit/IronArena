"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { setNewPassword } from "@/services/authServices";
import FormInput from "@/components/common/FormInput";
import FormButton from "@/components/common/FormButton";
import { useAuthStorage } from "@/hooks/useAuthStorage";

type SetPasswordFormInputs = {
  password: string;
};

const SetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { saveUser } = useAuthStorage();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetPasswordFormInputs>();
  if (!token)
    return (
      <p className="text-center mt-4 text-red-600">
        Invalid or expired reset link
      </p>
    );
  const onSubmit: SubmitHandler<SetPasswordFormInputs> = async (data) => {
    try {
      const res = await setNewPassword(token, data.password);
      const userData = res?.user;
      const accessToken = res?.tempToken?.accessToken;
      if (!userData || !accessToken) throw new Error("Failed to set password");
      saveUser(userData, accessToken);
      const user = JSON.parse(localStorage.getItem("users") || "{}");
      if (user.role === "Admin") {
        router.replace("/dashboard/admin/dashboard");
      } else if (user.role === "User") {
        router.replace("/");
        if (user.subscriptionStatus === "active") {
          router.replace("/dashboard/users/dashboard");
        } else {
          router.replace("/subscription");
        }
      }
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4 relative"
      style={{ backgroundColor: "#d9637c" }}
    >
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <h1 className="text-2xl font-semibold text-center mb-8 text-gray-700">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="New Password"
            type="password"
            placeholder="Enter new password"
            {...{ register, name: "password", error: errors.password }}
          />

          <FormButton type="submit" variant="primary">
            Set Password
          </FormButton>

          <button
            type="button"
            className="mt-4 text-sm text-gray-600 hover:underline"
            onClick={() => router.push("/subscription")}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
