import { FC } from "react";

export const Meter: FC<{ percentage: number }> = ({ percentage }) => {
  console.log(percentage);
  return (
    <>
      <div
        style={{
          height: "200px",
          width: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          borderRadius: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: `${percentage * 100}%`,
            backgroundColor: "crimson",
            borderRadius: "20px",
            position: "absolute",
            bottom: "0px",
          }}
        />
      </div>
      <p style={{ color: "white", width: "90px", position: "absolute" }}>
        Risk level
      </p>
    </>
  );
};
