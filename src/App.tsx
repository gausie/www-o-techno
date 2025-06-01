import { useEffect, useMemo, useState } from "react";
import { WorldOTechno } from "./synthesizer/WorldOTechno";
import { Map } from "./components/Map";
import { Controls } from "./components/Controls";
import { Header } from "./components/Header";
import { css } from "../styled-system/css";

const containerStyle = css({
  paddingTop: "1rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "stretch",
  gap: "1rem",
});

function App() {
  const [loading, setLoading] = useState(false);
  const [positionData, setPositionData] = useState<{
    latitude: number;
    longitude: number;
    speed: number;
  }>({ latitude: 52.0382, longitude: -2.3799, speed: 0 });
  const [isPlaying, setIsPlaying] = useState(false);

  const worldOTechno = useMemo(() => new WorldOTechno(), []);

  useEffect(() => {
    async function loadSamples() {
      setLoading(true);
      await worldOTechno.load();
      setLoading(false);
    }
    loadSamples();
  }, [worldOTechno]);

  useEffect(() => {
    worldOTechno.setPositionData(positionData);
  }, [positionData, worldOTechno]);

  const handlePositionDataChange = (positionData: {
    latitude: number;
    longitude: number;
    speed: number;
  }) => {
    setPositionData(positionData);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      worldOTechno.pause();
    } else {
      worldOTechno.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={containerStyle}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Header />
          <Controls
            positionData={positionData}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onPositionDataChange={handlePositionDataChange}
          />
          <Map
            positionData={positionData}
            onPositionDataChange={handlePositionDataChange}
          />
        </>
      )}
    </div>
  );
}

export default App;
