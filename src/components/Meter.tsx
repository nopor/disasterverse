import { FC } from "react";

export const Meter: FC<{ percentage: number }> = ({ percentage }) => {
  return (
    <div style={{ height: "200px" }}>
      <div
        style={{
          width: "100%",
          height: `${percentage}%`,
          backgroundColor: "blue",
          borderBottomRightRadius: "30px",
          borderBottomLeftRadius: "30px",
          position: "absolute",
          bottom: "0px",
        }}
      />
    </div>
  );
};
