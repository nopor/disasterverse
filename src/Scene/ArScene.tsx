import { FC, useEffect, useRef } from "react";
import { Engine, EngineOptions, Scene, SceneOptions } from "@babylonjs/core";
import { WaterLevel } from "../components/WaterLevel";

type ARSceneProps = {
  antialias?: boolean;
  engineOptions?: EngineOptions;
  adaptToDeviceRatio?: boolean;
  sceneOptions?: SceneOptions;
  onRender?: (scene: Scene) => void;
  onSceneReady?: (scene: Scene) => void;
};
export const ARScene: FC<ARSceneProps> = ({
  antialias = true,
  engineOptions,
  adaptToDeviceRatio = false,
  sceneOptions,
  onRender,
  onSceneReady,
  ...rest
}) => {
  const reactCanvas = useRef(null);

  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;

    const engine = new Engine(
      canvas,
      antialias,
      engineOptions,
      adaptToDeviceRatio
    );
    const scene = new Scene(engine, sceneOptions);
    if (typeof onSceneReady === "function") {
      if (scene.isReady()) {
        onSceneReady(scene);
      } else {
        scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
      }
    }

    engine.runRenderLoop(() => {
      if (typeof onRender === "function") onRender(scene);
      scene.render();
    });

    const resize = () => {
      scene.getEngine().resize();
    };

    if (window) {
      window.addEventListener("resize", resize);
    }

    return () => {
      scene.getEngine().dispose();

      if (window) {
        window.removeEventListener("resize", resize);
      }
    };
  }, [
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady,
  ]);

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <canvas ref={reactCanvas} {...rest} />;
      <div
        id="hud-top"
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <p style={{ color: "white", fontSize: "1.2em", paddingLeft: "10px" }}>
          👤 12 Users online
        </p>
      </div>
      <div
        id="hud-right"
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <p>
          <span style={{ fontSize: "1.2em" }}>🌡️</span>
          <span
            style={{
              color: "white",
              fontSize: "1.5em",
              fontWeight: "bold",
              paddingLeft: "5px",
            }}
          >
            {" "}
            21 &#8451;
          </span>
        </p>
      </div>
      <div
        id="hud-right"
        style={{
          height: "200px",
          position: "absolute",
          bottom: "10px",
          right: "10px",
        }}
      >
        <WaterLevel percentage={55} />
      </div>
    </div>
  );
};
