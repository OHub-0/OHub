"use client"

import { useState } from "react"
import { Ban, Check, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"

interface SingleSelectDropdownProps {
  label: string
  name?: string
  value?: string
  options: string[]
  loading: boolean
  error: boolean
  onChange: (value: string | undefined) => void
  placeholder: string
  disabled?: boolean
}

export default function SingleSelectDropdown({
  label,
  value,
  name,
  options,
  loading,
  error,
  onChange,
  placeholder,
  disabled = false
}: SingleSelectDropdownProps) {
  const [open, setOpen] = useState(false)

  const toggleOption = (optionValue: string) => {
    if (optionValue === value) {
      onChange(undefined)
      return
    }
    onChange(optionValue)

  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger disabled={disabled} className="cursor-pointer" asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {value || <span className="text-muted-foreground">{placeholder}</span>}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} disabled={error} />
            <CommandList>
              {loading ? (
                <div className="flex items-center justify-center py-6 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Loading...
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-6 text-muted-foreground">
                  <Ban className="w-4 h-4 mr-2" />
                  Error
                </div>
              ) : (
                <>
                  <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {options.map((data) => (
                      <CommandItem
                        className="cursor-pointer"
                        key={data}
                        onSelect={() => toggleOption(data)}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${value === data ? "opacity-100" : "opacity-0"}`}
                        />
                        {data}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {/* Expose value to HTML form / RHF */}
      {name && value !== undefined && (
        <input type="hidden" name={name} value={value} />
      )}
    </div>
  )
}


// Usage in a React Hook Form parent component:

// import { Controller, useForm, FormProvider } from "react-hook-form"
// import SelectLocation from "@/components/select-location"

// type FormData = {
//   location: {
//     nation?: string
//     city?: string
//   }
// }

// export default function MyForm() {
//   const methods = useForm<FormData>()
//   const { control, watch, setValue, handleSubmit } = methods

//   const location = watch("location")

//   return (
//     <FormProvider {...methods}>
//       <form onSubmit={handleSubmit((data) => console.log(data))}>
//         <Controller
//           control={control}
//           name="location"
//           render={({ field }) => (
//             <SelectLocation
//               nation={field.value?.nation}
//               city={field.value?.city}
//               onChange={(key, value) =>
//                 field.onChange({ ...field.value, [key]: value })
//               }
//             />
//           )}
//         />

//         <button type="submit">Submit</button>
//       </form>
//     </FormProvider>

//   )
// }