"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Building2, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react"
import Link from "next/link"
import { PhoneNumberInput } from "@/components/phonenumberinput"
import { useState } from "react"
import { useLoginMutation } from "@/lib/queries/use-login"
import { MobileLoginForm, mobileLoginSchema, UsernameLoginForm, usernameLoginSchema } from "@/lib/validation/auth-validation"
import { FullNationApiResponse } from "@/utils/types"
import { useNationQuery } from "@/lib/queries/use-nation-city"


export default function LoginPage() {
  const idLoginMutation = useLoginMutation()
  const { data: nationQuery, isError: nationQueryIsError, isLoading: nationQueryIsLoading } = useNationQuery({ code: "true", flag: "true" })
  const nationData: FullNationApiResponse[] = nationQuery?.data?.nations
  const [showPassword, setShowPassword] = useState(false)
  const [showMobilePassword, setShowMobilePassword] = useState(false)


  // Forms
  const usernameForm = useForm<UsernameLoginForm>({
    resolver: zodResolver(usernameLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const mobileForm = useForm<MobileLoginForm>({
    resolver: zodResolver(mobileLoginSchema),
    defaultValues: {
      mobile: {
        countryCode: "+977",
        number: ""
      },
      password: "",
    },
  })

  return (
    <div className="flex items-center justify-center p-4 md:p-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 mr-2" />
            <h1 className="text-2xl font-bold">Institution Port</h1>
          </div>
          <CardTitle className="text-xl ">Welcome Back</CardTitle>
          <CardDescription>Log in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="username" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="username"
              >
                Username
              </TabsTrigger>
              <TabsTrigger
                value="mobile"
              >
                Mobile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="username" className="space-y-4 mt-6">
              <Form {...usernameForm}>
                <form onSubmit={usernameForm.handleSubmit((data) => idLoginMutation.mutate({ id: data.username, password: data.password, type: 'username' }))} className="space-y-4">
                  <FormField
                    control={usernameForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={usernameForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel >Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="pr-10"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2"
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
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={idLoginMutation.isPending}
                  >
                    {idLoginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging In...
                      </>
                    ) : (
                      "Log In"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="mobile" className="space-y-4 mt-6">
              <Form {...mobileForm}>
                <form onSubmit={mobileForm.handleSubmit((data) =>
                  idLoginMutation.mutate({
                    id: `${data.mobile.countryCode}${data.mobile.number}`, // Properly concatenate the full number
                    password: data.password,
                    type: 'mobile'
                  }))} className="space-y-4">
                  {/* Phone Number Component */}
                  <PhoneNumberInput
                    nationData={nationData}
                    isLoading={nationQueryIsLoading}
                    isError={nationQueryIsError}
                    control={mobileForm.control} errors={mobileForm.formState.errors} />
                  {/* continue */}
                  <FormField
                    control={mobileForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel >Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showMobilePassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="pr-10"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2"
                              onClick={() => setShowMobilePassword(!showMobilePassword)}
                            >
                              {showMobilePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={idLoginMutation.isPending}
                  >
                    {idLoginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging In...
                      </>
                    ) : (
                      "Log In"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
          {/* mutation error */}
          {idLoginMutation.error && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="pt-1">{idLoginMutation.error.message ?? "Something went wrong, Retry."}</AlertDescription>
            </Alert>
          )}
          {/* signup and password forgot optoons */}
          <div className="mt-6">
            <Separator className="my-4" />
            <div className="text-center space-y-2 text-xs">
              <p >
                Don't have an account?{" "}
                <Link href="/signup" className="hover:underline font-medium">
                  Sign Up
                </Link>
              </p>
              <button className=" hover:underline">Forgot password?</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}