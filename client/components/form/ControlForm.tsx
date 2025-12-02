"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  addControls,
  editControls,
  fetchCategories,
} from "@/services/adminServices";
import { ControlFormProps, Category, Controls } from "@/types/types";

import FormCheckbox from "../common/FormCheckbox";
import FormButton from "../common/FormButton";
import FormSelect from "../common/FormSelect";
import { ControlFormData, controlSchema } from "@/schemas/controlSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../common/FormInput";

const ControlForm = ({ control, onClose, onSuccess }: ControlFormProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isChecked, setIsChecked] = useState(
    control?.attachmentRequired ?? false
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ControlFormData>({
    resolver: zodResolver(controlSchema),
  });

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data.categories);

      if (control) {
        reset({
          description: control.description,
          tips: control.tips || "",
          controlmapping: control.controlmapping || "",
          mediaLink: control.mediaLink || "",
          categoryId: control.categoryId,
          controlnumber: control.controlnumber,
          attachmentRequired: control.attachmentRequired,
        });
        setIsChecked(control.attachmentRequired);
      }
    };

    loadCategories();
  }, [control, reset]);

  const onSubmit = async (data: Controls) => {
    data.attachmentRequired = isChecked;

    if (control) {
      await editControls(control.id, data);
      if (onSuccess) onSuccess();
    } else {
      await addControls(data);
      if (onSuccess) onSuccess();
      reset();
      setIsChecked(false);
    }

    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          {control ? "Edit Control" : "Add Control"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormInput
            placeholder="Title"
            {...{ register, name: "description", error: errors.description }}
          />
          <FormInput
            placeholder="Tips"
            {...{ register, name: "tips", error: errors.tips }}
          />
          <FormInput
            placeholder="Control Mapping"
            {...{
              register,
              name: "controlmapping",
              error: errors.controlmapping,
            }}
          />
          <FormInput
            placeholder="Media Link"
            {...{ register, name: "mediaLink", error: errors.mediaLink }}
          />

          <FormSelect
            label="Category"
            options={categories.map((c) => ({
              value: c.id,
              label: c.categoryname,
            }))}
            {...{ register, name: "categoryId", error: errors.categoryId }}
          />

          <FormInput
            placeholder="Control Number"
            type="string"
            {...{
              register,
              name: "controlnumber",
              error: errors.controlnumber,
            }}
          />

          <FormCheckbox
            label="Attachment Required"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />

          <div className="flex gap-4 mt-4">
            <FormButton type="submit" variant="primary">
              {control ? "Save Changes" : "Add Control"}
            </FormButton>
            <FormButton type="button" variant="secondary" onClick={onClose}>
              Cancel
            </FormButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ControlForm;
