import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
  const usBounds = [
    [24.396308, -124.848974],
    [49.384358, -66.885444]   
  ];

  return (
    <MapContainer
      bounds={usBounds}
      className="fixed inset-0 h-screen w-full"
    >
        <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />
    </MapContainer>
  );
}