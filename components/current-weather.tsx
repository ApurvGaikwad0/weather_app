"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { WeatherData } from "@/lib/types"
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer } from "lucide-react"
import YouTubeVideos from "./youtube-videos"
import GoogleMap from "./google-map"

interface CurrentWeatherProps {
  weather: WeatherData
}

export default function CurrentWeather({ weather }: CurrentWeatherProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
      return <CloudRain className="h-12 w-12 text-blue-500" />
    } else if (conditionLower.includes("cloud")) {
      return <Cloud className="h-12 w-12 text-gray-500" />
    } else if (conditionLower.includes("clear") || conditionLower.includes("sun")) {
      return <Sun className="h-12 w-12 text-yellow-500" />
    } else {
      return <Cloud className="h-12 w-12 text-gray-500" />
    }
  }

  return (
    <div className="mt-6 space-y-6">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{weather.location.name}</h2>
              <p className="text-blue-100">{weather.location.country}</p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              {getWeatherIcon(weather.current.condition.text)}
              <div className="ml-4">
                <div className="text-4xl font-bold">{weather.current.temp_c}°C</div>
                <div className="text-blue-100">{weather.current.condition.text}</div>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <WeatherDetail
              icon={<Thermometer className="h-5 w-5 text-orange-500" />}
              label="Feels Like"
              value={`${weather.current.feelslike_c}°C`}
            />
            <WeatherDetail
              icon={<Wind className="h-5 w-5 text-blue-500" />}
              label="Wind"
              value={`${weather.current.wind_kph} km/h`}
            />
            <WeatherDetail
              icon={<Droplets className="h-5 w-5 text-blue-500" />}
              label="Humidity"
              value={`${weather.current.humidity}%`}
            />
            <WeatherDetail
              icon={<Cloud className="h-5 w-5 text-gray-500" />}
              label="Cloud Cover"
              value={`${weather.current.cloud}%`}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="map">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map">Map</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>
        <TabsContent value="map">
          <Card>
            <CardContent className="p-0">
              <GoogleMap lat={weather.location.lat} lon={weather.location.lon} locationName={weather.location.name} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="videos">
          <Card>
            <CardContent className="p-6">
              <YouTubeVideos locationName={weather.location.name} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface WeatherDetailProps {
  icon: React.ReactNode
  label: string
  value: string
}

function WeatherDetail({ icon, label, value }: WeatherDetailProps) {
  return (
    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      {icon}
      <div className="ml-3">
        <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  )
}
