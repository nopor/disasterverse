import { Scene } from "@babylonjs/core";
import { FC } from "react";
import { ARScene } from "../Scene/ArScene";

export const Ar: FC = () => {
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
    // SceneLoader.ImportMesh(
    //   "",
    //   `${process.env.PUBLIC_URL}/assets/vorwerk_low.glb`,
    //   "",
    //   scene,
    //   (meshes) => {
    //     meshes[0].physicsImpostor = new PhysicsImpostor(meshes[0], PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.1, restitution: 0.8 }, scene);

    //     meshes[0].checkCollisions = true;
    //     console.log("done");
    //   }
    // );
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
  return (
    <ARScene onSceneReady={onSceneReady} onRender={onRender} />
  )
}