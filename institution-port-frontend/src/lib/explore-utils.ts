export const updateFilter = (key: keyof ExploreFilters, value: any) => {
  // if (key === 'search') {
  //   debounceForSearch.current = true
  // }
  setFilters((prev) => ({
    ...prev,
    [key]: value,
    // Reset page to 1 when filters change (except when changing page)
    ...(key !== "page" && { page: 1 }),
    // Reset city when nation changes
    ...(key === "nation" && { city: undefined }),
    // Reset examType when form type changes away from entrance
    ...(key === "type" && filters.mode === "form" && value !== "entrance" && { deliveryMode: undefined }),
  }))
}