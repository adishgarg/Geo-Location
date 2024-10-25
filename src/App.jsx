// import React, { useEffect } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import 'leaflet-routing-machine';

// const MapComponent = () => {
//   useEffect(() => {
//     // Check if the map is already initialized
//     if (L.DomUtil.get('map') !== null) {
//       L.DomUtil.get('map')._leaflet_id = null;
//       if (navigator.geolocation) {
//         navigator.geolocation.watchPosition(position => {
//           const userLat = position.coords.latitude;
//           const userLng = position.coords.longitude;
//           L.marker([userLat, userLng]).addTo(map).bindPopup('You are here').openPopup();
//           map.setView([userLat, userLng], 15);
    
//           // Routing
//           L.Routing.control({
//             waypoints: [
//               L.latLng(userLat, userLng),
//               L.latLng([30.51505986493433, 76.6607994540213])
//             ],
//             routeWhileDragging: true
//           }).addTo(map);
//         });
//       }
//     }

//     // Initialize the map
//     const map = L.map('map', {
//       center: [30.516143776540222, 76.6597691858834],
//       zoom: 18,
//       maxBounds: [
//         1,1  // Northeast coordinates
//       ],
//       maxBoundsViscosity: 1.0,
//       // scrollWheelZoom: false 
//     });

//     // Set up the OSM tile layer
//     L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
//       // maxZoom: 19,
//   // attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
//     }).addTo(map);

//     // Add a marker for the university
//     L.marker([30.516143776540222, 76.6597691858834]).addTo(map)
//       .bindPopup('Chitkara university')
//       .openPopup();
//       // Add a marker for the university
//     L.marker([30.515918458264974, 76.65811797951999]).addTo(map)
//       .bindPopup('Sportorium')
//       .openPopup();
//     L.marker([30.515826029960863, 76.65693780802657]).addTo(map)
//       .bindPopup('Explortorium')
//       .openPopup();
//     L.marker([30.51725761674037, 76.65917602902984]).addTo(map)
//       .bindPopup('Alpha Zone')
//       .openPopup();
//     L.marker([30.51535691489443, 76.65980128380376]).addTo(map)
//       .bindPopup('Square 1')
//       .openPopup();
//     L.marker([30.51736741565043, 76.66066507961823]).addTo(map)
//       .bindPopup('Square 2')
//       .openPopup();
//     L.marker([30.51505986493433, 76.6607994540213]).addTo(map)
//       .bindPopup('Omega Zone')
//       .openPopup();
//     L.marker([30.51656740863404, 76.65809926671677]).addTo(map)
//       .bindPopup('Zero Ground')
//       .openPopup();
//     L.marker([30.51568241619399, 76.65977982058816]).addTo(map)
//       .bindPopup('Beta Zone')
//       .openPopup();
//     L.marker([30.5140770746809, 76.65990430496825]).addTo(map)
//       .bindPopup('Rockfeller')
//       .openPopup();
    
      
//     // Cleanup function to remove the map on component unmount
//     return () => {
//       map.remove();
//     };
//   }, []);

//   return <div id="map" style={{ height: '100vh' }}></div>;
// };

// export default MapComponent;

import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

const MapComponent = () => {
  useEffect(() => {
    let map;
    let watchID;
    
    // Function to initialize map and routing
    const initializeMap = (userLat, userLng) => {
      // Set map view to user's location
      map.setView([30.516143776540222, 76.6597691858834], 15);

      // Add marker for user's location
      const userMarker = L.marker([userLat, userLng])
        .addTo(map)
        .bindPopup('You are here')
        .openPopup();

      // Add routing from user's location to a predefined destination
      L.Routing.control({
        waypoints: [
          L.latLng(userLat, userLng),
          L.latLng([30.51505986493433, 76.6607994540213])
        ],
        routeWhileDragging: true
      }).addTo(map);
    };

    if (navigator.geolocation) {
      // Request location updates with high accuracy
      watchID = navigator.geolocation.watchPosition(
        position => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          // Initialize map only if it hasn't been created yet
          if (!map) {
            map = L.map('map', {
              center: [30.516143776540222, 76.6597691858834],
              maxZoom: 20,
              zoom: 18,
              maxBounds: [1,1],
              // maxBoundsViscosity: 1.0,
            });

            // Add tile layer to the map
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
              maxZoom: 19,
            }).addTo(map);

            // Add markers for different locations
           //     L.marker([30.516143776540222, 76.6597691858834]).addTo(map)
//       .bindPopup('Chitkara university')
//       .openPopup();
//       // Add a marker for the university
          L.marker([30.515918458264974, 76.65811797951999]).addTo(map)
            .bindPopup('Sportorium')
            .openPopup();
          L.marker([30.515826029960863, 76.65693780802657]).addTo(map)
            .bindPopup('Explortorium')
            .openPopup();
          L.marker([30.51725761674037, 76.65917602902984]).addTo(map)
            .bindPopup('Alpha Zone')
            .openPopup();
          L.marker([30.51535691489443, 76.65980128380376]).addTo(map)
            .bindPopup('Square 1')
            .openPopup();
          L.marker([30.51736741565043, 76.66066507961823]).addTo(map)
            .bindPopup('Square 2')
            .openPopup();
          L.marker([30.51505986493433, 76.6607994540213]).addTo(map)
            .bindPopup('Omega Zone')
            .openPopup();
          L.marker([30.51656740863404, 76.65809926671677]).addTo(map)
            .bindPopup('Zero Ground')
            .openPopup();
          L.marker([30.51568241619399, 76.65977982058816]).addTo(map)
            .bindPopup('Beta Zone')
            .openPopup();
          L.marker([30.5140770746809, 76.65990430496825]).addTo(map)
            .bindPopup('Rockfeller')
            .openPopup();
            // Add other markers here...

            // Initialize the map and routing with the user's position
            initializeMap(userLat, userLng);
          } else {
            // Update the marker and map view for the current position
            map.setView([userLat, userLng], 15);
          }
        },
        error => {
          console.error('Error getting location: ', error);
        },
        {
          enableHighAccuracy: true, // High accuracy mode
          timeout: 5000, // Timeout after 5 seconds
          maximumAge: 0, // Don't use cached location
        }
      );
    }

    // Cleanup function to remove map and stop watching location
    return () => {
      if (map) {
        map.remove();
      }
      if (watchID) {
        navigator.geolocation.clearWatch(watchID);
      }
    };
  }, []);

  return <div id="map" style={{ height: '100vh' }}></div>;
};

export default MapComponent;
