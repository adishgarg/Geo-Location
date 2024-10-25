import 'leaflet-routing-machine';

useEffect(() => {
  // ... existing map initialization code

  // Geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      L.marker([userLat, userLng]).addTo(map).bindPopup('You are here').openPopup();
      map.setView([userLat, userLng], 15);

      // Routing
      L.Routing.control({
        waypoints: [
          L.latLng(userLat, userLng),
          L.latLng(destinationLatitude, destinationLongitude)
        ],
        routeWhileDragging: true
      }).addTo(map);
    });
  }
}, []);
