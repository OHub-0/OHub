"use client"

import { useState } from "react"
import { Ban, Check, ChevronDown, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"


interface MultiSelectDropdownProps {
  label: string
  values: string[]
  options: string[]
  loading: boolean
  error: boolean
  onChange: (values: string[]) => void
  placeholder: string
}

export default function MultiSelectDropdown({
  label,
  values,
  options,
  loading,
  error,
  onChange,
  placeholder,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false)

  const toggleOption = (optionValue: string) => {
    const newValues = values.includes(optionValue)
      ? values.filter((v) => v !== optionValue)
      : [...values, optionValue]
    onChange(newValues)
  }

  const removeValue = (valueToRemove: string) => {
    onChange(values.filter((v) => v !== valueToRemove))
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="cursor-default" asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10 p-2"
          >
            <div className="flex flex-wrap gap-1">
              {values.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                values.map((value) => {
                  const option = options.find((opt) => opt === value)
                  return (
                    <Badge key={value} variant="secondary" className="gap-1 cursor-pointer">
                      {option || value}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeValue(value)
                        }}
                      />
                    </Badge>
                  )
                })
              )}
            </div>
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
                      <CommandItem key={data} onSelect={() => toggleOption(data)}>
                        <Check
                          className={`mr-2 h-4 w-4 ${values.includes(data) ? "opacity-100" : "opacity-0"
                            }`}
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
    </div >
  )
}
