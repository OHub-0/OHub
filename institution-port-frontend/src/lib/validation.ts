import { z } from "zod"
import { parsePhoneNumberFromString } from "libphonenumber-js"


export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(2, {
        message: "First name must be at least 2 characters.",
      })
      .max(50, {
        message: "First name must not exceed 50 characters.",
      }),
    middleName: z
      .string()
      .max(50, {
        message: "Middle name must not exceed 50 characters.",
      })
      .optional(),
    lastName: z
      .string()
      .min(2, {
        message: "Last name must be at least 2 characters.",
      })
      .max(50, {
        message: "Last name must not exceed 50 characters.",
      }),
    username: z
      .string()
      .min(3, {
        message: "Username must be at least 6 characters.",
      })
      .max(30, {
        message: "Username must not exceed 30 characters.",
      })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores.",
      }),
    country: z.string().min(1, {
      message: "Please select a country.",
    }),
    countryCode: z.string().min(1, {
      message: "Please select a country code.",
    }),
    phoneNumber: z
      .string()
      .min(7, {
        message: "Mobile number must be at least 7 digits.",
      })
      .max(15, {
        message: "Mobile number must not exceed 15 digits.",
      })
      .regex(/^\d+$/, {
        message: "Mobile number can only contain digits.",
      }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      const fullNumber = data.countryCode + data.phoneNumber
      console.log(fullNumber)
      const phoneNumber = parsePhoneNumberFromString(fullNumber)
      return phoneNumber && phoneNumber.isValid()
    },
    {
      message: "Please enter a valid phone number",
      path: ["phoneNumber"], // Show error on phone number field
    },
  )
  .transform((data) => {
    const fullNumber = data.countryCode + data.phoneNumber
    const phoneNumber = parsePhoneNumberFromString(fullNumber)
    return {
      ...data,
      phoneNumber: phoneNumber ? phoneNumber.format("E.164") : fullNumber,   //phoneno is changed into e.164 format eg->+9779834302323
    }
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })



export const usernameLoginSchema = z.object({
  username: z.string().min(1, "Username is required").min(3, "Username must be at least 6 characters"),
  password: z.string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number.",
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
})

export const mobileLoginSchema = z
  .object({
    countryCode: z.string().min(1, {
      message: "Please select a country code.",
    }),
    phoneNumber: z.string().min(1, "Phone number is required").regex(/^\d+$/, "Phone number must contain only digits"),
    password: z.string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character.",
      }),
  })
  .refine(
    (data) => {
      const fullNumber = data.countryCode + data.phoneNumber
      const phoneNumber = parsePhoneNumberFromString(fullNumber)
      return phoneNumber && phoneNumber.isValid()
    },
    {
      message: "Please enter a valid phone number",
      path: ["phoneNumber"], // Show error on phone number field
    },
  )
  .transform((data) => {
    const fullNumber = data.countryCode + data.phoneNumber
    const phoneNumber = parsePhoneNumberFromString(fullNumber)
    console.log(phoneNumber)
    return {
      ...data,
      phoneNumber: phoneNumber ? phoneNumber.format("E.164") : fullNumber,   //phoneno is changed into e.164 format eg->+9779834302323
    }
  })

export type SignUpForm = z.infer<typeof signUpSchema>
export type UsernameLoginForm = z.infer<typeof usernameLoginSchema>
export type MobileLoginForm = z.infer<typeof mobileLoginSchema>