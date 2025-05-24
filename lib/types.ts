export interface WeatherData {
  location: {
    name: string
    region: string
    country: string
    lat: number
    lon: number
    localtime: string
  }
  current: {
    temp_c: number
    temp_f: number
    condition: {
      text: string
      icon: string
      code: number
    }
    wind_kph: number
    wind_mph: number
    humidity: number
    cloud: number
    feelslike_c: number
    feelslike_f: number
    uv: number
  }
  forecast?: {
    forecastday: Array<{
      date: string
      day: {
        maxtemp_c: number
        mintemp_c: number
        condition: {
          text: string
          icon: string
        }
      }
    }>
  }
}

export interface SavedSearch {
  id: number
  location: string
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
  current_weather: string | null
}
