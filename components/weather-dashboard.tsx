"use client"

import { useState } from "react"
import WeatherSearch from "./weather-search"
import CurrentWeather from "./current-weather"
import WeatherHistory from "./weather-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import type { WeatherData, SavedSearch } from "@/lib/types"

export default function WeatherDashboard() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshHistory, setRefreshHistory] = useState(0)

  const handleWeatherFetched = (data: WeatherData) => {
    setCurrentWeather(data)
    setError(null)
  }

  const handleError = (message: string) => {
    setError(message)
    setCurrentWeather(null)
  }

  const handleSearchSaved = () => {
    setRefreshHistory((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <WeatherSearch
          onWeatherFetched={handleWeatherFetched}
          onError={handleError}
          onSearchSaved={handleSearchSaved}
          setLoading={setLoading}
        />

        {error && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : currentWeather ? (
          <CurrentWeather weather={currentWeather} />
        ) : null}
      </Card>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history">Search History</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <WeatherHistory
            refreshTrigger={refreshHistory}
            onSelectSearch={(search: SavedSearch) => {
              if (search.current_weather) {
                setCurrentWeather(JSON.parse(search.current_weather))
              }
            }}
          />
        </TabsContent>
        <TabsContent value="export">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Export Weather Data</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <ExportButton format="json" />
              <ExportButton format="csv" />
              <ExportButton format="xml" />
              <ExportButton format="pdf" />
              <ExportButton format="markdown" />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ExportButton({ format }: { format: string }) {
  const handleExport = async () => {
    try {
      const response = await fetch(`/api/export?format=${format}`, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error("Failed to export data")
      }

      // Handle different formats
      if (format === "pdf") {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `weather-data.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        const data = await response.text()
        const blob = new Blob([data], {
          type:
            format === "json"
              ? "application/json"
              : format === "csv"
                ? "text/csv"
                : format === "xml"
                  ? "application/xml"
                  : "text/markdown",
        })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `weather-data.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Export error:", error)
      alert("Failed to export data")
    }
  }

  return (
    <button
      onClick={handleExport}
      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded uppercase text-sm font-medium"
    >
      {format.toUpperCase()}
    </button>
  )
}
