"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AlertCircle, Building2, Eye, EyeOff, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/utils/basic-utils"
import { PhoneNumberInput } from "@/components/phonenumberinput"
import { SignUpForm, signUpSchema } from "@/lib/validation/auth-validation"
import Link from "next/link"
import { SignUpCredentials, useSignUpMutation } from "@/lib/queries/use-signup"
import { useNationQuery } from "@/lib/queries/use-nation-city"
import { FullNationApiResponse } from "@/utils/types"


export default function SignUpPage() {
  const signUpMutation = useSignUpMutation();
  const { data: nationQuery, isError: nationQueryIsError, isLoading: nationQueryIsLoading } = useNationQuery({ code: "true", flag: "true" })
  const nationData: FullNationApiResponse[] = nationQuery?.data?.nations
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [countryOpen, setCountryOpen] = useState(false)

  const signupForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      officialName: {
        firstName: "",
        middleName: "",
        lastName: "",
      },
      username: "",
      country: "",
      mobile: {
        countryCode: "",
        number: "",
      },
      password: "",
      confirmPassword: "",
    },
  })

  function onSubmit(values: SignUpForm) {
    const { officialName, username, country, mobile, password } = values
    const fullMobileNo = `${mobile.countryCode}${mobile.number}`
    // Send cleaned + combined payload
    signUpMutation.mutate({
      officialName: officialName, username: username, country: country, mobile: fullMobileNo, password: password
    });
  }


  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-8 w- mr-2" />
            <h1 className="text-2xl font-bold">Institution Port</h1>
          </div>
          <CardTitle className="text-lg">Create Your Account</CardTitle>
          <CardDescription>
            Join Institution Port and start your journey with us
          </CardDescription>
        </CardHeader>
        <CardContent>


          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={signupForm.control}
                  name="officialName.firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="officialName.middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Michael"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="officialName.lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Username */}
              <FormField
                control={signupForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="johndoe123"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Country */}
              <FormField
                control={signupForm.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Country *</FormLabel>
                    <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-gray-400",
                            )}
                          >
                            {field.value && nationData ? (
                              <div className="flex items-center gap-2">
                                <span>{nationData.find((c) => c.name === field.value)?.flag}</span>
                                <span>{field.value}</span>
                              </div>
                            ) : (
                              "Select country"
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search country..." />
                          <CommandList>
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                              {nationData && nationData.map((country) => (
                                <CommandItem
                                  value={country.name}
                                  key={country.name}
                                  onSelect={() => {
                                    signupForm.setValue("country", country.name)
                                    setCountryOpen(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      country.name === field.value ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  <div className="flex items-center gap-2">
                                    <span>{country.flag}</span>
                                    <span>{country.name}</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Phone Number Component */}
              <PhoneNumberInput
                nationData={nationData}
                isLoading={nationQueryIsLoading}
                isError={nationQueryIsError}
                form={signupForm}
              />

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            className="pr-1"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm password"
                            className="pr-1"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={signUpMutation.isPending}>
                {signUpMutation.isPending ? "Creating Account..." : "Create Account"}
              </Button>
              {signUpMutation.error && (
                <Alert variant="destructive" className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="pt-1">{signUpMutation.error.message}</AlertDescription>
                </Alert>
              )}
            </form>
          </Form>

          <div className="mt-6 text-center text-xs">
            Already have an account?{" "}
            <Link href="/login" className="hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
