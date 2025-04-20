import { useState, useEffect, useRef } from "react";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";

export default function Home() {
  const [name, setName] = useState("");
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  // fetch markers once
  useEffect(() => {
    fetch("/api/checkins")
      .then((res) => res.json())
      .then(setMarkers);
  }, []);

  // when map instance is available, force it to world‑view
  const onMapLoad = (map) => {
    mapRef.current = map;
    map.setCenter({ lat: 0, lng: 0 });
    map.setZoom(2);
  };

  const onMapUnmount = () => {
    mapRef.current = null;
  };

  const resetView = () => {
    if (mapRef.current) {
      mapRef.current.setCenter({ lat: 0, lng: 0 });
      mapRef.current.setZoom(2);
    }
  };

  const handleCheckIn = () => {
    if (!name.trim()) return alert("Please enter your name.");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        fetch("/api/checkin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            latitude: coords.latitude,
            longitude: coords.longitude,
          }),
        }).then(() => window.location.reload());
      },
      (err) => alert("Unable to get location: " + err.message)
    );
  };

  if (!isLoaded) return <div>Loading map…</div>;

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <GoogleMap
        mapContainerStyle={{ height: "100%", width: "100%" }}
        defaultCenter={{ lat: 0, lng: 0 }}
        defaultZoom={2}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        options={{
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: window.google.maps.ControlPosition.TOP_RIGHT,
          },
        }}
      >
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={{ lat: +m.latitude, lng: +m.longitude }}
            label={m.name}
          />
        ))}
      </GoogleMap>

      {/* Check‑in form */}
      <div className="checkin-form">
        <input
          className="checkin-input"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="checkin-button" onClick={handleCheckIn}>
          Check in
        </button>
        <button
          className="checkin-button"
          onClick={resetView}
          style={{ backgroundColor: "#555" }}
        >
          Reset view
        </button>
      </div>
    </div>
  );
}
