"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";


import { UserFormProps, User } from "../../types/types";
import {
  AdminInviteUserFormData,
  adminInviteUserSchema,
  UserFormData,
} from "../../schemas/userSchema";

import FormButton from "../common/FormButton";
import FormInput from "../common/FormInput";


import { addUsers, editUsers } from "@/services/userService";

const UsersForm = ({ onClose, user, onUserUpdate }: UserFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdminInviteUserFormData>({
    resolver: zodResolver(adminInviteUserSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        companyname: user.companyname || "",
        email: user.email || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UserFormData) => {
    console.log("adding userr");

    const formData = new FormData();
    formData.append("firstname", data.firstname);
    formData.append("lastname", data.lastname);
    formData.append("email", data.email);
    formData.append("companyname", data.companyname);

    if (data.profilePic && data.profilePic[0]) {
      formData.append("profilePic", data.profilePic[0]);
    }

    let updatedUser: User;

    if (user) {
      updatedUser = await editUsers(user.id, formData);
      alert("updated successfully");
    } else {
      updatedUser = await addUsers(formData);
      alert("added successfully");
    }
    onUserUpdate?.(updatedUser);
    reset();
    onClose();
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl relative">
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
        {user ? "Edit User" : "Add User"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          placeholder="First Name"
          {...{ register, name: "firstname", error: errors.firstname }}
        />
        <FormInput
          placeholder="Last Name"
          {...{ register, name: "lastname", error: errors.lastname }}
        />
        <FormInput
          placeholder="Company Name"
          {...{ register, name: "companyname", error: errors.companyname }}
        />
        <FormInput
          placeholder="Email"
          type="email"
          {...{ register, name: "email", error: errors.email }}
        />

        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("profilePic")}
            className="w-full py-2 border rounded-md"
          />
        </div>

        <div className="flex gap-4 mt-4">
          <FormButton type="submit" variant="primary">
            {user ? "Update User" : "Add User"}
          </FormButton>
          <FormButton type="button" variant="secondary" onClick={onClose}>
            Cancel
          </FormButton>
        </div>
      </form>
    </div>
  );
};

export default UsersForm;
