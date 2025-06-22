// "use client"

// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Label } from "@/components/ui/label"
// import { CircleX, Loader2 } from "lucide-react"

// interface FilterDropdownProps {
//   label: string
//   value?: string
//   options: string[]
//   onChange: (value: string | undefined) => void
//   placeholder: string
//   disabled?: boolean
//   loading: boolean
//   error: boolean
// }

// export default function FilterDropdown({
//   label,
//   value,
//   options,
//   onChange,
//   placeholder,
//   disabled = false,
//   loading,
//   error
// }: FilterDropdownProps) {
//   const dataError = options.length < 1
//   return (
//     <div className="space-y-2">
//       <Label className="text-sm font-medium">{label}</Label>
//       <Select
//         value={value || ""}
//         onValueChange={(val) => onChange((val === "" || val === "none") ? undefined : val)}
//         disabled={disabled || loading || error || dataError}
//       >
//         <SelectTrigger className={(disabled || loading || dataError) ? "opacity-50" : ""}>
//           <SelectValue placeholder={loading ? "Loading..." : error ? "Error" : placeholder} />
//         </SelectTrigger>

//         <SelectContent>
//           <SelectItem value="none">{label}</SelectItem>
//           {options.map((val) => (
//             <SelectItem className="cursor-pointer" key={val} value={val}>
//               {val}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </div>
//   )
// }


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
    </div>
  )
}
