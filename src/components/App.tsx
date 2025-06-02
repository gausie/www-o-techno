import { useEffect, useRef, useState } from "react";
import { Map } from "./Map";
import { Controls } from "./Controls";
import { Header } from "./Header";
import { Footer } from "./Footer";

import { css } from "../../styled-system/css";

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

  const worldOTechno =
    useRef<
      InstanceType<
        Awaited<typeof import("../synthesizer/WorldOTechno")>["WorldOTechno"]
      >
    >(null);

  useEffect(() => {
    worldOTechno.current?.setPositionData(positionData);
  }, [positionData, worldOTechno]);

  const handlePositionDataChange = (positionData: {
    latitude: number;
    longitude: number;
    speed: number;
  }) => {
    setPositionData(positionData);
  };

  const handlePlayPause = () => {
    if (!worldOTechno.current) {
      console.log("loading");
      async function load() {
        setLoading(true);
        const { start } = await import("tone");
        await start();

        const { WorldOTechno } = await import("../synthesizer/WorldOTechno");
        const instance = new WorldOTechno();
        await instance.load();
        instance.setPositionData(positionData);
        instance.play();
        worldOTechno.current = instance;
        setIsPlaying(true);
        setLoading(false);
      }
      load();
      return;
    }

    if (isPlaying) {
      worldOTechno.current.stop();
    } else {
      worldOTechno.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={containerStyle}>
      <Header />
      <Controls
        positionData={positionData}
        isLoading={loading}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onPositionDataChange={handlePositionDataChange}
      />
      <Map
        positionData={positionData}
        onPositionDataChange={handlePositionDataChange}
      />
      <Footer />
    </div>
  );
}

export default App;
