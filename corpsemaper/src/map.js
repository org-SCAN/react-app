import React, {  useState,  } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import JSZip from 'jszip';
import './App.css';



function Map() {
  const centre = [46.603354, 1.8883335];
  const [coordinates, setCoordinates] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const customIcon = new L.Icon({
    iconUrl: "/logo.png",
    iconSize: [25, 25],
  });

   
   const DirectoryUpload = async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker(); // sélectionner un dossier
      const coordinatesList = [];
      let jsonFileFound = false;

      for await (const entry of directoryHandle.values()) { // Parcourir chaque fichier dans le dossier
        if (entry.kind === 'file' && entry.name.endsWith('.zip')) {
          const file = await entry.getFile();
          const arrayBuffer = await file.arrayBuffer();
          const zip = await JSZip.loadAsync(arrayBuffer);

          for (const relativePath in zip.files) {  // Parcourir chaque fichier dans le ZIP
            const zipEntry = zip.files[relativePath];
            if (zipEntry.name.endsWith('.json')) {
              const jsonText = await zipEntry.async('text');
              const jsonData = JSON.parse(jsonText);
              coordinatesList.push(...jsonData.coordinates);
              jsonFileFound = true;
            }
          }
        }
      }

      if (!jsonFileFound) {  // Si aucun fichier JSON n'est trouvé
        setCoordinates([]);
        setErrorMessage('Aucun fichier JSON trouvé !');
      } else {
        setCoordinates(coordinatesList);
        setErrorMessage('');
      }
    } catch (error) {
      setErrorMessage('Error selecting folder.');
    }

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
    <div className="div_map_main">
      <h1>CorpseMaper</h1>
      <button onClick={DirectoryUpload}>Select Directory</button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
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