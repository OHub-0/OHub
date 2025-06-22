import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useDebounce } from "@/utils/basic-utils";
import { useEffect, useState } from "react";

export default function SearchBar(
  { initialSearch, filter, delay }:
    { initialSearch: string | undefined, filter: (value: string | undefined) => void, delay: number }
) {
  const [searchInput, setSearchInput] = useState(initialSearch || "")
  const debouncedSearch = useDebounce(searchInput, delay)
  useEffect(() => {
    filter(debouncedSearch || undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  return <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder={`Search`}
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      className="pl-10"
    />
  </div>
}