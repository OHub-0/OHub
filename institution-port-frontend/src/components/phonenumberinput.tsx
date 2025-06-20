"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Phone, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { countries } from "../data/countries"
import type { Control, FieldErrors } from "react-hook-form"

interface PhoneNumberInputProps {
  control: Control<any>
  errors: FieldErrors<any>
}

export function PhoneNumberInput({ control, errors }: PhoneNumberInputProps) {
  const [countryCodeOpen, setCountryCodeOpen] = useState(false)

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium ">Mobile Number *</Label>
      <div className="flex gap-2">
        <FormField
          control={control}
          name="countryCode"
          render={({ field }) => (
            <FormItem className="w-28">
              <Popover open={countryCodeOpen} onOpenChange={setCountryCodeOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-gray-400",
                      )}
                    >
                      {field.value ? (
                        <div className="flex items-center gap-2">
                          <span>{countries.find((c) => c.code === field.value)?.flag}</span>
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
                      <CommandEmpty className="">No country code found.</CommandEmpty>
                      <CommandGroup>
                        {countries.map((country, index) => (
                          <CommandItem
                            value={`${country.name} ${country.code}`}
                            key={`${country.code}-${country.name}-${index}`}
                            onSelect={() => {
                              field.onChange(country.code)
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
          control={control}
          name="phoneNumber"
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
