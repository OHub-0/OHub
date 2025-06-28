// Helper: phone number transformer
import { z } from "zod"
import { parsePhoneNumberFromString } from "libphonenumber-js"


export const officialNameSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must not exceed 50 characters"),

    middleName: z
      .string()
      .max(50, "Middle name must not exceed 50 characters")
      .optional(),

    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must not exceed 50 characters"),
  })

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password too long")
  .regex(/[A-Z]/, "Must include an uppercase letter")
  .regex(/[a-z]/, "Must include a lowercase letter")
  .regex(/[0-9]/, "Must include a number")
  .regex(/[^a-zA-Z0-9]/, "Must include a special character")


export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must not exceed 30 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")

export const mobileSchema = z
  .object({
    countryCode: z.string().min(1, "Country code is required"),
    number: z.string().min(4, "Phone number is required"),
  })
  .refine(
    (data) => {
      const full = `+${data.countryCode}${data.number}`
      const parsed = parsePhoneNumberFromString(full)
      return parsed?.isValid()
    },
    { message: "Invalid phone number" }
  )

export const emailsSchema = z
  .array(z.string().email("Invalid email"))
  .min(1, "At least one email is required")
  .transform((arr) => [...new Set(arr.map((e) => e.trim().toLowerCase()))])



export const countrySchema = z.string().min(1, "Country is required")

export const citySchema = z.string().max(100, "City must be less than 100 characters").optional()

export const dateOfBirthSchema = z
  .string()
  .refine(
    (date) => {
      const d = new Date(date)
      return d instanceof Date && !isNaN(d.getTime())
    },
    { message: "Invalid date format" }
  )
  .optional()


export const avatarUrlSchema = z.string().url("Invalid URL").optional()



export const educationSchema = z
  .object({
    level: z.string().optional(),
    institution: z.string().max(200, "Institution name too long").optional(),
    fieldOfStudy: z.string().max(100, "Field too long").optional(),
    degree: z.string().max(100, "Degree too long").optional(),
    graduationYear: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          (/^\d{4}$/.test(val) && parseInt(val) >= 1900 && parseInt(val) <= new Date().getFullYear() + 10),
        {
          message: "Graduation year must be a valid 4-digit year",
        }
      ),
  })
  .optional()


export const otpVerificationSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),
  type: z.enum(["email", "phone"]),
  value: z.string().min(1, "Value is required"),
})
export type OtpVerificationData = z.infer<typeof otpVerificationSchema>
export type mobileSchemaType = z.infer<typeof mobileSchema>
export type usernameSchemaType = z.infer<typeof usernameSchema>
export type officialNameType = z.infer<typeof officialNameSchema>
export type countrySchemaType = z.infer<typeof countrySchema>
export type passwordSchemaType = z.infer<typeof passwordSchema>
export type avatarUrlSchemaType = z.infer<typeof avatarUrlSchema>
export type citySchemaType = z.infer<typeof citySchema>
export type dateOfBirthSchemaType = z.infer<typeof dateOfBirthSchema>
export type educationSchemaType = z.infer<typeof educationSchema>

