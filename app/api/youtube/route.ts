import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get("location")

  if (!location) {
    return NextResponse.json({ message: "Location parameter is required" }, { status: 400 })
  }

  try {
    const apiKey = process.env.YOUTUBE_API_KEY || "demo_key"
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(location + " travel")}&type=video&maxResults=4&key=${apiKey}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch videos")
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("YouTube API error:", error)
    return NextResponse.json({ message: "Failed to fetch videos" }, { status: 500 })
  }
}
