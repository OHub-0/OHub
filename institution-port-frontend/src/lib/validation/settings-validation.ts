import { z } from "zod"
import { avatarUrlSchema, citySchema, countrySchema, dateOfBirthSchema, educationSchema, emailsSchema, mobileSchema, officialNameSchema, otpVerificationSchema, passwordSchema, usernameSchema, } from "./common-validation"

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema
    // confirmPassword: z.string(),
  })
// .refine((data) => data.newPassword === data.confirmPassword, {
// message: "Passwords do not match",
// path: ["confirmPassword"],
// })
export const settingsSchema = z
  .object({
    officialName: officialNameSchema,
    username: usernameSchema,
    country: countrySchema,
    city: citySchema,
    dateOfBirth: dateOfBirthSchema,
    avatarUrl: avatarUrlSchema,
    emails: emailsSchema,
    phone: mobileSchema,
    education: educationSchema,
    password: passwordChangeSchema,
  })


export type SettingsFormData = z.infer<typeof settingsSchema>
export type passwordChangeSchemaType = z.infer<typeof passwordChangeSchema>

