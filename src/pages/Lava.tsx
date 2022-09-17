import { FC, useEffect, useRef, useState } from "react";

import { LavaLevel, LavaLevelRef } from "../components/LavaLevel";
import { LavaScene } from "../Scene/LavaScene";

export const Lava: FC = () => {
  const lavaLevelRef = useRef<LavaLevelRef>(null);
  const [renderScene, setRenderScene] = useState(false);

  useEffect(() => {
    setRenderScene(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lavaLevelRef.current])

  return (
    <div>
      <LavaLevel ref={lavaLevelRef} />
      {/* @ts-ignore */}
      {renderScene && <LavaScene setWaterLevel={lavaLevelRef.current?.setLavaLevel} />}
    </div>
  );
}