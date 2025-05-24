import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

// GET - Fetch all searches
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (id) {
      // Fetch a specific search
      const { data, error } = await supabase.from("weather_searches").select("*").eq("id", id).single()

      if (error) throw error

      return NextResponse.json(data)
    } else {
      // Fetch all searches
      const { data, error } = await supabase
        .from("weather_searches")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      return NextResponse.json(data)
    }
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ message: "Failed to fetch searches" }, { status: 500 })
  }
}

// POST - Create a new search
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the location
    if (!body.location || body.location.trim() === "") {
      return NextResponse.json({ message: "Location is required" }, { status: 400 })
    }

    // Validate date range if provided
    if (body.startDate && body.endDate) {
      const startDate = new Date(body.startDate)
      const endDate = new Date(body.endDate)

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return NextResponse.json({ message: "Invalid date format" }, { status: 400 })
      }

      if (startDate > endDate) {
        return NextResponse.json({ message: "Start date must be before end date" }, { status: 400 })
      }
    }

    // Fetch current weather for the location to store with the search
    let currentWeather = null
    try {
      const apiKey = process.env.WEATHER_API_KEY || "demo_key"
      const weatherResponse = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(body.location)}`,
      )

      if (weatherResponse.ok) {
        currentWeather = await weatherResponse.json()
      }
    } catch (error) {
      console.error("Weather API error:", error)
      // Continue even if weather fetch fails
    }

    // Insert the search into the database
    const { data, error } = await supabase
      .from("weather_searches")
      .insert([
        {
          location: body.location,
          start_date: body.startDate || null,
          end_date: body.endDate || null,
          current_weather: currentWeather ? JSON.stringify(currentWeather) : null,
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ message: "Failed to save search" }, { status: 500 })
  }
}

// PUT - Update a search
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ message: "Search ID is required" }, { status: 400 })
    }

    const body = await request.json()

    // Validate the location
    if (!body.location || body.location.trim() === "") {
      return NextResponse.json({ message: "Location is required" }, { status: 400 })
    }

    // Validate date range if provided
    if (body.startDate && body.endDate) {
      const startDate = new Date(body.startDate)
      const endDate = new Date(body.endDate)

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return NextResponse.json({ message: "Invalid date format" }, { status: 400 })
      }

      if (startDate > endDate) {
        return NextResponse.json({ message: "Start date must be before end date" }, { status: 400 })
      }
    }

    // Update the search in the database
    const { data, error } = await supabase
      .from("weather_searches")
      .update({
        location: body.location,
        start_date: body.startDate || null,
        end_date: body.endDate || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ message: "Failed to update search" }, { status: 500 })
  }
}

// DELETE - Delete a search
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ message: "Search ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("weather_searches").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ message: "Search deleted successfully" })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ message: "Failed to delete search" }, { status: 500 })
  }
}
