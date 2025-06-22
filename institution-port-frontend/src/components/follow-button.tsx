"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useFollow, useUnfollow } from "@/lib/queries/follow"
import { ExploreFilters } from "./explore/explore-content"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

interface FollowButtonProps {
  idToFollow: string
  isFollowing: boolean
  filter: ExploreFilters
}

export default function FollowButton({ idToFollow, isFollowing, filter }: FollowButtonProps) {
  // const queryClient = useQueryClient()
  const followMutation = useFollow()
  const unfollowMutation = useUnfollow()

  const handleToggleFollow = () => {
    if (isFollowing) {
      unfollowMutation.mutate({ followId: idToFollow, follow: false, filter: filter })
    } else {
      followMutation.mutate({ followId: idToFollow, follow: true, filter: filter })
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={handleToggleFollow}>
            <Heart
              className={`h-4 w-4 transition-colors ${isFollowing ? "fill-red-500 text-red-500" : "text-gray-500"
                }`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{isFollowing ? "Unfollow" : "Follow"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
