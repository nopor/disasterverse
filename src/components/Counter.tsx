import { FC } from "react";

export const Counter: FC<{ secondsLeft: number }> = ({ secondsLeft }) => {
  return (
    <p
      style={{
        color: secondsLeft > 19 ? "white" : "crimson",
        fontSize: "2em",
        position: "absolute",
        top: "0px",
        left: "5px",
        width: "150px",
      }}
    >
      🕦 {secondsLeft} s
    </p>
  );
};