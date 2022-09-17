import { FC } from "react";
import {
  Scene,
  MeshBuilder,
  Mesh,
  Texture,
  Color3,
  Material,
  SceneLoader,
  PhysicsImpostor,
  Tools,
  AbstractMesh,
  CubeTexture,
  KeyboardInfo,
  Vector3,
} from "@babylonjs/core";
import { BasicScene } from "../Scene/BasicScene";
import { LavaMaterial } from "@babylonjs/materials";
import { MAX_LAVA_LEVEL, LAVA_RISING_SPEED } from "../util/values";

let nextUpdate = 0;
let waterRising = false;
const skyBoxTex = `${process.env.PUBLIC_URL}/textures/environment.env`;
export const LavaScene: FC<{
  setWaterLevel: (level: number) => void
}> = ({ setWaterLevel }) => {

  let importedBuildings: AbstractMesh[] = [];

  let flood: Mesh;
  let buildingLoaded = false;

  const onSceneReady = (scene: Scene) => {
    const texture = new CubeTexture(skyBoxTex, scene);
    scene.createDefaultSkybox(texture, false, 1000);

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

    // const waterMat = new WaterMaterial("water", scene);
    // waterMat.bumpTexture = new Texture(`${process.env.PUBLIC_URL}/textures/waterbump.png`, scene);
    // waterMat.windForce = -5;
    // waterMat.waveHeight = 1.2;
    // waterMat.waveSpeed = .7;
    // waterMat.windDirection = new Vector2(1, 1);
    // // waterMat.fogEnabled = true;
    // // waterMat.waterColor = new Color3(0.1, 0.3, 0.4); // flood-water color
    // waterMat.waterColor = new Color3(0.8, 0.1, 0.1); // red-ish
    // // waterMat.waterColor = new Color3(0.1, 0.9, 0.1); // radioactive
    // waterMat.colorBlendFactor = 0.7;
    // waterMat.bumpHeight = 0.1;
    // waterMat.waveLength = 0.1;
    // waterMat.addToRenderList(skybox);

    var lavaMaterial = new LavaMaterial("lava", scene);	
    lavaMaterial.noiseTexture = new Texture(`${process.env.PUBLIC_URL}/textures/cloud.png`, scene); // Set the bump texture
    lavaMaterial.diffuseTexture = new Texture(`${process.env.PUBLIC_URL}/textures/lavatile.jpg`, scene); // Set the diffuse texture
    lavaMaterial.speed = .5;
    lavaMaterial.fogColor = new Color3(1, 0, 0);
  

    SceneLoader.ImportMesh(
      "",
      `${process.env.PUBLIC_URL}/assets/office_01.glb`,
      "",
      scene,
      (meshes) => {
        for (let importedMesh of meshes) {
          importedMesh.physicsImpostor = new PhysicsImpostor(meshes[0], PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.1, restitution: 0.8 }, scene);
          importedMesh.checkCollisions = true;
          importedMesh.rotation.x = Tools.ToRadians(0.5);
          importedMesh.position.y = 2;
          importedMesh.scaling = new Vector3(5,5,5);
          importedBuildings.push(importedMesh);
          // waterMat.addToRenderList(importedMesh);
        }
        buildingLoaded = true;
      }
    );

    // flood = MeshBuilder.CreateGround('flood', { width: 600, height: 600 }, scene);
    flood = Mesh.CreateGround("ground", 1000, 1000, 400, scene);
    // flood.position = new Vector3(0,10,0);
    // flood.translate(new Vector3(0,8,0), 1);
    // flood.position.set(0, 8, 0);
    // flood.translate(new Vector3(0,1,0), 8, Space.WORLD);
    // flood.position.y = 9;
    // flood.rotation.x = Tools.ToRadians(90);
    flood.material = lavaMaterial;
  };

  /**
   * Will run on every frame render.  We are spinning the box on y-axis.
   */
  const onRender = (scene: Scene) => {
    if (flood) {
      if (buildingLoaded && waterRising && flood.position.y < MAX_LAVA_LEVEL) {
        const deltaTimeInMillis = scene.getEngine().getDeltaTime();
        flood.position.y += LAVA_RISING_SPEED * (deltaTimeInMillis / 1000);
        nextUpdate -= deltaTimeInMillis;
        if(nextUpdate <= 0) {
          nextUpdate = 2000;
          setWaterLevel(Math.min(flood.position.y / MAX_LAVA_LEVEL * 100, 100));
        }
      }
    }
  };
  return (
    <BasicScene onSceneReady={onSceneReady} onRender={onRender} />
  );
}