"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
// import { Suspense } from "react"
import ExploreContent from "@/components/explore/explore-content"

export default function ExplorePage() {
  // create the client only once
  const [queryClient] = useState(() => new QueryClient())

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Explore</h1>
        <p className="text-muted-foreground">Discover institutions, courses, and open forms</p>
      </div>
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <ExploreContent />
      {/* </Suspense> */}
    </div>
  )
}





// "use client"

// import { useState, useEffect, useMemo } from "react"
// import Image from "next/image"
// import { useRouter, useSearchParams } from "next/navigation"
// import { useQuery, useQueryClient } from "@tanstack/react-query"
// import { Search, MapPin, Star, Users, School, Loader2, DollarSign, X } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Skeleton } from "@/components/ui/skeleton"
// import { setQueryParams, getQueryParam, getNumberQueryParam, getArrayQueryParam } from "@/lib/urlparams"
// import type { Institution } from "@/app/api/explore/route"

// // Institute types grouped by sector
// const instituteTypes = {
//   educational: [
//     "University",
//     "College",
//     "High School",
//     "Trade School",
//     "Community College",
//     "Online Learning",
//     "Graduate School",
//     "Vocational Training",
//     "K-12 School",
//     "Preschool",
//     "Language School",
//   ],
//   corporate: [
//     "Technology",
//     "Finance",
//     "Healthcare",
//     "Manufacturing",
//     "Retail",
//     "Consulting",
//     "Media",
//     "Energy",
//     "Telecommunications",
//     "Real Estate",
//     "Hospitality",
//     "Transportation",
//     "Agriculture",
//     "Construction",
//     "Pharmaceutical",
//     "Aerospace",
//     "Automotive",
//   ],
// }

// // Fetch institutions based on filters
// async function fetchInstitutions(filters: Record<string, any>) {
//   const params = new URLSearchParams()

//   Object.entries(filters).forEach(([key, value]) => {
//     if (value !== undefined && value !== null && value !== "" && value !== "All") {
//       if (Array.isArray(value) && value.length > 0) {
//         params.set(key, value.join(","))
//       } else {
//         params.set(key, String(value))
//       }
//     }
//   })

//   const response = await fetch(`/api/explore?${params.toString()}`)
//   if (!response.ok) {
//     throw new Error("Failed to fetch institutions")
//   }
//   return response.json()
// }

// // Fetch cities for a specific nation
// async function fetchCitiesByNation(nation: string) {
//   const response = await fetch("/api/explore", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ nation }),
//   })

//   if (!response.ok) {
//     throw new Error("Failed to fetch cities")
//   }

//   return response.json()
// }

// export default function ExploreSection() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const queryClient = useQueryClient()

//   // Get filter values from URL parameters
//   const searchTerm = getQueryParam(searchParams, "search")
//   const selectedType = getQueryParam(searchParams, "type", "All")
//   const selectedNation = getQueryParam(searchParams, "nation", "All")
//   const selectedCity = getQueryParam(searchParams, "city", "All")
//   const selectedCategory = getQueryParam(searchParams, "category", "All")
//   const selectedCourses = getArrayQueryParam(searchParams, "department")
//   const sortBy = getQueryParam(searchParams, "sortBy", "relevance")
//   const sortOrder = getQueryParam(searchParams, "sortOrder", "desc")
//   const currentPage = getNumberQueryParam(searchParams, "page", 1)

//   // Local state for UI
//   const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
//   const [activeSector, setActiveSector] = useState<"educational" | "corporate">(
//     instituteTypes.corporate.includes(selectedType) ? "corporate" : "educational",
//   )

//   // Add sorting options - make it multi-select
//   const sortingOptions = [
//     { value: "relevance", label: "Relevance" },
//     { value: "rating", label: "Rating" },
//     { value: "popularity", label: "Popularity" },
//     { value: "name", label: "Name" },
//     { value: "yearFounded", label: "Year (Oldest First)" },
//     { value: "priceMin", label: "Low Price" },
//     { value: "priceMax", label: "High Price" },
//   ]

//   // Debounce search term updates
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (searchTerm !== localSearchTerm) {
//         updateFilters({ search: localSearchTerm })
//       }
//     }, 500)

//     return () => clearTimeout(timer)
//   }, [localSearchTerm])

//   // Sync local state with URL params when they change externally
//   useEffect(() => {
//     setLocalSearchTerm(searchTerm)
//   }, [searchTerm])

//   // Fetch institutions based on filters
//   const { data, isLoading, isError } = useQuery({
//     queryKey: [
//       "institutions",
//       {
//         search: searchTerm,
//         type: selectedType,
//         nation: selectedNation,
//         city: selectedCity,
//         category: selectedCategory,
//         courses: selectedCourses,
//         page: currentPage,
//         sortBy,
//         sortOrder,
//       },
//     ],
//     queryFn: () =>
//       fetchInstitutions({
//         search: searchTerm,
//         type: selectedType,
//         nation: selectedNation,
//         city: selectedCity,
//         category: selectedCategory,
//         courses: selectedCourses,
//         page: currentPage,
//         sortBy,
//         sortOrder,
//       }),
//   })

//   // Fetch cities based on selected nation
//   const { data: citiesData } = useQuery({
//     queryKey: ["cities", selectedNation],
//     queryFn: () => fetchCitiesByNation(selectedNation),
//     enabled: !!selectedNation, // so only when selected nation is not null/undefined/empty will this run
//   })

//   // Extract data
//   const institutions = data?.institutions || []
//   const pagination = data?.pagination || { page: 1, totalPages: 1, totalItems: 0 }
//   const metadata = data?.metadata || {
//     nations: [],
//     cities: [],
//     categories: [],
//     types: [],
//     courses: [],
//   }

//   // Available cities based on selected nation
//   const availableCities = useMemo(() => {
//     return ["All", ...(citiesData?.cities || [])]
//   }, [citiesData])

//   // Available courses/departments based on selected type
//   const availableCourses = useMemo(() => {
//     return metadata.courses || []
//   }, [metadata.courses])

//   // Update URL and refetch data when filters change
//   const updateFilters = (newFilters: Record<string, any>) => {
//     const newParams = setQueryParams(searchParams, {
//       ...newFilters,
//       // Reset page to 1 when filters change (except when explicitly changing page)
//       ...(newFilters.page === undefined ? { page: 1 } : {}),
//     })

//     router.push(`?${newParams.toString()}`, { scroll: false })
//   }

//   // Handle filter changes
//   const handleTypeChange = (value: string) => {
//     // Determine if this is a corporate or educational type
//     // const newSector = instituteTypes.corporate.includes(value) ? "corporate" : "educational"
//     // setActiveSector(newSector)
//     updateFilters({ type: value })
//   }

//   const handleNationChange = (value: string) => {
//     // Reset city when nation changes
//     updateFilters({ nation: value, city: "All" })
//   }

//   const handleCityChange = (value: string) => {
//     updateFilters({ city: value })
//   }

//   const handleCategoryChange = (value: string) => {
//     updateFilters({ category: value })
//   }

//   const handleCourseToggle = (course: string) => {
//     const newCourses = selectedCourses.includes(course)
//       ? selectedCourses.filter((c) => c !== course)
//       : [...selectedCourses, course]

//     updateFilters({ courses: newCourses.length > 0 ? newCourses.join(",") : null })
//   }

//   const handlePageChange = (page: number) => {
//     updateFilters({ page })
//   }

//   const handleSortChange = (value: string) => {
//     updateFilters({ sortBy: value, page: 1 })
//   }

//   // const handleSortOrderChange = (value: string) => {
//   //   updateFilters({ sortOrder: value, page: 1 })
//   // }

//   // Clear all filters - remove rating, popularity, price
//   const clearAllFilters = () => {
//     updateFilters({
//       search: "",
//       type: "All",
//       nation: "All",
//       city: "All",
//       category: "All",
//       courses: null,
//       sortBy: "relevance",
//       sortOrder: "desc",
//       page: 1,
//     })
//     setLocalSearchTerm("")
//   }

//   // Count active filters - remove rating, popularity, price
//   const activeFiltersCount = [
//     searchTerm !== "",
//     selectedType !== "All",
//     selectedNation !== "All",
//     selectedCity !== "All",
//     selectedCategory !== "All",
//     selectedCourses.length > 0,
//   ].filter(Boolean).length

//   // Format price display
//   // const formatPrice = (price: number) => {
//   //   if (price >= 1000) {
//   //     return `$${(price / 1000).toFixed(1)}k`
//   //   }
//   //   return `$${price}`
//   // }

//   return (
//     <div className="max-w-7xl mx-auto p-6 space-y-8">
//       {/* Header */}
//       <div className="space-y-2">
//         <h1 className="text-4xl font-bold">Explore</h1>
//         <p className="text-muted-foreground">Discover institutions by category</p>
//       </div>

//       {/* Search and Primary Filters */}
//       <div className="space-y-4">
//         {/* Search Bar */}
//         <div className="relative max-w-md">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//           <Input
//             placeholder="Search institutions..."
//             value={localSearchTerm}
//             onChange={(e) => setLocalSearchTerm(e.target.value)}
//             className="pl-10 border-0"
//           />
//         </div>

//         {/* Sector Selection - Bigger */}
//         <div className="flex items-center gap-4 pt-5">
//           <button
//             onClick={() => setActiveSector("educational")}
//             className={`px-2 py-2 rounded-md text-sm font-medium
//               ${activeSector === "educational" ? 'bg-black text-white dark:bg-white dark:text-black' : 'border border-gray-200  dark:border-gray-800'}`}
//           >
//             Educational
//           </button>
//           <button
//             onClick={() => setActiveSector("corporate")}
//             className={`px-2 py-2 rounded-md text-sm font-medium
//               ${activeSector === "corporate" ? 'bg-black text-white dark:bg-white dark:text-black' : 'border border-gray-200 dark:border-gray-800'}`}
//           >
//             Corporate
//           </button>
//         </div>

//         {/* Institute Types Dropdown */}
//       </div>
//       <div className="flex flex-wrap items-center gap-3">
//         <Select value={selectedType} onValueChange={handleTypeChange}>
//           <SelectTrigger className="w-auto min-w-[140px]">
//             <SelectValue placeholder="Institute Type" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="All">All Types</SelectItem>
//             {instituteTypes[activeSector].map((type) => (
//               <SelectItem key={type} value={type}>
//                 {type}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         {/* Filters Row */}
//         {/* Location Filters */}
//         <Select value={selectedNation} onValueChange={handleNationChange}>
//           <SelectTrigger className="w-auto min-w-[120px]">
//             <SelectValue placeholder="Nation" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="All">All Nation</SelectItem>
//             {metadata.nations?.map((nation: string) => (
//               <SelectItem key={nation} value={nation}>
//                 {nation}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         <Select disabled={selectedNation === 'All'} value={selectedCity} onValueChange={handleCityChange}>
//           <SelectTrigger className="w-auto min-w-[120px]">
//             <SelectValue placeholder="City" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="All">All Cities</SelectItem>
//             {availableCities
//               .filter((city) => city !== "All")
//               .map((city) => (
//                 <SelectItem key={city} value={city}>
//                   {city}
//                 </SelectItem>
//               ))}
//           </SelectContent>
//         </Select>

//         <Select value={selectedCategory} onValueChange={handleCategoryChange}>
//           <SelectTrigger className="w-auto min-w-[140px]">
//             <SelectValue placeholder="Category" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="All">All Categories</SelectItem>
//             {metadata.categories?.map((category: string) => (
//               <SelectItem key={category} value={category}>
//                 {category}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         {/* Sort Dropdown */}
//         <Select value={sortBy} onValueChange={handleSortChange}>
//           <SelectTrigger className="w-auto min-w-[120px]">
//             <SelectValue placeholder="Sort by" />
//           </SelectTrigger>
//           <SelectContent>
//             {sortingOptions.map((option) => (
//               <SelectItem key={option.value} value={option.value}>
//                 {option.label}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         {/* Programs Dropdown */}
//         {availableCourses.length > 0 && (
//           <Select
//             value={selectedCourses.length === 1 ? selectedCourses[0] : selectedCourses.length > 1 ? "multiple" : ""}
//             onValueChange={(value) => {
//               if (value === "clear") {
//                 updateFilters({ courses: null })
//               } else if (value !== "multiple") {
//                 handleCourseToggle(value)
//               }
//             }}
//           >
//             <SelectTrigger className="w-auto min-w-[140px]">
//               <SelectValue
//                 placeholder={
//                   activeSector === "educational"
//                     ? "Programs"
//                     : "Services"
//                 }
//               >
//                 {selectedCourses.length === 0
//                   ? activeSector === "educational"
//                     ? "Programs"
//                     : "Services"
//                   : selectedCourses.length === 1
//                     ? selectedCourses[0]
//                     : `${selectedCourses.length} selected`}
//               </SelectValue>
//             </SelectTrigger>
//             <SelectContent>
//               {selectedCourses.length > 0 && (
//                 <>
//                   <SelectItem value="clear" className="text-red-600">
//                     Clear selection
//                   </SelectItem>
//                   <div className="border-t my-1" />
//                 </>
//               )}
//               {availableCourses.map((course: string) => (
//                 <SelectItem
//                   key={course}
//                   value={course}
//                   className={selectedCourses.includes(course) ? "bg-gray-100" : ""}
//                 >
//                   {/* <div className="flex items-center gap-2"> */}
//                   {/* <div
//                       className={`w-3 h-3 rounded-sm border ${selectedCourses.includes(course) ? "bg-black border-black" : "border-gray-300"
//                         }`}
//                     >
//                       {selectedCourses.includes(course) && (
//                         <div className="w-full h-full flex items-center justify-center">
//                           <div className="w-1.5 h-1.5 bg-white rounded-sm" />
//                         </div>
//                       )}
//                     </div> */}
//                   {course}
//                   {/* </div> */}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         )}

//         {/* Clear Filters */}
//         {activeFiltersCount > 0 && (
//           <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-gray-500 hover:text-gray-700">
//             <X className="h-4 w-4 mr-1" />
//             Clear all
//           </Button>
//         )}
//       </div>

//       {/* Results Count and Quick Jump */}
//       <div className="flex justify-between items-center py-4 border-b">
//         <div className="text-sm text-gray-600">
//           {isLoading ? (
//             <span className="flex items-center gap-2">
//               <Loader2 className="h-4 w-4 animate-spin" />
//               Loading...
//             </span>
//           ) : (
//             `${pagination.totalItems} institutions found`
//           )}
//         </div>

//         {pagination.totalPages > 1 && (
//           <div className="flex items-center gap-2 text-sm">
//             <span className="text-gray-500">Page</span>
//             <Input
//               type="number"
//               min="1"
//               max={pagination.totalPages}
//               value={pagination.page}
//               onChange={(e) => {
//                 const page = Number.parseInt(e.target.value)
//                 if (page >= 1 && page <= pagination.totalPages) {
//                   handlePageChange(page)
//                 }
//               }}
//               className="w-16 h-8 text-center border-0 bg-gray-50"
//             />
//             <span className="text-gray-500">of {pagination.totalPages}</span>
//           </div>
//         )}
//       </div>

//       {/* Institutions Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {isLoading
//           ? // Loading skeletons
//           Array.from({ length: 6 }).map((_, i) => (
//             <Card key={i} className="overflow-hidden">
//               <div className="relative h-48">
//                 <Skeleton className="h-full w-full" />
//               </div>
//               <CardHeader className="pb-2">
//                 <Skeleton className="h-6 w-3/4 mb-2" />
//                 <Skeleton className="h-4 w-1/2" />
//               </CardHeader>
//               <CardContent className="pt-0">
//                 <Skeleton className="h-4 w-2/3 mb-2" />
//                 <div className="flex justify-between">
//                   <Skeleton className="h-4 w-1/4" />
//                   <Skeleton className="h-4 w-1/4" />
//                 </div>
//               </CardContent>
//             </Card>
//           ))
//           : institutions.map((institution: Institution) => (
//             <Card key={institution.id} className="overflow-hidden hover:shadow-lg transition-shadow">
//               <div className="relative h-48">
//                 <Image
//                   src={institution.image || "/placeholder.svg"}
//                   alt={institution.name}
//                   fill
//                   className="object-cover"
//                 />
//                 <Badge className="absolute top-2 right-2 bg-white/90 text-black">{institution.type}</Badge>
//               </div>
//               <CardHeader className="pb-2">
//                 <div className="flex justify-between items-start">
//                   <h3 className="font-semibold text-lg leading-tight">{institution.name}</h3>
//                   <div className="flex items-center gap-1 text-sm">
//                     <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                     {institution.rating}
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-1 text-muted-foreground text-sm">
//                   <MapPin className="h-4 w-4" />
//                   {institution.location}
//                 </div>
//               </CardHeader>
//               <CardContent className="pt-0">
//                 <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
//                   <Users className="h-4 w-4" />
//                   {institution.students || institution.employees || "N/A"}
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <Badge variant="outline">{institution.category}</Badge>
//                   <div className="text-xs text-muted-foreground">Popularity: {institution.popularity}%</div>
//                 </div>
//                 {institution.priceRange && institution.priceRange.min > 0 && (
//                   <div className="mt-2 text-sm flex items-center gap-1">
//                     <DollarSign className="h-3 w-3" />
//                     <span>
//                       {new Intl.NumberFormat("en-US", {
//                         style: "currency",
//                         currency: institution.priceRange.currency,
//                         maximumFractionDigits: 0,
//                       }).format(institution.priceRange.min)}
//                       {" - "}
//                       {new Intl.NumberFormat("en-US", {
//                         style: "currency",
//                         currency: institution.priceRange.currency,
//                         maximumFractionDigits: 0,
//                       }).format(institution.priceRange.max)}
//                     </span>
//                   </div>
//                 )}
//                 {(institution.courses || institution.subjects || institution.programs) && (
//                   <div className="mt-2 flex flex-wrap gap-1">
//                     {(institution.courses || institution.subjects || institution.programs)
//                       ?.slice(0, 2)
//                       .map((item) => (
//                         <Badge key={item} variant="secondary" className="text-xs">
//                           {item}
//                         </Badge>
//                       ))}
//                     {/* {(institution.courses || institution.subjects || institution.programs)?.length > 2 && (
//                       <Badge variant="secondary" className="text-xs">
//                         +{(institution.courses || institution.subjects || institution.programs).length - 2} more
//                       </Badge>
//                     )} */}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           ))}
//       </div>

//       {/* Pagination */}
//       {
//         pagination.totalPages > 1 && (
//           <div className="flex items-center justify-center gap-2 py-8">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => handlePageChange(pagination.page - 1)}
//               disabled={pagination.page <= 1 || isLoading}
//             >
//               Previous
//             </Button>

//             <div className="flex items-center gap-1">
//               {(() => {
//                 const currentPage = pagination.page
//                 const totalPages = pagination.totalPages
//                 const pages = []

//                 if (currentPage > 3) {
//                   pages.push(1)
//                   if (currentPage > 4) {
//                     pages.push("...")
//                   }
//                 }

//                 for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
//                   pages.push(i)
//                 }

//                 if (currentPage < totalPages - 2) {
//                   if (currentPage < totalPages - 3) {
//                     pages.push("...")
//                   }
//                   pages.push(totalPages)
//                 }

//                 return pages.map((page, index) => {
//                   if (page === "...") {
//                     return (
//                       <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-400">
//                         ...
//                       </span>
//                     )
//                   }

//                   return (
//                     <Button
//                       key={page}
//                       variant={currentPage === page ? "default" : "ghost"}
//                       size="sm"
//                       onClick={() => handlePageChange(page as number)}
//                       disabled={isLoading}
//                       className="w-8 h-8 p-0"
//                     >
//                       {page}
//                     </Button>
//                   )
//                 })
//               })()}
//             </div>

//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => handlePageChange(pagination.page + 1)}
//               disabled={pagination.page >= pagination.totalPages || isLoading}
//             >
//               Next
//             </Button>
//           </div>
//         )
//       }

//       {
//         !isLoading && institutions.length === 0 && (
//           <div className="text-center py-12">
//             <School className="h-12 w-12 mx-auto text-gray-400 mb-4" />
//             <h3 className="text-lg font-semibold mb-2">No institutions found</h3>
//             <p className="text-gray-500">Try adjusting your filters to see more results.</p>
//           </div>
//         )
//       }
//     </div >
//   )
// }
