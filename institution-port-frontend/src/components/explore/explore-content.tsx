"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, Search, Filter, X } from "lucide-react"
import FilterDropdown from "@/components/single-select-dropdown"
import MultiSelectDropdown from "@/components/multi-select-dropdown"
import ResultCard from "@/components/explore/result-card"
import EmptyState from "@/components/explore/empty-state"
import { Label } from "@/components/ui/label"
import SearchBar from "./search-bar"
import { setQueryParams } from "@/utils/basic-utils"
import Pagination from "../pagination"
import { useCityQuery, useNationQuery } from "@/lib/queries/nation-city"
import { fetchExploreData, useExploreFilterQuery, useExploreQuery } from "@/lib/queries/explore"

export type ExploreMode = "Institution" | "Course" | "Form"

type NationApiRes = {
  name: string
}

export interface ExploreFilters {
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

export interface ExploreResult {
  id: string
  title: string
  subtitle?: string
  description: string
  isFollowing?: boolean
  link: string
  image?: string
  badges: string[]
  metadata: Record<string, any>
}

export interface ExploreResponse {
  results: ExploreResult[]
  totalPages: number
  currentPage: number
  total: number
}

const Modes = ["Institution", "Course", "Form"]
const DeliveryModes = ["Offline", "Online"]




export default function ExploreContent() {
  const router = useRouter()
  const queryClient = useQueryClient()
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
  const { data: nations = [], isLoading: nationIsPending, isError: nationIsError } = useNationQuery({ code: "false", flag: "false" })
  // Fetch cities based on selected nation
  const { data: cities = [], isLoading: citiesIsPending, isError: citiesIsError } = useCityQuery(filters.nation)
  // Fetch mode-specific filters
  const { data: modeFilters, isLoading: filterIsPending, isError: filterIsError } = useExploreFilterQuery(filters.mode)

  // Fetch explore results
  const { data: exploreData, isLoading, error } = useExploreQuery(filters)


  useEffect(() => {
    // Update URL when filters change
    const params = setQueryParams(filters)
    router.push(`/explore?${params.toString()}`, { scroll: false })
    // prefetching next page
    if (exploreData && exploreData.currentPage < exploreData.totalPages) {
      const nextPageFilters = structuredClone({ ...filters, page: filters.page + 1 })
      queryClient.prefetchQuery({
        queryKey: ["explore", nextPageFilters],
        queryFn: () => fetchExploreData(nextPageFilters),

      });
    }
  }, [filters, router, queryClient, exploreData])



  const updateFilter = (key: keyof ExploreFilters, value: any) => {
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
      sortBy: [],
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
                <SelectTrigger>
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                  {Modes.map((item) => <SelectItem className="cursor-pointer" key={item} value={item}>{item}</SelectItem>)}
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
                options={DeliveryModes}
                onChange={(value) => updateFilter("deliveryMode", value)}
                placeholder="Select mode"
              />
            )}


            {/* Nation Filter */}
            <FilterDropdown
              label="Nation"
              value={filters.nation}
              options={nations as string[] ?? []}
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
                <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => updateFilter("search", undefined)}>
                  Search: {filters.search}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {filters.deliveryMode && (
                <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => updateFilter("deliveryMode", undefined)}>
                  Mode: {filters.deliveryMode}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {filters.nation && (
                <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => updateFilter("nation", undefined)}>
                  Nation: {(nations as string[]).find((n) => n === filters.nation)}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {filters.city && (
                <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => updateFilter("city", undefined)}>
                  City: {cities.find((c) => c === filters.city)}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {filters.type && (
                <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => updateFilter("type", undefined)}>
                  Type: {filters.type}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {filters.duration && (
                <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => updateFilter("duration", undefined)}>
                  Duration: {filters.duration}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {filters.deadline && (
                <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => updateFilter("deadline", undefined)}>
                  Deadline: {filters.deadline}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {filters.programs?.map((program) => (
                <Badge key={program} variant="secondary" className="gap-1 cursor-pointer"
                  onClick={() =>
                    updateFilter(
                      "programs",
                      filters.programs?.filter((p) => p !== program),
                    )
                  }>
                  {program}
                  <X
                    className="h-3 w-3"
                  />
                </Badge>
              ))}
              {filters.sortBy?.map((sort) => (
                <Badge key={sort} variant="secondary" className="gap-1 cursor-pointer"
                  onClick={() =>
                    updateFilter(
                      "sortBy",
                      filters.sortBy?.filter((p) => p !== sort),
                    )
                  }>
                  SortBy: {sort}
                  <X
                    className="h-3 w-3"
                  />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>





      {/* Results Section*/}

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
              <p className="text-red-500">Failed to load results. Please try again.</p>
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
              <ResultCard key={result.id} result={result} filter={filters} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {exploreData &&
          <Pagination
            currentPage={filters.page}
            totalPages={exploreData.totalPages}
            updatePage={(newPage: number) => updateFilter("page", newPage)}
          />}
      </div>
    </div>
  )
}
