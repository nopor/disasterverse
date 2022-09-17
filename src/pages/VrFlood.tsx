import { FC } from "react";
import {
  Scene,
  SceneLoader,
  AbstractMesh,
  PhysicsImpostor,
  MeshBuilder,
  Mesh,
  Vector2,
  Texture,
  Color3,
  StandardMaterial,
  Tools,
  Material,
} from "@babylonjs/core";
import { BasicScene } from "../Scene/BasicScene";
import { WaterMaterial } from "@babylonjs/materials";

export const VrFlood: FC = () => {

  // let box: Mesh;

  let importedBuildings: AbstractMesh[] = [];

  let flood: Mesh;
  let buildingLoaded = false;

  const onSceneReady = (scene: Scene) => {
    // const canvas = scene.getEngine().getRenderingCanvas();
    // Our built-in 'box' shape.
    // box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

    // Move the box upward 1/2 its height
    // box.position.y = 1;

    // Our built-in 'ground' shape.
    // MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

    // SceneLoader.ImportMesh(
    //   "",
    //   `${process.env.PUBLIC_URL}/assets/test_cube.glb`,
    //   "",
    //   scene,
    //   (meshes: AbstractMesh[]) => {
    //     importedBox = meshes[0];
    //     importedBox.position.x = 3;
    //     importedBox.position.y = 1;
    //   }
    // );
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
        }
        buildingLoaded = true;
      }
    );

    const skybox = MeshBuilder.CreateSphere("sky", { diameter: 600 }, scene);
    const skyboxMaterial = new StandardMaterial("sky", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.diffuseTexture = new Texture(`${process.env.PUBLIC_URL}/textures/skycube.jpg`, scene);
    skyboxMaterial.specularTexture = new Texture(`${process.env.PUBLIC_URL}/textures/skycube.jpg`, scene);
    skyboxMaterial.emissiveTexture = new Texture(`${process.env.PUBLIC_URL}/textures/skycube.jpg`, scene);
    skyboxMaterial.ambientTexture = new Texture(`${process.env.PUBLIC_URL}/textures/skycube.jpg`, scene);
    skyboxMaterial.emissiveColor = new Color3(255, 255, 255);
    skybox.material = skyboxMaterial;
    skybox.checkCollisions = true;

    const defaultPlane = MeshBuilder.CreateGround('ground', { height: 750, width: 750 }, scene);
    defaultPlane.checkCollisions = true;
    defaultPlane.position.y = 4;
    const invisilbeMat = new Material('inv', scene);
    invisilbeMat.alpha = 1;
    defaultPlane.material = invisilbeMat;
    // defaultPlane.rotation.x = Tools.ToRadians(0.5);

    const waterMat = new WaterMaterial("water", scene);
    waterMat.bumpTexture = new Texture(`${process.env.PUBLIC_URL}/textures/waterbump.png`, scene);
    waterMat.windForce = -15;
    waterMat.waveHeight = .7;
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
    for(let importedBuilding of importedBuildings) {
      waterMat.addToRenderList(importedBuilding);
    }


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
      var deltaTimeInMillis = scene.getEngine().getDeltaTime();

      const rpm = 5;
      if (buildingLoaded && flood.position.y < 5) {
        flood.position.y += (rpm / 60) * (deltaTimeInMillis / 1000);
      }
      // box.rotation.z += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
      // // importedBox.rotation.z -= (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
      // importedBox.rotate(
      //   Vector3.Up(),
      //   (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000)
      // );
    }
  };
  return (<BasicScene onSceneReady={onSceneReady} onRender={onRender} />)
}