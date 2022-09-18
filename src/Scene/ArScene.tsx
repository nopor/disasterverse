import { FC, useEffect, useRef, useState } from "react";
import {
  DeviceOrientationCamera,
  Engine,
  EngineOptions,
  Scene,
  SceneOptions,
  Vector3,
  WebXRCamera,
  WebXRSessionManager,
} from "@babylonjs/core";
import { Counter } from "../components/Counter";
import { EscapeArrow } from "../components/EscapeArrow";
import { Meter } from "../components/Meter";
import { GPS } from "../components/GPS";
import { WaterLevelFixed } from "../components/WaterLevelFixed";

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
}) => {
  const reactCanvas = useRef(null);

  const [secondsLeft, setSecondsLeft] = useState(2220);

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
    (async function () {
      const { current: canvas } = reactCanvas;

      if (!canvas) return;

      const engine = new Engine(
        canvas,
        antialias,
        engineOptions,
        adaptToDeviceRatio
      );
      const scene = new Scene(engine, sceneOptions);
      const sessionManager = new WebXRSessionManager(scene);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const camera = new WebXRCamera("camera", scene, sessionManager);

      const xr = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
          sessionMode: "immersive-ar",
        },
        optionalFeatures: true,
      });
      xr.input.onControllerAddedObservable.add(() => {
        xr.teleportation.teleportationEnabled = true;
        const arCamera = new DeviceOrientationCamera(
          "DevOr_camera",
          new Vector3(120, 20, 100),
          scene
        );
        arCamera.setTarget(Vector3.Zero());
        arCamera.attachControl(canvas, true);
        arCamera.ellipsoid = new Vector3(1, 1.5, 1);
        arCamera.applyGravity = true;
        arCamera.checkCollisions = true;
        // vrCamera.orthoRight
        scene.activeCamera = arCamera;
      });

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
    })();
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
      <video
        id="background-video"
        autoPlay
        loop
        muted
        style={{
          position: "fixed",
          right: 0,
          bottom: 0,
          top: 0,
          left: "-200px",
          minWidth: "100%",
          minHeight: "100%",

          backgroundColor: "transparent",
        }}
      >
        <source
          src={`${process.env.PUBLIC_URL}/assets/ar.mp4`}
          type="video/mp4"
        />
      </video>
      {/*<canvas ref={reactCanvas} {...rest} />;*/}
      <div
        id="hud-top"
        style={{
          position: "absolute",
          top: "-10px",
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
          top: "80px",
          left: "10px",
          margin: "auto",
        }}
      >
        <p
          className="text-glow pulse"
          style={{
            color: "rgb(124, 251, 255)",
            fontSize: "1em",
            margin: "auto",
            width: "100vw",
            marginTop: "50px",
            textAlign: "center",
          }}
        >
          {instructions[secondsLeft < 10 ? 0 : secondsLeft < 1000 ? 1 : 2]}
        </p>
      </div>
      <div
        id="hud-bottom"
        style={{
          position: "absolute",
          top: "40px",
          left: "10px",
          alignItems: "center",
        }}
      >
        <p
          className="text-glow"
          style={{
            fontSize: "0.7em",
            paddingLeft: "10px",
            color: "lightgray",
          }}
        >
          👤 12 Users online
        </p>
      </div>
      <div
        id="hud-right"
        style={{
          position: "absolute",
          top: "-5px",
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
          top: "30px",
          right: "10px",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <GPS />
      </div>
      <div
        id="hud-right"
        style={{
          height: "200px",
          position: "absolute",
          bottom: "0px",
          right: "10px",
          alignItems: "center",
        }}
      >
        <WaterLevelFixed />
      </div>
      <div
        id="hud-bottom-center"
        style={{
          position: "absolute",
          bottom: "10px",
          right: 0,
          left: "calc(100vw / 2 - 50px)",
          margin: "auto",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => alert("Alert help?")}
          style={{
            border: "none",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            borderRadius: "10px",
            color: "white",
            fontSize: "1.2em",
            padding: "0.5em",
            fontFamily: "Orbitron",
            width: "100px",
          }}
        >
          🚨 Help
        </button>
      </div>
      <div
        id="hud-left"
        style={{
          position: "absolute",
          bottom: "50px",
          left: "20px",
        }}
      >
        <Meter percentage={30 / 100} />
      </div>
      <div style={{ overflow: "hidden" }}>
        <div
          id="hud-top-bottom"
          style={{
            position: "absolute",
            bottom: "150px",
            left: "calc(50vw - 30px)",
            right: "0",
            textAlign: "center",
            height: "10px",
            rotate: "90deg",
            width: "70px",
          }}
        >
          <EscapeArrow />
        </div>
      </div>
    </div>
  );
};
