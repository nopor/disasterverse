import { FC, useEffect, useRef } from "react";
import { Color3, Engine, EngineOptions, HemisphericLight, MeshBuilder, Scene, SceneOptions, StandardMaterial, Texture, UniversalCamera, Vector3 } from "@babylonjs/core";

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
      const { current: canvas } = reactCanvas;

      if (!canvas) return;

      const engine = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio);
      const scene = new Scene(engine, sceneOptions);

      const gravityVector = new Vector3(0, -.75, 0);
      // const physicsPlugin = new OimoJSPlugin();

      scene.enablePhysics(gravityVector);


      scene.ambientColor = new Color3(220, 240, 250);
      scene.collisionsEnabled = true;

      const light = new HemisphericLight("light", new Vector3(0, 30, 0), scene);
      light.intensity = 1;


      const skybox = MeshBuilder.CreateSphere("sky", { diameter: 600 }, scene);
      const skyboxMaterial = new StandardMaterial("sky", scene);
      skyboxMaterial.backFaceCulling = false;
      skyboxMaterial.diffuseTexture = new Texture(`${process.env.PUBLIC_URL}/textures/skycube.jpg`, scene);
      skyboxMaterial.specularTexture = new Texture(`${process.env.PUBLIC_URL}/textures/skycube.jpg`, scene);
      skyboxMaterial.emissiveTexture = new Texture(`${process.env.PUBLIC_URL}/textures/skycube.jpg`, scene);
      skyboxMaterial.ambientTexture = new Texture(`${process.env.PUBLIC_URL}/textures/skycube.jpg`, scene);

      // skyboxMaterial.reflectionTexture = new CubeTexture(`${process.env.PUBLIC_URL}/textures/skycube.jpg`, scene);
      // skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
      skyboxMaterial.emissiveColor = new Color3(255, 255, 255);
      skybox.material = skyboxMaterial;
      skybox.checkCollisions = true;

      const defaultPlane = MeshBuilder.CreateGround('ground', { height: 300, width: 300 }, scene);
      defaultPlane.checkCollisions = true;
      defaultPlane.position.y = 5;
      // defaultPlane.rotate(new Vector3(0, 1,0), 90);

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
    }, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady]);

    return <canvas ref={reactCanvas} {...rest} />;
  };
