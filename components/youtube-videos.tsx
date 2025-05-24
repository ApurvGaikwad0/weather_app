"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface YouTubeVideosProps {
  locationName: string
}

interface Video {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    description: string
    thumbnails: {
      medium: {
        url: string
      }
    }
  }
}

export default function YouTubeVideos({ locationName }: YouTubeVideosProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/youtube?location=${encodeURIComponent(locationName)}`)

        if (!response.ok) {
          throw new Error("Failed to fetch videos")
        }

        const data = await response.json()
        setVideos(data.items || [])
      } catch (error) {
        console.error("YouTube API error:", error)
        setError("Failed to load videos")
      } finally {
        setLoading(false)
      }
    }

    if (locationName) {
      fetchVideos()
    }
  }, [locationName])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">No videos found for this location.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {videos.slice(0, 4).map((video) => (
        <Card key={video.id.videoId} className="overflow-hidden">
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${video.id.videoId}`}
              title={video.snippet.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="p-4">
            <h3 className="font-medium text-sm line-clamp-2">{video.snippet.title}</h3>
          </div>
        </Card>
      ))}
    </div>
  )
}
