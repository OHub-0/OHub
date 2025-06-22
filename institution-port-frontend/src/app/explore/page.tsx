"use client"

// import { Suspense } from "react"
import ExploreContent from "@/components/explore/explore-content"

export default function Explore() {

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Explore</h1>
        <p className="text-muted-foreground">Discover institutions, courses, and open forms</p>
      </div>
      <ExploreContent />
    </div>
  )
}



