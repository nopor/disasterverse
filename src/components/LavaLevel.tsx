import { forwardRef, useImperativeHandle, useState } from "react";
export type LavaLevelRef = {
  setLavaLevel: (value: number) => void;
}
export const LavaLevel = forwardRef<LavaLevelRef>((props, ref) => {
  const [lavaLevel, setInternalLavaLevel] = useState(0);
  useImperativeHandle(ref, () => ({
    setLavaLevel(value) {
      setInternalLavaLevel(value);
    }
  }));

  const lavaStyle = { "--lavalevel": ((lavaLevel + 100) * -1).toFixed(2) + '%' } as React.CSSProperties;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "0px",
        right: "10px",
        overflow: "hidden",
      }}
    >
      <div className="lava" style={lavaStyle}></div>

      <p
        className="text-glow"
        style={{
          color: "white",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        Lava level
      </p>
    </div >
  );
});
