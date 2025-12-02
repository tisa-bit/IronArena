import z from "zod";
export const userSchema = z
  .object({
    firstname: z.string().min(1, "Firstname is required"),
    lastname: z.string().min(1, "Lastname is required"),
    companyname: z.string().min(1, "Company name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    companyLogo: z
      .any()
      .optional()
      .refine(
        (file) => !file || (typeof file === "object" && file.length > 0),
        "Company logo must be a file"
      ),
    profilePic: z
      .any()
      .optional()
      .refine(
        (file) => !file || (typeof file === "object" && file.length > 0),
        "Profile picture must be a file"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UserFormData = z.infer<typeof userSchema>;

export const adminInviteUserSchema = userSchema.pick({
  firstname: true,
  lastname: true,
  companyname: true,
  email: true,
});

export type AdminInviteUserFormData = z.infer<typeof adminInviteUserSchema>;
