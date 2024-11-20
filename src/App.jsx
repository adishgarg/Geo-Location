import React, { useEffect, useRef, useState } from "react";
import L, { popup } from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";

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
    "Main Gate": [30.517957899557707, 76.65921217998608],
    "Square One (Canteen)": [30.51505883284976, 76.65986475664138],
    Tesla: [30.51582339110766, 76.65650172720511],
    "Fleming Block": [30.515806325807738, 76.6605231391317],
    "Omega Zone": [30.514963369154493, 76.66101511676547],
    "Alpha Zone": [30.51705391382805, 76.65943053052582],
    "Zero Ground": [30.516520104961423, 76.65860095072019],
    Sportorium: [30.51576481614685, 76.65803373505508],
    Barista: [30.51587630073014, 76.65683266571116],
    "Square Two (Canteen)": [30.517414595741453, 76.66070913580434],
  };
  const campusBounds = [
    [30.51855422466877, 76.66189106834939], // Southwest corner
    [30.511616952438004, 76.65559182244911], // Northeast corner
  ];
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
    <div>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>
        Campus Navigation
      </h1>
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
