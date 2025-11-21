"use client";
import React, { useEffect, useRef, useState } from "react";
import L, { popup } from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "./output.css";

import userIconUrl from "/location.png";
import destinationIconUrl from "/map.png";
import mainGateIconUrl from "/main-gate.png"; 

const CampusNavigation = () => {
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);
  const routingControl2Ref = useRef(null); // Second routing control for alternative route
  const userMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const destinations = {
     "IBN Mess": [30.514808696452203, 76.66239862640317],
    Library: [30.515880480909264, 76.66056727660482],
    "Main Gate": [30.517973604500913, 76.6592018126612],
    "Square One (Canteen)": [30.51505883284976, 76.65986475664138],
    "Tesla Block": [30.51582339110766, 76.65650172720511],
    "Martin Luther Block": [30.51441976364978, 76.66018796680291],
    "Rockefeller Block": [30.51407144792044, 76.65992811601976],
    "Fleming Block": [30.515806325807738, 76.6605231391317],
    "Omega Zone": [30.514963369154493, 76.66101511676547],
    "Alpha Zone": [30.51705391382805, 76.65943053052582],
    "Zero Ground": [30.516520104961423, 76.65860095072019],
    Sportorium: [30.51576481614685, 76.65803373505508],
    "Square Two (Canteen)": [30.517414595741453, 76.66070913580434],
    Exploretorium: [30.515873663768126, 76.65721123447169],
    "Boys Hostel Gate": [30.514310522972274, 76.66075476547918],
    "Girls Hostel Gate": [30.5154556145917, 76.66184148392217],
    "Beta Zone": [30.51569434291585, 76.65981910052695],
    // Added IBN Mess coordinates
  };

  const userIcon = L.icon({
    iconUrl: userIconUrl,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  const destinationIcon = L.icon({
    iconUrl: destinationIconUrl,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  const mainGateIcon = L.icon({
    iconUrl: mainGateIconUrl,
    iconSize: [15, 15],
  iconAnchor: [12, 25],
  });

  useEffect(() => {
    const map = L.map(mapRef.current).setView([30.516198, 76.65973], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    userMarkerRef.current = L.marker(
      [30.516198, 76.65973],
      { icon: userIcon },
      popup("User")
    ).addTo(map);

    // Primary routing control (Boys route - Blue)
    routingControlRef.current = L.Routing.control({
      waypoints: [],
      lineOptions: {
        styles: [{ color: "#6FA1EC", weight: 4 }],
      },
      draggableWaypoints: false,
      addWaypoints: false,
      createMarker: () => null,
      show: false, // Hide the instructions panel
      routeWhileDragging: false,
    }).addTo(map);

    // Secondary routing control (Girls route - Pink)
    routingControl2Ref.current = L.Routing.control({
      waypoints: [],
      lineOptions: {
        styles: [{ color: "#FF69B4", weight: 4 }], // Pink color
      },
      draggableWaypoints: false,
      addWaypoints: false,
      createMarker: () => null,
      show: false, // Hide the instructions panel
      routeWhileDragging: false,
    }).addTo(map);

    // Hide the routing instructions containers completely
    setTimeout(() => {
      if (routingControlRef.current._container) {
        routingControlRef.current._container.style.display = 'none';
      }
      if (routingControl2Ref.current._container) {
        routingControl2Ref.current._container.style.display = 'none';
      }
    }, 100);

    //-----------------------------
    // ✅ ADD POLYGONS + LABELS
    //-----------------------------

    // --- Martin Luther Block (approx polygon) ---
    const martinLutherCoords = [
            [30.51441976364978, 76.66018796680291],  
            [30.51445,          76.66034],
            [30.51418,          76.66041],
            [30.51415,          76.66020],
      ];


    const martinPoly = L.polygon(martinLutherCoords, {
      color: "#888",
      weight: 1,
      fillColor: "#c6c3bd", // subtle beige/grey similar to OSM building
      fillOpacity: 0.45,
    }).addTo(map);

    martinPoly.bindTooltip("Martin Luther Block", {
      permanent: true,
      direction: "center",
      className: "block-label",
    });

    // --- Rockefeller Block (approx polygon) ---
    const rockefellerCoords = [
      [30.51418, 76.65982],
      [30.51426, 76.66001],
      [30.51396, 76.66014],
      [30.51388, 76.65992],
    ];

    const rockefellerPoly = L.polygon(rockefellerCoords, {
      color: "#888",
      weight: 1,
      fillColor: "#c6c3bd",
      fillOpacity: 0.45,
    }).addTo(map);

    rockefellerPoly.bindTooltip("Rockefeller Block", {
      permanent: true,
      direction: "center",
      className: "block-label",
    });

    //-----------------------------
    // ✅ ADD MAIN GATE ICON + TEXT
    //-----------------------------
    // const mainGateCoords = [30.518167, 76.659000];
    const mainGateCoords = [30.517917, 76.659222];

    const mainGateMarker = L.marker(mainGateCoords, { icon: mainGateIcon }).addTo(map);

    // ✅ Tilt the Main Gate icon diagonally towards the left
  setTimeout(() => {
    const iconElement = mainGateMarker._icon;
    if (iconElement) {
      iconElement.style.transform = "rotate(-25deg) scale(1)";
      iconElement.style.transition = "transform 0.3s ease";
    }
  }, 200);



    // Tooltip text with same style as Martin Luther
    mainGateMarker.bindTooltip("Main Gate", {
      permanent: true,
      direction: "top",
      offset: [0, -20],
      className: "block-label", // uses same CSS class
    });

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    alert(
      "Guidelines:\n\n" +
        "1. Please use Google Chrome for better performance.\n" +
        "2. Make sure to grant location access to enable accurate tracking.\n" +
        "3. Use your mobile device for more accurate location data."
    );

    const updateUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const newLatLng = [latitude, longitude];

            if (userMarkerRef.current) {
              userMarkerRef.current.setLatLng(newLatLng);
            }
          },
          (error) => {
            console.error("Error fetching location:", error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    updateUserLocation();
    const interval = setInterval(updateUserLocation, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDestinationChange = (event) => {
    const destinationName = event.target.value;
    setSelectedDestination(destinationName);

    if (routingControlRef.current && destinationName) {
      const destinationCoords = destinations[destinationName];

      if (destinationName === "IBN Mess") {
        // For IBN Mess, show both routes
        const userCoords = userMarkerRef.current.getLatLng();
        const boysHostelCoords = destinations["Boys Hostel Gate"];
        const girlsHostelCoords = destinations["Girls Hostel Gate"];

        // Boys route (Blue)
        routingControlRef.current.setWaypoints([
          userCoords,
          L.latLng(...boysHostelCoords),
          L.latLng(...destinationCoords),
        ]);

        // Girls route (Pink)
        routingControl2Ref.current.setWaypoints([
          userCoords,
          L.latLng(...girlsHostelCoords),
          L.latLng(...destinationCoords),
        ]);

      } else {
        // For other destinations, use only the primary route
        routingControlRef.current.setWaypoints([
          userMarkerRef.current.getLatLng(),
          L.latLng(...destinationCoords),
        ]);

        // Hide the second route
        routingControl2Ref.current.setWaypoints([]);
      }

      // Handle destination marker
      if (!destinationMarkerRef.current) {
        destinationMarkerRef.current = L.marker(destinationCoords, {
          icon: destinationIcon,
        }).addTo(routingControlRef.current._map);
      } else {
        destinationMarkerRef.current.setLatLng(destinationCoords);
      }
    }
  };

  return (
    <div className="bg-black text-gray-100 min-h-screen flex flex-col">
      <header className="text-center py-6 bg-black shadow-md">
        <h1 className="text-4xl font-semibold">Campus Navigation</h1>
        <p className="text-gray-400 mt-2">
          Navigate through the campus with ease.
        </p>
      </header>

      <main className="flex-grow">
        <div className="container mx-auto p-4">
          <div className="mb-4">
            <label
              htmlFor="destination"
              className="block mb-2 text-lg font-medium"
            >
              Select Destination:
            </label>
            <select
              id="destination"
              value={selectedDestination || ""}
              onChange={handleDestinationChange}
              className="w-full px-4 py-2 rounded-md bg-black text-gray-100 border border-gray-700"
            >
              <option value="" disabled>
                -- Choose a location --
              </option>
              {Object.keys(destinations).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Route instructions for IBN Mess */}
          {selectedDestination === "IBN Mess" && (
            <div className="mb-4 bg-gray-900 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Route Instructions for IBN Mess:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-block w-6 h-3 bg-blue-400 rounded"></span>
                  <span className="font-medium text-blue-300">Boys: </span>
                  <span>Follow the blue route (via Boys Hostel)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-block w-6 h-3 bg-pink-400 rounded"></span>
                  <span className="font-medium text-pink-300">Girls: </span>
                  <span>Follow the pink route (via Girls Hostel)</span>
                </div>
              </div>
            </div>
          )}

          <div
            ref={mapRef}
            className="w-full h-[70vh] rounded-lg overflow-hidden shadow-lg text-black"
          />
        </div>
      </main>
    </div>
  );
};

export default CampusNavigation;