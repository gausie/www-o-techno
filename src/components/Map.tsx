import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { css } from "../../styled-system/css";

const container = css({
  padding: "1rem",
  width: "100%",
});

const map = css({
  height: "500px",
  borderRadius: "8px",
  border: "1px solid #ddd",
});

type Props = {
  positionData: { latitude: number; longitude: number; speed: number };
  onPositionDataChange?: (positionData: {
    latitude: number;
    longitude: number;
    speed: number;
  }) => void;
};

export const Map: React.FC<Props> = ({
  positionData,
  onPositionDataChange,
}) => {
  const MapEvents = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        onPositionDataChange?.({
          ...positionData,
          latitude: lat,
          longitude: lng,
        });
      },
    });
    return null;
  };

  return (
    <div className={container}>
      <MapContainer
        center={[positionData.latitude, positionData.longitude]}
        zoom={15}
        className={map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[positionData.latitude, positionData.longitude]} />
        <MapEvents />
      </MapContainer>
    </div>
  );
};
