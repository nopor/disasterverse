import { FC, useEffect, useRef, useState } from "react";
import {
  Engine,
  EngineOptions,
  Scene,
  SceneOptions,
  UniversalCamera,
  Vector3,
} from "@babylonjs/core";
import { WaterLevel } from "../components/WaterLevel";
import { Counter } from "../components/Counter";
import { EscapeArrow } from "../components/EscapeArrow";
import { Meter } from "../components/Meter";

const instructions = ["Almost there!", "Hurry up!", "Follow the arrow to exit"];

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

  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(secondsLeft);
      if (secondsLeft > 0) {
        setSecondsLeft(secondsLeft - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

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
    const camera = new UniversalCamera(
      "UniversalCamera",
      new Vector3(0, 1, 0),
      scene
    );
    camera.setTarget(Vector3.Zero());
    // camera.applyGravity = true;
    camera.ellipsoid = new Vector3(1, 1.5, 1);
    camera.checkCollisions = true;
    camera.attachControl(canvas, true);
    camera.speed = 0.5;
    camera.keysUp.push(87);
    camera.keysDown.push(83);
    camera.keysRight.push(68);
    camera.keysLeft.push(65);
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
    <div style={{ height: "100vh", width: "100%", overflow: "hidden" }}>
      <canvas ref={reactCanvas} {...rest} />;
      <div
        id="hud-top"
        style={{
          position: "absolute",
          top: "0px",
          left: "10px",
          alignItems: "center",
        }}
      >
        <Counter secondsLeft={secondsLeft} />
      </div>
      <div
        id="hud-top-center"
        style={{
          position: "absolute",
          top: "90px",
          left: "10px",
          margin: "auto",
        }}
      >
        <p
          className="text-glow pulse"
          style={{
            color: "rgb(124, 251, 255)",
            fontSize: "1em",
            paddingLeft: "10px",
          }}
        >
          {instructions[secondsLeft < 10 ? 0 : secondsLeft < 30 ? 1 : 2]}
        </p>
      </div>
      <div
        id="hud-bottom"
        style={{
          position: "absolute",
          top: "60px",
          left: "10px",
          alignItems: "center",
        }}
      >
        <p
          className="text-glow"
          style={{
            fontSize: "1em",
            paddingLeft: "10px",
            color: "gray",
          }}
        >
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
          <span style={{ fontSize: "1.2em" }}>⛰️</span>
          <span
            className="text-glow"
            style={{
              color: "white",
              fontSize: "1.5em",
              paddingLeft: "5px",
            }}
          >
            {" "}
            94 m
          </span>
        </p>
      </div>
      <div
        id="hud-right"
        style={{
          position: "absolute",
          top: "40px",
          right: "10px",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <p>
          <span style={{ fontSize: "1.2em" }}></span>
          <span
            className="text-glow"
            style={{
              color: "white",
              fontSize: "0.8em",
              paddingLeft: "5px",
            }}
          >
            📍 lat: 47.37691, lon: 8.54173
          </span>
        </p>
      </div>
      <div
        id="hud-right"
        style={{
          height: "200px",
          position: "absolute",
          bottom: "0px",
          right: "10px",
        }}
      >
        <WaterLevel percentage={55} />
      </div>
      <div
        id="hud-left"
        style={{
          position: "absolute",
          bottom: "50px",
          left: "20px",
        }}
      >
        <Meter percentage={((60 - secondsLeft) / 100 / 60) * 100} />
      </div>
      <div style={{ overflow: "hidden" }}>
        <div
          id="hud-top-bottom"
          style={{
            position: "absolute",
            bottom: "15px",
            left: "15px",
            right: "0",
            textAlign: "center",
            height: "10px",
            rotate: "90deg",
          }}
        >
          <EscapeArrow />
        </div>
      </div>
    </div>
  );
};
