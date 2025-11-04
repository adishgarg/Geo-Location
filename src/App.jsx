"use client";
import React, { useEffect, useRef, useState } from "react";
import L, { popup } from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "./output.css";

import userIconUrl from "/location.png";
import destinationIconUrl from "/map.png";

const CampusNavigation = () => {
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);
  const userMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const destinations = {
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

    routingControlRef.current = L.Routing.control({
      waypoints: [],
      lineOptions: {
        styles: [{ color: "#6FA1EC", weight: 4 }],
      },
      draggableWaypoints: false,
      addWaypoints: false,
      createMarker: () => null,
    }).addTo(map);

    //-----------------------------
    // ✅ ADD POLYGONS + LABELS
    //-----------------------------

    // --- Martin Luther Block (approx polygon) ---
    const martinLutherCoords = [
      [30.51452, 76.66016],
      [30.51458, 76.66034],
      [30.51434, 76.66041],
      [30.51428, 76.66020],
    ];

   const martinPoly = L.polygon(martinLutherCoords, {
          color: "#888",
          weight: 1,
          fillColor: "#c6c3bd",   // subtle beige/grey similar to OSM building
          fillOpacity: 0.45
    }).addTo(map);

    martinPoly.bindTooltip("Martin Luther Block", {
      permanent: true,
      direction: "center",
      className: "block-label"
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
        fillOpacity: 0.45
      }).addTo(map);

    rockefellerPoly.bindTooltip("Rockefeller Block", {
        permanent: true,
        direction: "center",
        className: "block-label"
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

      routingControlRef.current.setWaypoints([
        userMarkerRef.current.getLatLng(),
        L.latLng(...destinationCoords),
      ]);

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
