import WeatherDashboard from "@/components/weather-dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">Weather Explorer</h1>
        <WeatherDashboard />
      </div>
    </main>
  )
}
