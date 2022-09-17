export const WaterLevelFixed = () => {
  const waterStyle = {
    "--waterlevel": "50%",
  } as React.CSSProperties;

  return (
    <div
      style={{
        overflow: "hidden",
      }}
    >
      <p
        className="text-glow"
        style={{
          color: "white",
          textAlign: "center",
          overflow: "hidden",
          position: "absolute",
          right: "30px",
          bottom: "20px",
        }}
      >
        Water level
      </p>
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          overflow: "hidden",
          rotate: "180deg",
        }}
      >
        <div className="liquid" style={waterStyle}></div>
      </div>
    </div>
  );
};
