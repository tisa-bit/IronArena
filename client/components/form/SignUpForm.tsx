"use client";

import Link from "next/link";
import FormInput from "../common/FormInput";
import FormButton from "../common/FormButton";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { SignUp } from "@/services/authServices";
import { UserFormData, userSchema } from "@/schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";

const SignUpForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({ resolver: zodResolver(userSchema) });

  const onSubmit = async (data: UserFormData) => {
    console.log("hello");

    const formData = new FormData();
    formData.append("firstname", data.firstname);
    formData.append("lastname", data.lastname);
    formData.append("companyname", data.companyname);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);

    if (data.companyLogo && data.companyLogo[0]) {
      formData.append("companyLogo", data.companyLogo[0]);
    }

    const newUser = await SignUp(formData);
    console.log("NEW USER", newUser);
    const token = newUser.data.tempToken;
    const user = newUser.data.newUser;
    if (token) {
      localStorage.setItem("tempToken", token);
      localStorage.setItem("otpfor", "email");
      localStorage.setItem("users", JSON.stringify(user));
      router.replace("/auth/verify-otp");
      return;
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4"
      style={{ backgroundColor: "#d9637c" }}
    >
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <h1 className="text-2xl font-semibold text-center mb-8 text-gray-700">
          Signup
        </h1>

        {/* IMPORTANT: use handleSubmit here */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            label="First name"
            type="text"
            placeholder="Firstname"
            {...{ register, name: "firstname", error: errors.firstname }}
          />
          <FormInput
            label="Last name"
            type="text"
            placeholder="Last name"
            {...{ register, name: "lastname", error: errors.lastname }}
          />
          <FormInput
            label="Company Name"
            type="text"
            placeholder="Company Name"
            {...{ register, name: "companyname", error: errors.companyname }}
          />
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Company Logo
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("companyLogo")}
              className="w-full py-2 border rounded-md"
            />
          </div>
          <FormInput
            label="Email"
            type="text"
            placeholder="email"
            {...{ register, name: "email", error: errors.email }}
          />
          <FormInput
            label="Password"
            type="password"
            placeholder="password"
            {...{ register, name: "password", error: errors.password }}
          />
          <FormInput
            label="Confirm password"
            type="password"
            placeholder="re-enter the password"
            {...{
              register,
              name: "confirmPassword",
              error: errors.confirmPassword,
            }}
          />

          <FormButton type="submit" variant="primary">
            SignUp
          </FormButton>

          <div className="flex justify-between items-center">
            <Link href="/" className="text-sm text-rose-600 hover:underline">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
