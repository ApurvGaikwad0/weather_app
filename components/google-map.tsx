"use client"

import { useEffect, useRef } from "react"

interface GoogleMapProps {
  lat: number
  lon: number
  locationName: string
}

export default function GoogleMap({ lat, lon, locationName }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Google Maps API script
    const loadGoogleMapsScript = () => {
      const script = document.createElement("script")
      script.src = `/api/maps-proxy`
      script.async = true
      script.defer = true
      document.head.appendChild(script)

      script.onload = initMap
    }

    // Initialize the map
    const initMap = () => {
      if (!mapRef.current || !window.google) return

      const mapOptions = {
        center: { lat, lng: lon },
        zoom: 10,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      }

      const map = new window.google.maps.Map(mapRef.current, mapOptions)

      // Add marker for the location
      new window.google.maps.Marker({
        position: { lat, lng: lon },
        map,
        title: locationName,
        animation: window.google.maps.Animation.DROP,
      })
    }

    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      initMap()
    } else {
      loadGoogleMapsScript()
    }
  }, [lat, lon, locationName])

  return <div ref={mapRef} className="w-full h-[400px]"></div>
}
