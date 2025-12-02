import { z } from "zod";

export const categorySchema = z.object({
  categoryname: z.string().min(1, "Category name is required"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
