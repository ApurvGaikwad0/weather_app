import { NextResponse } from "next/server"
import type { WeatherData } from "@/lib/types"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get("location")

  if (!location) {
    return NextResponse.json({ message: "Location parameter is required" }, { status: 400 })
  }

  try {
    // Using WeatherAPI.com for weather data
    const apiKey = "979c19e958094819b47150951252405" // Use your API key here
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&days=3&aqi=no&alerts=no`

    const response = await fetch(url)

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { message: errorData.error?.message || "Failed to fetch weather data" },
        { status: response.status },
      )
    }

    const data: WeatherData = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ message: "Failed to fetch weather data" }, { status: 500 })
  }
}
