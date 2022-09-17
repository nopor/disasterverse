import { FC } from "react";

export const Counter: FC<{ secondsLeft: number }> = ({ secondsLeft }) => {
  const minutesLeft = Math.floor(secondsLeft / 60);
  const remainder = secondsLeft - minutesLeft * 60;
  return (
    <p
      style={{
        color: secondsLeft > 19 ? "white" : "crimson",
        fontSize: "1.5em",
        position: "absolute",
        top: "0px",
        left: "5px",
        width: "150px",
      }}
    >
      🕦 {minutesLeft > 0 && minutesLeft}:{secondsLeft < 10 && "0"}
      {remainder}
    </p>
  );
};
