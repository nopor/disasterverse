import { useEffect, useState } from "react";

export const GPS = () => {
  const [lat, setLat] = useState(47.3769);
  const [lon, setLon] = useState(8.5417);

  function setPosition(position: any) {
    console.log("position", position);
    setLat(+Number(position.coords.latitude).toFixed(4));
    setLon(+Number(position.coords.longitude).toFixed(4));
  }

  useEffect(() => {
    console.log("mounted", navigator.geolocation);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setPosition);
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <p>
      <span
        className="text-glow"
        style={{
          color: "white",
          fontSize: "0.8em",
          paddingLeft: "5px",
        }}
      >
        📍 lat: {lat}, lon: {lon}
      </span>
    </p>
  );
};
