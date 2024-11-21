import React, { useEffect, useRef, useState } from "react";
import L, { popup } from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import './output.css'

// Custom Icons
import userIconUrl from "/location.png";
import destinationIconUrl from "/map.png";

const CampusNavigation = () => {
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);
  const userMarkerRef = useRef(null); // Reference for the user marker
  const destinationMarkerRef = useRef(null); // Reference for the destination marker
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Predefined destinations
  const destinations = {
    Library: [30.515880480909264, 76.66056727660482],
    "Main Gate": [30.517973604500913, 76.6592018126612],
    "Square One (Canteen)": [30.51505883284976, 76.65986475664138],
    Tesla: [30.51582339110766, 76.65650172720511],
    "Fleming Block": [30.515806325807738, 76.6605231391317],
    "Omega Zone": [30.514963369154493, 76.66101511676547],
    "Alpha Zone": [30.51705391382805, 76.65943053052582],
    "Zero Ground": [30.516520104961423, 76.65860095072019],
    Sportorium: [30.51576481614685, 76.65803373505508],
    Barista: [30.51587630073014, 76.65683266571116],
    "Square Two (Canteen)": [30.517414595741453, 76.66070913580434],
    Explortorium: [30.515873663768126, 76.65721123447169],
    "Boys Hostel Gate": [30.514310522972274, 76.66075476547918],
    "Girls Hostel Gate": [30.5154556145917, 76.66184148392217],
    "Beta Zone": [30.51569434291585, 76.65981910052695]
  };

  // Create custom icons
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
    // Initialize the map
    const map = L.map(mapRef.current).setView([30.516198, 76.65973], 16);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add user marker initially
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
      createMarker: function () {
        return null;
      },
    }).addTo(map);

    // Cleanup on unmount
    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
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
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    // Update user location on component mount and set an interval for continuous tracking
    updateUserLocation();
    const interval = setInterval(updateUserLocation, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleDestinationChange = (event) => {
    const destinationName = event.target.value;
    setSelectedDestination(destinationName);

    if (routingControlRef.current && destinationName) {
      const destinationCoords = destinations[destinationName];

      // Set waypoints for the route
      routingControlRef.current.setWaypoints([
        userMarkerRef.current.getLatLng(), // Current user location
        L.latLng(...destinationCoords), // Selected destination
      ]);

      // Update destination marker
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
            className="w-full h-[70vh] rounded-lg overflow-hidden shadow-lg"
          ></div>
        </div>
      </main>
      <footer className="text-center py-4 bg-gray-800">
        <p className="text-gray-400">
          &copy; {new Date().getFullYear()} Campus Navigation App
        </p>
      </footer>
    </div>
  );
};

export default CampusNavigation;
