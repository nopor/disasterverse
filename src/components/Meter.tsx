import { FC } from "react";

export const Meter: FC<{ percentage: number }> = ({ percentage }) => {
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
            background:
              "linear-gradient(9deg, rgba(32,0,36,1) 0%, rgba(121,9,9,1) 48%, rgba(255,0,131,0.7917760854341737) 100%)",
            borderRadius: "20px",
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            position: "absolute",
            bottom: "0px",
          }}
        />
      </div>
      <p style={{ color: "white", width: "90px", position: "absolute" }}>
        Damage
      </p>
    </>
  );
};
