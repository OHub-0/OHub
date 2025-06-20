"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, BookOpen, FileText, Building2 } from "lucide-react"

interface EmptyStateProps {
  mode: "Institution" | "Course" | "Form"
  onClearFilters: () => void
}

export default function EmptyState({ mode, onClearFilters }: EmptyStateProps) {
  const getIcon = () => {
    switch (mode) {
      case "Institution":
        return <Building2 className="h-12 w-12 text-muted-foreground" />
      case "Course":
        return <BookOpen className="h-12 w-12 text-muted-foreground" />
      case "Form":
        return <FileText className="h-12 w-12 text-muted-foreground" />
    }
  }

  const getTitle = () => {
    switch (mode) {
      case "Institution":
        return "No institutions found"
      case "Course":
        return "No courses found"
      case "Form":
        return "No forms found"
    }
  }

  const getDescription = () => {
    switch (mode) {
      case "Institution":
        return "Try adjusting your filters to find institutions that match your criteria."
      case "Course":
        return "Try adjusting your filters to find courses that match your criteria."
      case "Form":
        return "Try adjusting your filters to find forms that match your criteria."
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        {getIcon()}
        <h3 className="mt-4 text-lg font-semibold">{getTitle()}</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">{getDescription()}</p>
        <Button onClick={onClearFilters} className="mt-4" variant="outline">
          <Search className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  )
}
