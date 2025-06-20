"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, Search, Filter, X } from "lucide-react"
import FilterDropdown from "@/components/explore/filter-dropdown"
import MultiSelectDropdown from "@/components/explore/multi-selector-dropdown"
import ResultCard from "@/components/explore/result-card"
import EmptyState from "@/components/explore/empty-state"
import { Label } from "@/components/ui/label"
import { useDebounce } from "@/lib/utils"
import SearchBar from "./search-bar"

type ExploreMode = "Institution" | "Course" | "Form"

type NationApiRes = {
  name: string
}

interface ExploreFilters {
  mode: ExploreMode
  search?: string
  nation?: string
  city?: string
  type?: string
  duration?: string
  deadline?: string
  programs?: string[]
  sortBy?: string[]
  deliveryMode?: string // for courses: Online/Offline
  page: number
}

interface ExploreResult {
  id: string
  title: string
  subtitle?: string
  description: string
  link: string
  image?: string
  badges: string[]
  metadata: Record<string, any>
}

interface ExploreResponse {
  results: ExploreResult[]
  totalPages: number
  currentPage: number
  total: number
}



export default function ExploreContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<ExploreFilters>({
    mode: (searchParams.get("mode") as ExploreMode) || "Institution",
    search: searchParams.get("search") || undefined,
    nation: searchParams.get("nation") || undefined,
    city: searchParams.get("city") || undefined,
    type: searchParams.get("type") || undefined,
    duration: searchParams.get("duration") || undefined,
    deadline: searchParams.get("deadline") || undefined,
    programs: searchParams.get("programs")?.split(",").filter(Boolean) || [],
    sortBy: searchParams.get("sortBy")?.split(",").filter(Boolean) || [],
    deliveryMode: searchParams.get("deliveryMode") || undefined,
    page: Number.parseInt(searchParams.get("page") || "1"),
  })




  // Fetch nations
  const { data: nations = [], isLoading: nationIsPending, isError: nationIsError } = useQuery<string[]>({
    queryKey: ["nations"],
    queryFn: async () => {
      const response = await fetch("/api/nations")
      const data = await response.json()
      return data.map((i: NationApiRes) => i.name)
    },
  })

  // Fetch cities based on selected nation
  const { data: cities = [], isLoading: citiesIsPending, isError: citiesIsError } = useQuery<string[]>({
    queryKey: ["cities", filters.nation],
    queryFn: async () => {
      if (!filters.nation) return []
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: filters.nation
        }),
      })
      const { data } = await response.json()
      return data
    },
    enabled: !!filters.nation,
  })

  // Fetch mode-specific filters
  const { data: modeFilters, isLoading: filterIsPending, isError: filterIsError } = useQuery({
    queryKey: ["filters", filters.mode],
    queryFn: async () => {
      const response = await fetch(`/api/filters/${filters.mode.toLowerCase()}`)
      return response.json()
    },
  })

  // Fetch explore results
  const {
    data: exploreData,
    isLoading,
    error,
  } = useQuery<ExploreResponse>({
    queryKey: ["explore", filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && value !== null) {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              params.set(key, value.join(","))
            }
          } else {
            params.set(key, value.toString())
          }
        }
      })

      const response = await fetch(`/api/explore?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch data")
      return response.json()
    },

  })

  // Update URL when filters change
  useEffect(() => {

    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params.set(key, value.join(","))
          }
        } else {
          params.set(key, value.toString())
        }
      }
    })

    router.push(`/explore?${params.toString()}`, { scroll: false })
    // refetch()
  }, [filters, router])

  const updateFilter = (key: keyof ExploreFilters, value: any) => {
    // if (key === 'search') {
    //   debounceForSearch.current = true
    // }
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset page to 1 when filters change (except when changing page)
      ...(key === "mode" && {
        search: searchParams.get("search") || undefined,
        nation: searchParams.get("nation") || undefined,
        city: searchParams.get("city") || undefined,
        type: undefined,
        duration: undefined,
        deadline: undefined,
        programs: [],
        sortBy: [],
        deliveryMode: undefined,
      }),
      ...(key !== "page" && { page: 1 }),
      // Reset city when nation changes
      ...(key === "nation" && { city: undefined }),
      // Reset deliverymode when form type changes away from entrance
      ...(key === "type" && filters.mode === "Form" && value !== "Entrance Exam" && { deliveryMode: undefined }),
      // reset nation and city when delivery mode changes
      ...(key === "deliveryMode" && value === "Online" && { nation: undefined, city: undefined })
    }))
  }

  const clearFilters = () => {
    setFilters({
      mode: filters.mode,
      page: 1,
      search: undefined,
      nation: undefined,
      city: undefined,
      type: undefined,
      duration: undefined,
      deadline: undefined,
      programs: [],
      sortBy: undefined,
      deliveryMode: undefined,
    })
  }

  const hasActiveFilters =
    filters.search ||
    filters.nation ||
    filters.city ||
    filters.type ||
    filters.duration ||
    filters.deadline ||
    (filters.programs && filters.programs.length > 0) ||
    (filters.sortBy && filters.sortBy.length > 0) ||
    filters.deliveryMode;

  const isLocationDisabled = filters.deliveryMode === "Online"


  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filters
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selector and Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Explore Mode</Label>
              <Select value={filters.mode} onValueChange={(value: ExploreMode) => updateFilter("mode", value)}>
                <SelectTrigger className={filterIsError ? "opacity-50" : ""}>
                  <SelectValue placeholder={filterIsError ? "Error" : "Select Mode"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Institution">Institutions</SelectItem>
                  <SelectItem value="Course">Courses</SelectItem>
                  <SelectItem value="Form">Forms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Search</Label>
              <SearchBar
                initialSearch={filters.search}
                filter={(search) => updateFilter("search", search)}
                delay={400} />
            </div>
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Course Delivery Mode */}
            {(filters.mode === "Course" || (filters.mode === "Form" && filters.type === "Entrance Exam")) && (
              <FilterDropdown
                label="Delivery Mode"
                value={filters.deliveryMode}
                loading={filterIsPending}
                error={filterIsError}
                options={["Offline", "Online"]}
                onChange={(value) => updateFilter("deliveryMode", value)}
                placeholder="Select mode"
              />
            )}


            {/* Nation Filter */}
            <FilterDropdown
              label="Nation"
              value={filters.nation}
              options={nations ?? []}
              loading={nationIsPending}
              error={nationIsError}
              onChange={(value) => updateFilter("nation", value)}
              placeholder="Select nation"
              disabled={isLocationDisabled}
            />

            {/* City Filter */}
            <FilterDropdown
              label="City"
              value={filters.city}
              options={cities ?? []}
              loading={citiesIsPending}
              error={citiesIsError}
              onChange={(value) => updateFilter("city", value)}
              placeholder="Select city"
              disabled={!filters.nation || isLocationDisabled}
            />

            {/* Mode-specific filters */}
            {filters.mode === "Institution" && (
              <FilterDropdown
                label="Type"
                value={filters.type}
                loading={filterIsPending}
                error={filterIsError}
                options={modeFilters?.types || []}
                onChange={(value) => updateFilter("type", value)}
                placeholder="Institution type"
              />
            )}

            {filters.mode === "Course" && (
              <>
                <FilterDropdown
                  label="Duration"
                  value={filters.duration}
                  loading={filterIsPending}
                  error={filterIsError}
                  options={modeFilters?.durations || []}
                  onChange={(value) => updateFilter("duration", value)}
                  placeholder="Course duration"
                />
                <MultiSelectDropdown
                  label="Programs"
                  values={filters.programs || []}
                  loading={filterIsPending}
                  error={filterIsError}
                  options={modeFilters?.programs || []}
                  onChange={(values) => updateFilter("programs", values)}
                  placeholder="Select programs"
                />
              </>
            )}

            {filters.mode === "Form" && (
              <>
                <FilterDropdown
                  label="Type"
                  value={filters.type}
                  options={modeFilters?.types || []}
                  loading={filterIsPending}
                  error={filterIsError}
                  onChange={(value) => updateFilter("type", value)}
                  placeholder="Form type"
                />
                <FilterDropdown
                  label="Deadline"
                  value={filters.deadline}
                  loading={filterIsPending}
                  error={filterIsError}
                  options={modeFilters?.deadlines || []}
                  onChange={(value) => updateFilter("deadline", value)}
                  placeholder="Deadline status"
                />
              </>
            )}

            {/* Sort By */}
            <MultiSelectDropdown
              label="Sort By"
              values={filters.sortBy || []}
              options={modeFilters?.sortBy || []}
              loading={filterIsPending}
              error={filterIsError}
              onChange={(value) => updateFilter("sortBy", value)}
              placeholder="Sort by"
            />
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              {filters.search && (
                <Badge variant="secondary" className="gap-1">
                  Search: {filters.search}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("search", undefined)} />
                </Badge>
              )}
              {filters.deliveryMode && (
                <Badge variant="secondary" className="gap-1">
                  Mode: {filters.deliveryMode}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("deliveryMode", undefined)} />
                </Badge>
              )}
              {filters.nation && (
                <Badge variant="secondary" className="gap-1">
                  Nation: {nations.find((n) => n === filters.nation)}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("nation", undefined)} />
                </Badge>
              )}
              {filters.city && (
                <Badge variant="secondary" className="gap-1">
                  City: {cities.find((c) => c === filters.city)}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("city", undefined)} />
                </Badge>
              )}
              {filters.type && (
                <Badge variant="secondary" className="gap-1">
                  Type: {filters.type}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("type", undefined)} />
                </Badge>
              )}
              {filters.duration && (
                <Badge variant="secondary" className="gap-1">
                  Duration: {filters.duration}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("duration", undefined)} />
                </Badge>
              )}
              {filters.deadline && (
                <Badge variant="secondary" className="gap-1">
                  Deadline: {filters.deadline}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("deadline", undefined)} />
                </Badge>
              )}
              {filters.programs?.map((program) => (
                <Badge key={program} variant="secondary" className="gap-1">
                  {program}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() =>
                      updateFilter(
                        "programs",
                        filters.programs?.filter((p) => p !== program),
                      )
                    }
                  />
                </Badge>
              ))}
              {filters.sortBy?.map((sort) => (
                <Badge key={sort} variant="secondary" className="gap-1">
                  {sort}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() =>
                      updateFilter(
                        "sortBy",
                        filters.sortBy?.filter((p) => p !== sort),
                      )
                    }
                  />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {/* Results Header */}
        {exploreData && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {exploreData.results.length} of {exploreData.total} results
            </p>
            <p className="text-sm text-muted-foreground">
              Page {exploreData.currentPage} of {exploreData.totalPages}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-4" />
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-destructive">Failed to load results. Please try again.</p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {exploreData && exploreData.results.length === 0 && (
          <EmptyState mode={filters.mode} onClearFilters={clearFilters} />
        )}

        {/* Results Grid */}
        {exploreData && exploreData.results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exploreData.results.map((result) => (
              <ResultCard key={result.id} result={result} mode={filters.mode} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {exploreData && exploreData.totalPages > 1 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => updateFilter("page", Math.max(1, filters.page - 1))}
                  disabled={filters.page <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Page</span>
                  <Input
                    type="number"
                    min={1}
                    max={exploreData.totalPages}
                    value={filters.page}
                    onChange={(e) => {
                      const page = Number.parseInt(e.target.value)
                      if (page >= 1 && page <= exploreData.totalPages) {
                        updateFilter("page", page)
                      }
                    }}
                    className="w-16 text-center"
                  />
                  <span className="text-sm text-muted-foreground">of {exploreData.totalPages}</span>
                </div>

                <Button
                  variant="outline"
                  onClick={() => updateFilter("page", Math.min(exploreData.totalPages, filters.page + 1))}
                  disabled={filters.page >= exploreData.totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
