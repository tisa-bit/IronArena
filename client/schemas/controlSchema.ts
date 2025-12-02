import { z } from "zod";

export const controlSchema = z.object({
  description: z.string().nonempty("Description is required"),
  tips: z.string().optional(),
  controlmapping: z.string().optional(),
  mediaLink: z.string().url("Invalid URL").nonempty("Media link is required"),
  categoryId: z.string().min(1, "Category is required"),
  controlnumber: z.string().min(1, "Control number must be greater than 0"),
  attachmentRequired: z.boolean().optional(),
});

export type ControlFormData = z.infer<typeof controlSchema>;
