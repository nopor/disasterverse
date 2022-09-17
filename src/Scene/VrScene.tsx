import { FC } from "react";
import {
  Scene,
  MeshBuilder,
  Mesh,
  Vector2,
  Texture,
  Color3,
  Material,
  SceneLoader,
  PhysicsImpostor,
  Tools,
  AbstractMesh,
  CubeTexture,
  KeyboardInfo,
} from "@babylonjs/core";
import { BasicScene } from "../Scene/BasicScene";
import { WaterMaterial } from "@babylonjs/materials";
import { MAX_WATER_LEVEL, WATER_RISING_SPEED } from "../util/values";

let nextUpdate = 0;
let waterRising = false;
const skyBoxTex = `${process.env.PUBLIC_URL}/textures/environment.env`;
export const VrScene: FC<{
  setWaterLevel: (level: number) => void
}> = ({ setWaterLevel }) => {

  let importedBuildings: AbstractMesh[] = [];

  let flood: Mesh;
  let buildingLoaded = false;

  const onSceneReady = (scene: Scene) => {
    const texture = new CubeTexture(skyBoxTex, scene);
    const skybox = scene.createDefaultSkybox(texture, false, 1000);

    scene.onKeyboardObservable.add((ev: KeyboardInfo) => {
        if (ev.event.key === 'r') {
          console.log('water rising')
          waterRising = true;
        }
        if (ev.event.key === 't') {
          console.log('water stopped')
          waterRising = false;
        }
    });

    const defaultPlane = MeshBuilder.CreateGround('ground', { height: 750, width: 750 }, scene);
    defaultPlane.checkCollisions = true;
    defaultPlane.position.y = 5;
    const invisilbeMat = new Material('inv', scene);
    invisilbeMat.alpha = 1;
    defaultPlane.material = invisilbeMat;

    const waterMat = new WaterMaterial("water", scene);
    waterMat.bumpTexture = new Texture(`${process.env.PUBLIC_URL}/textures/waterbump.png`, scene);
    waterMat.windForce = -15;
    waterMat.waveHeight = 1.2;
    waterMat.waveSpeed = 1.2;
    waterMat.windDirection = new Vector2(1, 1);
    waterMat.fogEnabled = true;
    waterMat.waterColor = new Color3(0.1, 0.3, 0.4); // flood-water color
    // waterMat.waterColor = new Color3(0.8, 0.1, 0.1); // red-ish
    // waterMat.waterColor = new Color3(0.1, 0.9, 0.1); // radioactive
    waterMat.colorBlendFactor = 0.7;
    waterMat.bumpHeight = 0.1;
    waterMat.waveLength = 0.1;
    waterMat.addToRenderList(skybox);

    SceneLoader.ImportMesh(
      "",
      `${process.env.PUBLIC_URL}/assets/vorwerk_low.glb`,
      "",
      scene,
      (meshes) => {
        for (let importedMesh of meshes) {
          importedMesh.physicsImpostor = new PhysicsImpostor(meshes[0], PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.1, restitution: 0.8 }, scene);
          importedMesh.checkCollisions = true;
          importedMesh.rotation.x = Tools.ToRadians(0.5);
          importedMesh.position.y = 1;
          importedBuildings.push(importedMesh);
          waterMat.addToRenderList(importedMesh);
        }
        buildingLoaded = true;
      }
    );

    flood = MeshBuilder.CreateGround('flood', { width: 600, height: 600, }, scene);
    // flood.position = new Vector3(0,10,0);
    // flood.translate(new Vector3(0,8,0), 1);
    // flood.position.set(0, 8, 0);
    // flood.translate(new Vector3(0,1,0), 8, Space.WORLD);
    // flood.position.y = 9;
    // flood.rotation.x = Tools.ToRadians(90);
    flood.material = waterMat;
  };

  /**
   * Will run on every frame render.  We are spinning the box on y-axis.
   */
  const onRender = (scene: Scene) => {
    if (flood) {
      if (buildingLoaded && waterRising && flood.position.y < MAX_WATER_LEVEL) {
        const deltaTimeInMillis = scene.getEngine().getDeltaTime();
        flood.position.y += WATER_RISING_SPEED * (deltaTimeInMillis / 1000);
        nextUpdate -= deltaTimeInMillis;
        if(nextUpdate <= 0) {
          nextUpdate = 2000;
          setWaterLevel(Math.min(flood.position.y / MAX_WATER_LEVEL * 100, 100));
        }
      }
    }
  };
  return (
    <BasicScene onSceneReady={onSceneReady} onRender={onRender} />
  );
}