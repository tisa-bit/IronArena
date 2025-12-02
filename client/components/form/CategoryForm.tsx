"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { CategoryFormProps } from "@/types/types";
import { categorySchema, CategoryFormData } from "@/schemas/categorySchema";

import FormButton from "../common/FormButton";
import FormInput from "../common/FormInput";
import { addCategories, editCategories } from "@/services/categoryService";

const CategoryForm = ({ category, onClose, onSuccess }: CategoryFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (category) {
      reset({ categoryname: category.categoryname });
    }
  }, [category, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    if (category && category.id !== undefined) {
      await editCategories(category?.id, data);
      if (onSuccess) onSuccess();
    } else {
      await addCategories(data);
      if (onSuccess) onSuccess();
    }
    if (onClose) onClose();
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
        {category ? "Edit Category" : "Add Category"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          placeholder="Category Name"
          {...{ register, name: "categoryname", error: errors.categoryname }}
        />

        <div className="flex gap-4 mt-4">
          <FormButton type="submit" variant="primary">
            {category ? "Update" : "Add"}
          </FormButton>
          <FormButton type="button" variant="secondary" onClick={onClose}>
            Cancel
          </FormButton>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
