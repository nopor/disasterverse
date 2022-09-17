import { FC } from "react";

export const WaterLevel: FC<{ percentage: number }> = ({ percentage }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "0px",
        right: "10px",
        overflow: "hidden",
      }}
    >
      <div className="liquid"></div>

      <p
        className="text-glow"
        style={{
          color: "white",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        Water level
      </p>
    </div>
  );
};
