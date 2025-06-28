"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Phone, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/utils/basic-utils"
import type { UseFormReturn } from "react-hook-form"
import { FullNationApiResponse } from "@/utils/types"

interface PhoneNumberInputProps {
  nationData: FullNationApiResponse[]
  isLoading: boolean
  isError: boolean
  form: UseFormReturn<any>
}


export function PhoneNumberInput({ nationData, isLoading, isError, form }: PhoneNumberInputProps) {
  const [countryCodeOpen, setCountryCodeOpen] = useState(false)
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium ">Mobile Number *</Label>
      <div className="flex gap-2">
        <FormField
          control={form.control}
          name="mobile.countryCode"
          render={({ field }) => (
            <FormItem className="w-28">
              <Popover open={countryCodeOpen} onOpenChange={setCountryCodeOpen}>
                <PopoverTrigger disabled={isError || isLoading} asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-gray-500",
                      )}
                    >
                      {
                        isError ? (
                          "Error"
                        ) : isLoading ? (
                          "Loading"
                        ) :
                          field.value && nationData ? (
                            <div className="flex items-center gap-2">
                              <span>{nationData.find((c) => c.code === field.value)?.flag}</span>
                              <span>{field.value}</span>
                            </div>
                          ) : (
                            "Code"
                          )}
                      <ChevronsUpDown className=" h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command >
                    <CommandInput
                      placeholder="Search country code..."
                    // className="text-white placeholder:text-gray-400"
                    />
                    <CommandList>
                      <CommandEmpty className="text-sm text-center p-2">No country code found</CommandEmpty>
                      <CommandGroup>
                        {nationData && nationData.map((country, index) => (
                          <CommandItem
                            value={`${country.name} ${country.code}`}
                            key={`${country.code}-${country.name}-${index}`}
                            onSelect={() => {
                              form.setValue("mobile.countryCode", country.name)
                              setCountryCodeOpen(false)
                            }}
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", country.code === field.value ? "opacity-100" : "opacity-0")}
                            />
                            <div className="flex items-center gap-2">
                              <span>{country.flag}</span>
                              <span>{country.code}</span>
                              <span className="">({country.name})</span>
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
        <FormField
          control={form.control}
          name="mobile.number"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                  <Input
                    placeholder="1234567890"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
