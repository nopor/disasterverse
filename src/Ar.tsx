import {
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Scene,
  AbstractMesh,
} from "@babylonjs/core";
import "./App.css";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import {} from "@babylonjs/loaders";
import { ARScene } from "./Scene/ArScene";

let box: Mesh;

let importedBox: AbstractMesh;

const onSceneReady = (scene: Scene) => {
  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'box' shape.
  box = MeshBuilder.CreateBox("box", { size: 2 }, scene);

  // Move the box upward 1/2 its height
  box.position.y = 1;
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
    importedBox.rotate(
      Vector3.Up(),
      (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000)
    );
  }
};

const App = () => (
  <div>
    <ARScene onSceneReady={onSceneReady} onRender={onRender} />
  </div>
);

export default App;
