"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CircleX, Loader2 } from "lucide-react"

interface FilterDropdownProps {
  label: string
  value?: string
  options: string[]
  onChange: (value: string | undefined) => void
  placeholder: string
  disabled?: boolean
  loading: boolean
  error: boolean
}

export default function FilterDropdown({
  label,
  value,
  options,
  onChange,
  placeholder,
  disabled = false,
  loading,
  error
}: FilterDropdownProps) {
  const dataError = options.length < 1
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Select
        value={value || ""}
        onValueChange={(val) => onChange((val === "" || val === "none") ? undefined : val)}
        disabled={disabled || loading || error || dataError}
      >
        <SelectTrigger className={(disabled || loading || dataError) ? "opacity-50" : ""}>
          <SelectValue placeholder={loading ? "Loading..." : error ? "Error" : placeholder} />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="none">{label}</SelectItem>
          {options.map((val) => (
            <SelectItem key={val} value={val}>
              {val}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
