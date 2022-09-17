import { forwardRef, useImperativeHandle, useState } from "react";
export type WaterLevelRef = {
  setWaterLevel: (value: number) => void;
}
export const WaterLevel = forwardRef<WaterLevelRef>((props, ref) => {
  const [waterLevel, setInternalWaterLevel] = useState(0);
  useImperativeHandle(ref, () => ({
    setWaterLevel(value) {
      setInternalWaterLevel(value);
    }
  }));

  const waterStyle = { "--waterlevel": ((waterLevel + 100) * -1).toFixed(2) + '%' } as React.CSSProperties;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "0px",
        right: "10px",
        overflow: "hidden",
      }}
    >
      <div className="liquid" style={waterStyle}></div>

      <p
        className="text-glow"
        style={{
          color: "white",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        Water level 7m
      </p>
    </div >
  );
});
