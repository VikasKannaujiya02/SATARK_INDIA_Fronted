"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for default marker icons in Leaflet with Next.js
useEffect(() => {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  })
}, [])

const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629] // India Center

const FRAUD_SPOTS = [
  { lat: 23.9634, lng: 86.8025, name: "Jamtara", risk: "high" },
  { lat: 28.1022, lng: 77.0014, name: "Nuh", risk: "high" },
  { lat: 27.8974, lng: 77.0266, name: "Mewat", risk: "medium" },
  { lat: 26.8467, lng: 77.5385, name: "Bharatpur", risk: "medium" },
]

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

interface MapPoint {
  lat: number
  lng: number
  label?: string
  risk?: "high" | "medium" | "low"
}

export function FraudMap({ points = [] }: { points?: MapPoint[] }) {
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [zoom, setZoom] = useState(4)

  useEffect(() => {
    if (points && points.length > 0) {
      const firstPoint = points[0]
      if (firstPoint.lat && firstPoint.lng) {
        setCenter([firstPoint.lat, firstPoint.lng])
        setZoom(10)
      }
    }
  }, [points])

  return (
    <div className="w-full h-40 rounded-xl overflow-hidden border border-border [&_.leaflet-container]:rounded-xl">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Static known hotspots */}
        {FRAUD_SPOTS.map((spot) => (
          <CircleMarker
            key={spot.name}
            center={[spot.lat, spot.lng]}
            radius={spot.risk === "high" ? 8 : 6}
            pathOptions={{
              color: spot.risk === "high" ? "#ef4444" : "#eab308",
              fillColor: spot.risk === "high" ? "#ef4444" : "#eab308",
              fillOpacity: 0.7,
              weight: 1,
            }}
          >
            <Popup>{spot.name} - High Risk Zone</Popup>
          </CircleMarker>
        ))}

        {/* Dynamic points from scan */}
        {points.map((point, idx) => (
          <CircleMarker
            key={`point-${idx}`}
            center={[point.lat, point.lng]}
            radius={10}
            pathOptions={{
              color: "#00B0FF",
              fillColor: "#00B0FF",
              fillOpacity: 0.9,
              weight: 2,
            }}
          >
            <Popup>{point.label || "Scanned Target Location"}</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
