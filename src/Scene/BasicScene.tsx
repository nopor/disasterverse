import { FC, useEffect, useRef } from "react";
import { Color3, DeviceOrientationCamera, Engine, EngineOptions, HemisphericLight, Scene, SceneOptions, UniversalCamera, Vector3 } from "@babylonjs/core";

// @ts-ignore
// import * as Ammo from 'ammo.js';

type BasicSceneProps = {
  antialias?: boolean,
  engineOptions?: EngineOptions,
  adaptToDeviceRatio?: boolean,
  sceneOptions?: SceneOptions,
  onRender?: (scene: Scene) => void,
  onSceneReady?: (scene: Scene) => void
}
export const BasicScene: FC<BasicSceneProps> =
  ({ antialias = true, engineOptions, adaptToDeviceRatio = false, sceneOptions, onRender, onSceneReady, ...rest }) => {
    const reactCanvas = useRef(null);

    // set up basic engine and scene
    useEffect(() => {
      (async function() {

        const { current: canvas } = reactCanvas;

        if (!canvas) return;

        const engine = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio);
        const scene = new Scene(engine, sceneOptions);
        // @ts-ignore
        
        const camera = new UniversalCamera("UniversalCamera", new Vector3(120, 20, 100), scene);
        camera.setTarget(Vector3.Zero());
        camera.applyGravity = true;
        camera.ellipsoid = new Vector3(1, 1.5, 1);
        camera.checkCollisions = true;
        camera.attachControl(canvas, true);
        camera.speed = 0.5;
        camera.keysUp.push(87);
        camera.keysDown.push(83);
        camera.keysRight.push(68);
        camera.keysLeft.push(65);

        let isLocked = false;

        // On click event, request pointer lock
        scene.onPointerDown = function (evt) {

          //true/false check if we're locked, faster than checking pointerlock on each single click.
          if (!isLocked) {
            // @ts-ignore
            canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
            // @ts-ignore
            if (canvas.requestPointerLock) {
              // @ts-ignore
              canvas.requestPointerLock();
            }
          }

        };
        const xr = await scene.createDefaultXRExperienceAsync();
        xr.input.onControllerAddedObservable.add(() => {
          xr.teleportation.teleportationEnabled = true;
          const vrCamera = new DeviceOrientationCamera("DevOr_camera", new Vector3(120, 20, 100), scene);
          vrCamera.setTarget(Vector3.Zero());
          vrCamera.attachControl(canvas, true);
          scene.activeCamera = vrCamera;
        });

        scene.gravity = new Vector3(0, -.75, 0);

        scene.ambientColor = new Color3(220, 240, 250);
        scene.collisionsEnabled = true;

        const light = new HemisphericLight("light", new Vector3(0, 30, 0), scene);
        light.intensity = 1;




        if (typeof onSceneReady === "function") {
          scene.enablePhysics();
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
    }, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady]);

    return <canvas ref={reactCanvas} {...rest} />;
  };
