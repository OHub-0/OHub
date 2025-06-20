"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, MapPin, Clock, Calendar } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { link } from "fs"
import Link from "next/link"

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

interface ResultCardProps {
  result: ExploreResult
  mode: "Institution" | "Course" | "Form"
}

export default function ResultCard({ result, mode }: ResultCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const getIcon = () => {
    switch (mode) {
      case "Institution":
        return <MapPin className="h-4 w-4" />
      case "Course":
        return <Clock className="h-4 w-4" />
      case "Form":
        return <Calendar className="h-4 w-4" />
    }
  }

  const getMetadataDisplay = () => {
    switch (mode) {
      case "Institution":
        return (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {result.metadata.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {result.metadata.location}
              </span>
            )}
            {result.metadata.established && <span>Est. {result.metadata.established}</span>}
          </div>
        )
      case "Course":
        return (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {result.metadata.duration && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {result.metadata.duration}
              </span>
            )}
            {result.metadata.fee && <span>${result.metadata.fee}</span>}
            {result.metadata.deliveryMode && <span className="capitalize">{result.metadata.deliveryMode}</span>}
          </div>
        )
      case "Form":
        return (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {result.metadata.deadline && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Deadline: {result.metadata.deadline}
              </span>
            )}
            {result.metadata.fee && <span>Fee: ${result.metadata.fee}</span>}
          </div>
        )
    }
  }

  return (
    <Link href={result.link}>
      <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
        {/* Background Image for Institutions */}
        {mode === "Institution" && result.image && (
          <div className="relative h-48 overflow-hidden">
            {!imageLoaded && !imageError && <div className="absolute inset-0 bg-muted animate-pulse" />}
            {!imageError && (
              <img
                src={result.image || "/hero3.jpg"}
                alt={result.title}
                // blurDataURL="/images/hero1.jpg" // Optional tiny version
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                loading="lazy"

              />
            )}
            {imageError && (
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <div className="text-muted-foreground text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Image unavailable</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white font-semibold text-lg line-clamp-2">{result.title}</h3>
              {result.subtitle && <p className="text-white/80 text-sm">{result.subtitle}</p>}
            </div>
          </div>
        )}

        <CardHeader className={mode === "Institution" && result.image ? "p-3 pb-0" : "pb-3"}>
          {mode !== "Institution" && (
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getIcon()}
                <CardTitle className="text-lg line-clamp-2">{result.title}</CardTitle>
              </div>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          )}
          {mode !== "Institution" && result.subtitle && (
            <p className="text-sm text-muted-foreground">{result.subtitle}</p>
          )}
          {mode === "Institution" && result.image && (
            <div className="flex justify-end">
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm line-clamp-3">{result.description}</p>

          {getMetadataDisplay()}

          <div className="flex flex-wrap gap-2">
            {result.badges.map((badge, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
