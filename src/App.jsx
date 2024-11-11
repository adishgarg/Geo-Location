import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

const Map = () => {
  useEffect(() => {
    // Initialize the map
    const map = L.map('map', {
      center: [30.516198, 76.659730],
      zoom: 15,
    });

    // Add the tile layer
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
      minZoom: 0,
      maxZoom: 20,
      attribution: '',
      ext: 'jpg',
    }).addTo(map);

    // Add a marker to the map
    L.marker([30.514964084623355, 76.66102511416453], { draggable: false })
      .addTo(map)
      .bindPopup("Omega Ground")
      .openPopup();
    L.marker([30.51587231653969, 76.65719118779487], { draggable: false })
      .addTo(map)
      .bindPopup("Explortorium")
      .openPopup();
    L.marker([30.51570445886611, 76.65657071175687], { draggable: false })
      .addTo(map)
      .bindPopup("Tesla Block")
      .openPopup();
    L.marker([30.51569279880044, 76.65807396029054], { draggable: false })
      .addTo(map)
      .bindPopup("Sportorium")
      .openPopup();
    L.marker([30.517043690210198, 76.65939857007433], { draggable: false })
      .addTo(map)
      .bindPopup("Alpha Zone")
      .openPopup();

    // Cleanup function to remove the map instance when the component unmounts
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div id="map" style={{ height: '100vh', width: '100%' }}></div>
  );
};

export default Map;
