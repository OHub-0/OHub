import { useEffect, useState } from "react"
import { useCityQuery, useNationQuery } from "@/lib/queries/use-nation-city"
import SingleSelectDropdown from "@/components/single-select-dropdown"

export type SelectLocationProps = {
  namePrefix?: string // for RHF e.g., "location"
  nation?: string
  city?: string
  onChange?: (field: "nation" | "city", value: string | undefined) => void
  disabled?: boolean
  useFormMode?: boolean
}

export default function SelectLocation({
  namePrefix = "location",
  nation = undefined,
  city = undefined,
  onChange,
  disabled = false,
  useFormMode = false,
}: SelectLocationProps) {


  // Whenever parent changes value, sync local state
  const { data: nations = [], isLoading: nationIsPending, isError: nationIsError } = useNationQuery({ code: "false", flag: "false" })
  const { data: cities = [], isLoading: citiesIsPending, isError: citiesIsError } = useCityQuery(nation)

  // Queries

  const handleNationChange = (value: string | undefined) => {
    onChange?.("nation", value)
    onChange?.("city", undefined)
  }

  const handleCityChange = (value: string | undefined) => {
    onChange?.("city", value)
  }

  return (
    <>
      <SingleSelectDropdown
        label="Nation"
        name={useFormMode ? `${namePrefix}.nation` : undefined}
        value={nation}
        options={nations as string[]}
        loading={nationIsPending}
        error={nationIsError}
        onChange={handleNationChange}
        placeholder="Select nation"
        disabled={disabled}
      />

      <SingleSelectDropdown
        label="City"
        name={useFormMode ? `${namePrefix}.city` : undefined}
        value={city}
        options={cities}
        loading={citiesIsPending}
        error={citiesIsError}
        onChange={handleCityChange}
        placeholder="Select city"
        disabled={disabled || !nation}
      />
    </>

  )
}