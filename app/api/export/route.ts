import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Parser } from "json2csv"
import { create } from "xmlbuilder2"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "json"

    // Fetch all searches from the database
    const { data, error } = await supabase
      .from("weather_searches")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    if (!data || data.length === 0) {
      return NextResponse.json({ message: "No data to export" }, { status: 404 })
    }

    // Format the data based on the requested format
    switch (format.toLowerCase()) {
      case "json":
        return NextResponse.json(data, {
          headers: {
            "Content-Disposition": 'attachment; filename="weather-data.json"',
          },
        })

      case "csv":
        const parser = new Parser({
          fields: ["id", "location", "start_date", "end_date", "created_at", "updated_at"],
        })
        const csv = parser.parse(data)

        return new NextResponse(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": 'attachment; filename="weather-data.csv"',
          },
        })

      case "xml":
        const root = create({ version: "1.0", encoding: "UTF-8" }).ele("weather-searches")

        data.forEach((item) => {
          const searchElem = root.ele("search")
          Object.entries(item).forEach(([key, value]) => {
            if (value !== null) {
              searchElem.ele(key).txt(String(value))
            } else {
              searchElem.ele(key)
            }
          })
        })

        const xml = root.end({ prettyPrint: true })

        return new NextResponse(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Content-Disposition": 'attachment; filename="weather-data.xml"',
          },
        })

      case "markdown":
        let markdown = "# Weather Search History\n\n"

        data.forEach((item) => {
          markdown += `## Search ID: ${item.id}\n\n`
          markdown += `- **Location:** ${item.location}\n`
          markdown += item.start_date ? `- **Start Date:** ${new Date(item.start_date).toLocaleDateString()}\n` : ""
          markdown += item.end_date ? `- **End Date:** ${new Date(item.end_date).toLocaleDateString()}\n` : ""
          markdown += `- **Created:** ${new Date(item.created_at).toLocaleString()}\n`
          markdown += `- **Updated:** ${new Date(item.updated_at).toLocaleString()}\n\n`

          if (item.current_weather) {
            try {
              const weather = JSON.parse(item.current_weather)
              markdown += `### Current Weather\n\n`
              markdown += `- **Temperature:** ${weather.current.temp_c}°C / ${weather.current.temp_f}°F\n`
              markdown += `- **Condition:** ${weather.current.condition.text}\n`
              markdown += `- **Humidity:** ${weather.current.humidity}%\n`
              markdown += `- **Wind:** ${weather.current.wind_kph} km/h\n\n`
            } catch (e) {
              // Skip weather data if it can't be parsed
            }
          }

          markdown += "---\n\n"
        })

        return new NextResponse(markdown, {
          headers: {
            "Content-Type": "text/markdown",
            "Content-Disposition": 'attachment; filename="weather-data.md"',
          },
        })

      case "pdf":
        // For PDF, we'd typically use a library like PDFKit or jsPDF
        // Since those require more complex setup, we'll return a simple error for this example
        return NextResponse.json({ message: "PDF export requires additional libraries" }, { status: 501 })

      default:
        return NextResponse.json({ message: "Unsupported export format" }, { status: 400 })
    }
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ message: "Failed to export data" }, { status: 500 })
  }
}
