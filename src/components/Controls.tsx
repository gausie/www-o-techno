import React from "react";
import { css } from "../../styled-system/css";

const controls = css({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: "1rem",
  padding: "1rem",
  backgroundColor: "#f5f5f5",
  borderRadius: "8px",
  md: {
    flexDirection: "row",
  },
});

const playbackControls = css({
  display: "flex",
  gap: "1rem",
  alignItems: "center",
});

const coordinateControls = css({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  flexWrap: "wrap",
  md: {
    flexDirection: "row",
  },
});

const button = css({
  padding: "0.5rem 1rem",
  fontSize: "1rem",
  backgroundColor: "#4caf50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  transition: "background-color 0.2s",
  _hover: {
    backgroundColor: "#45a049",
  },
});

const label = css({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

const rangeInput = css({
  width: "200px",
});

const numberInput = css({
  width: "100px",
  padding: "0.25rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
});

type Props = {
  positionData: { latitude: number; longitude: number; speed: number };
  isPlaying: boolean;
  onPlayPause: () => void;
  onPositionDataChange: (positionData: {
    latitude: number;
    longitude: number;
    speed: number;
  }) => void;
};

export const Controls: React.FC<Props> = ({
  positionData,
  isPlaying,
  onPlayPause,
  onPositionDataChange,
}) => {
  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lat = parseFloat(e.target.value);
    if (!isNaN(lat) && onPositionDataChange) {
      onPositionDataChange({ ...positionData, latitude: lat });
    }
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lng = parseFloat(e.target.value);
    if (!isNaN(lng) && onPositionDataChange) {
      onPositionDataChange({ ...positionData, longitude: lng });
    }
  };

  return (
    <div className={controls}>
      <div className={playbackControls}>
        <button className={button} onClick={onPlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
      <div className={coordinateControls}>
        <label className={label}>
          Latitude:
          <input
            className={numberInput}
            type="number"
            step="0.0001"
            value={positionData.latitude}
            onChange={handleLatitudeChange}
          />
        </label>
        <label className={label}>
          Longitude:
          <input
            className={numberInput}
            type="number"
            step="0.0001"
            value={positionData.longitude}
            onChange={handleLongitudeChange}
          />
        </label>
        <label className={label}>
          Speed (m/s):
          <input
            className={rangeInput}
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={positionData.speed}
            onChange={(e) =>
              onPositionDataChange({
                ...positionData,
                speed: parseFloat(e.target.value),
              })
            }
          />
          {positionData.speed.toFixed(1)}
        </label>
      </div>
    </div>
  );
};
