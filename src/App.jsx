import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";

const CampusNavigation = () => {
  const mapRef = useRef(null);
  const routingControlRef = useRef(null); // Reference for the routing control
  const startMarkerRef = useRef(null); // Reference for the start marker
  const endMarkerRef = useRef(null); // Reference for the end marker
  const [userLocation, setUserLocation] = useState([30.516198, 76.65973]); // Default start location
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Predefined destinations
  const destinations = {
    Library: [30.515880480909264, 76.66056727660482],
    "Main Gate": [30.5175, 76.6568],
    "Square 1": [30.51505883284976, 76.65986475664138],
    Tesla: [30.51582339110766, 76.65650172720511],
    "Fleming Block": [30.515806325807738, 76.6605231391317],
    "Omega Zone": [30.514963369154493, 76.66101511676547],
    "Alpha Zone": [30.51705391382805, 76.65943053052582],
    "Zero Ground": [30.516520104961423, 76.65860095072019],
  };

  useEffect(() => {
    // Initialize the map
    const map = L.map(mapRef.current).setView(userLocation, 16);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add start marker
    startMarkerRef.current = L.marker(userLocation, { title: "You are here" }).addTo(map);

    // Create the routing control (without setting waypoints initially)
    routingControlRef.current = L.Routing.control({
      waypoints: [],
      lineOptions: {
        styles: [{ color: "#6FA1EC", weight: 4 }],
      },
      draggableWaypoints: false, // Prevent dragging
      addWaypoints: false, // Disable adding waypoints by clicking
      createMarker: function () {
        return null; // Suppress default markers
      },
    }).addTo(map);

    // Watch user location and update the map periodically
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = [latitude, longitude];
        setUserLocation(newLocation);

        // Update start marker
        if (startMarkerRef.current) {
          startMarkerRef.current.setLatLng(newLocation);
        }

        // Update routing control if a destination is selected
        if (routingControlRef.current && selectedDestination) {
          routingControlRef.current.setWaypoints([
            L.latLng(newLocation), // Updated user location
            L.latLng(...destinations[selectedDestination]), // Selected destination
          ]);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      { enableHighAccuracy: true }
    );

    // Cleanup on unmount
    return () => {
      map.remove();
      navigator.geolocation.clearWatch(watchId);
    };
  }, [selectedDestination]);

  const handleDestinationChange = (event) => {
    const destinationName = event.target.value;
    setSelectedDestination(destinationName);

    if (routingControlRef.current && destinationName) {
      const destinationCoords = destinations[destinationName];

      // Set waypoints for the route
      routingControlRef.current.setWaypoints([
        L.latLng(userLocation), // Updated user location
        L.latLng(...destinationCoords), // Selected destination
      ]);

      // Update end marker
      if (endMarkerRef.current) {
        endMarkerRef.current.setLatLng(destinationCoords);
      } else {
        endMarkerRef.current = L.marker(destinationCoords, {
          title: destinationName,
        }).addTo(mapRef.current);
      }
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>Campus Navigation</h1>
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <label htmlFor="destination" style={{ fontWeight: "bold" }}>
          Select Destination:{" "}
        </label>
        <select
          id="destination"
          value={selectedDestination || ""}
          onChange={handleDestinationChange}
          style={{
            padding: "5px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
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
        style={{ width: "100%", height: "80vh", margin: "20px auto" }}
      ></div>
    </div>
  );
};

export default CampusNavigation;
