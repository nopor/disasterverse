import { FC, useEffect, useRef, useState } from "react";

import { WaterLevel, WaterLevelRef } from "../components/WaterLevel";
import { VrScene } from "../Scene/VrScene";

export const VrFlood: FC = () => {
  const waterLevelRef = useRef<WaterLevelRef>(null);
  const [renderScene, setRenderScene] = useState(false);

  useEffect(() => {
    setRenderScene(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waterLevelRef.current])

  return (
    <div>
      <WaterLevel ref={waterLevelRef} />
      {/* @ts-ignore */}
      {renderScene && <VrScene setWaterLevel={waterLevelRef.current.setWaterLevel} />}
    </div>
  );
}