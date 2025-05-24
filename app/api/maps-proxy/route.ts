import { NextResponse } from "next/server"

export async function GET() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || "demo_key"

  // Return the Google Maps API script with the API key
  return new NextResponse(
    `
    // Google Maps API Proxy
    (function() {
      window.initMap = function() {
        // Maps API is loaded and available
      };
      
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    })();
    `,
    {
      headers: {
        "Content-Type": "application/javascript",
      },
    },
  )
}
