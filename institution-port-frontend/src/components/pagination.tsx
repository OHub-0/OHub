import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { useRef } from "react"

type Pagination = {
  currentPage: number
  totalPages: number
  updatePage: (newPage: number) => void
}

export default function Pagination({ currentPage, totalPages, updatePage }: Pagination) {
  const pagesRef = useRef<HTMLInputElement>(null)
  return <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => updatePage(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Page</span>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const value = pagesRef.current?.value
              const page = Number(value)
              if (!isNaN(page) && page >= 1 && page <= totalPages) {
                updatePage(page)
              }
            }}
          >
            <Input
              type="number"
              min={1}
              max={totalPages}
              defaultValue={currentPage}
              ref={pagesRef}
              className="w-16 text-center"
            />
          </form>
          <span className="text-sm text-muted-foreground">of {totalPages}</span>
        </div>

        <Button
          variant="outline"
          onClick={() => updatePage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </CardContent>
  </Card>
}