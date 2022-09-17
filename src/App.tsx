import {
  Scene,
  SceneLoader,
  // AbstractMesh,
  PhysicsImpostor,
} from "@babylonjs/core";
import "./App.css";
import { BasicScene } from "./Scene/BasicScene";
// import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { } from "@babylonjs/loaders";
import { ARScene } from "./Scene/ArScene";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// let box: Mesh;

// let importedBox: AbstractMesh;

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
      meshes[0].physicsImpostor = new PhysicsImpostor(meshes[0], PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.1, restitution: 0.8 }, scene);

      meshes[0].checkCollisions = true;
      console.log("done");
    }
  );
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene: Scene) => {
  // if (box && importedBox) {
  //   var deltaTimeInMillis = scene.getEngine().getDeltaTime();

  //   const rpm = 10;
  //   box.rotation.z += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  //   // importedBox.rotation.z -= (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  //   importedBox.rotate(
  //     Vector3.Up(),
  //     (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000)
  //   );
  // }
};

const App = () => (
  <Router>
    <Routes>
      <Route
        element={<BasicScene onSceneReady={onSceneReady} onRender={onRender} />}
        path="/"
      ></Route>
      <Route
        path="/ar"
        element={<ARScene onSceneReady={onSceneReady} onRender={onRender} />}
      ></Route>
    </Routes>
  </Router>
);

export default App;
