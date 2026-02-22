"use client"

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

const FRAUD_SPOTS = [
  { lat: 23.9634, lng: 86.8025, name: "Jamtara", risk: "high" },
  { lat: 28.1022, lng: 77.0014, name: "Nuh", risk: "high" },
  { lat: 27.8974, lng: 77.0266, name: "Mewat", risk: "medium" },
  { lat: 26.8467, lng: 77.5385, name: "Bharatpur", risk: "medium" },
]

export function FraudMap() {
  return (
    <div className="w-full h-40 rounded-xl overflow-hidden border border-border [&_.leaflet-container]:rounded-xl">
      <MapContainer
        center={[26.0, 77.5]}
        zoom={6}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
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
            <Popup>{spot.name}</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
