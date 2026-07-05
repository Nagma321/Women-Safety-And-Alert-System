import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import BottomNav from "./Home/BottomNav";
import "../App.css";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const TrackMeMap = () => {

  // Default = Mangalore
  
  const [currentPosition, setCurrentPosition] = useState([13.0732, 74.9952]);

  const [isTracking, setIsTracking] = useState(false);

  const mapRef = useRef(null);

  // Get live GPS location automatically
  useEffect(() => {

    navigator.geolocation.getCurrentPosition(

      (position) => {

        const liveLocation = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        setCurrentPosition(liveLocation);

        if (mapRef.current) {
          mapRef.current.setView(liveLocation, 15);
        }
      },

      (error) => {
        console.log(error);
      },

      {
        enableHighAccuracy: true,
      }
    );

  }, []);

  // Track button
  const handleTrackMe = () => {

    navigator.geolocation.getCurrentPosition(

      (position) => {

        const liveLocation = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        setCurrentPosition(liveLocation);

        if (mapRef.current) {
          mapRef.current.setView(liveLocation, 16);
        }

        setIsTracking(true);
      },

      (error) => {
        console.log(error);
        alert("Location access denied");
      },

      {
        enableHighAccuracy: true,
      }
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-76px)] relative">

      <div className="flex-1 p-4">

        <div className="flex flex-col h-full">

          <button
            onClick={handleTrackMe}
            className="w-full md:w-auto self-center mb-4 text-red-400 font-bold flex items-center justify-center gap-2 px-6 py-2.5 hover:bg-red-50 rounded-lg transition-all border-2 border-red-300"
          >
            {isTracking ? "Tracking Active" : "Track Me"}
          </button>

          <div className="flex-1 relative rounded-lg overflow-hidden shadow-lg">

            <MapContainer
              center={currentPosition}
              zoom={15}
              className="h-full w-full"
              whenCreated={(map) => (mapRef.current = map)}
            >

              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              <Marker position={currentPosition}>
                <Popup>
                  Your Current Location
                </Popup>
              </Marker>

            </MapContainer>

          </div>
        </div>
      </div>

      <div className="w-full p-2 bg-white">
        <BottomNav />
      </div>

    </div>
  );
};

export default TrackMeMap;