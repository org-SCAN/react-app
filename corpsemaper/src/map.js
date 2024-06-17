import React, { useEffect, useState, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import JSZip from 'jszip';
import './App.css';



function Map() {
  const centre = [46.603354, 1.8883335];
  const [coordinates, setCoordinates] = useState([]);

  const customIcon = new L.Icon({
    iconUrl: "/logo.png",
    iconSize: [25, 25],
  });

  useEffect(() => {
    // Fonction pour lire le fichier ZIP et extraire le fichier JSON
    const fetchCoordinates = async () => {
      try {
        const response = await fetch('zipFile.zip'); // Remplacez par le chemin de votre fichier ZIP
        const blob = await response.blob();
        const zip = await JSZip.loadAsync(blob);

        const jsonFile = zip.file('a6628607-f4b4-4261-9ada-f19a38fb1f6b.json'); // Remplacez par le nom de votre fichier JSON dans le ZIP
        if (jsonFile) {
          const jsonText = await jsonFile.async('text');
          const jsonData = JSON.parse(jsonText);

          // Supposons que le fichier JSON contient un tableau de coordonnées
          setCoordinates(jsonData.coordinates);
        }
      } catch (error) {
        console.error("Failed to fetch and unzip file:", error);
      }
    };

    fetchCoordinates();
  }, []);

  const createMarkers = () => {
    return coordinates.map((coord, index) => (
      <Marker key={index} position={[coord.latitude, coord.longitude]} icon={customIcon}>
        <Popup>
          <div>
            <p>ID: {coord.id}</p>
          </div>
        </Popup>
      </Marker>
    ));
  };

  return (
    <div className="div_map">
    <MapContainer center={centre} zoom={6} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading={true} chunkInterval={50} removeOutsideVisibleBounds={true} disableClusteringAtZoom={10}>
        {createMarkers()}
      </MarkerClusterGroup>
    </MapContainer>
    </div>
  );
}

export default Map;
