import React from "react";
import { FreeCamera, Vector3, HemisphericLight, MeshBuilder, Scene, SceneLoader, AbstractMesh } from "@babylonjs/core";
import "./App.css";
import { BasicScene } from "./Scene/BasicScene";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import {} from "@babylonjs/loaders";

let box: Mesh;

let importedBox: AbstractMesh;

const onSceneReady = (scene: Scene) => {
  // This creates and positions a free camera (non-mesh)
  var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());

  const canvas = scene.getEngine().getRenderingCanvas();

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'box' shape.
  box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

  // Move the box upward 1/2 its height
  box.position.y = 1;

  // Our built-in 'ground' shape.
  // MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

  SceneLoader.ImportMesh("", `${process.env.PUBLIC_URL}/assets/test_cube.glb`, "", scene, (meshes: AbstractMesh[]) => {
    importedBox = meshes[0];
    importedBox.position.x = 3;
    importedBox.position.y = 1;
  });
  SceneLoader.ImportMesh("", `${process.env.PUBLIC_URL}/assets/water.glb`, "", scene, () => {
    console.log('done');
  });
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene: Scene) => {
  if (box && importedBox) {
    var deltaTimeInMillis = scene.getEngine().getDeltaTime();

    const rpm = 10;
    box.rotation.z += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    // importedBox.rotation.z -= (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    importedBox.rotate(Vector3.Up(), (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000));
  }
};

const App = () => (
  <div>
    <BasicScene onSceneReady={onSceneReady} onRender={onRender} />
  </div>
);

export default App;
