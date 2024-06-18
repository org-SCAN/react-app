import React, { useEffect, useState,  } from "react";
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

  
  

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      const zip = await JSZip.loadAsync(arrayBuffer);

      zip.forEach((relativePath, zipEntry) => { // Parcourir tous les fichiers dans le ZIP
        if (zipEntry.name.endsWith('.json')) {  // Vérifier si le fichier est un fichier JSON
          zipEntry.async('text').then(jsonText => { // Extraire le contenu du fichier JSON
            const jsonData = JSON.parse(jsonText);
            setCoordinates(jsonData.coordinates);
          });
        }
      });
    };
    
    reader.readAsArrayBuffer(file);
  };

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
    <div  className="div_map_main">
      <h1>CorspeMaper</h1>
      <input type="file" onChange={handleFileUpload} />
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
    
    </div>
    


    
  );
}

export default Map;
