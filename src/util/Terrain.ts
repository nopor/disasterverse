import { Scene } from "@babylonjs/core";
const BABYLON = require("Extensions");

const BuildTerrain = (scene: Scene) => {
  // const mapCoords = [some_big_flat_array_of_coordinates];
  const mapSubX = 100;
  const mapSubZ = 100;
  const mapData = new Float32Array(mapSubX * mapSubZ * 3);
  for (let l = 0; l < mapSubZ; l++) {
    for (let w = 0; w < mapSubX; w++) {
      mapData[3 * (l * mapSubX + w)] = (w - mapSubX * 0.5) * 2.0;
      mapData[3 * (l * mapSubX + w) + 1] = w / (l + 1) * Math.sin(l / 2) * Math.cos(w / 2) * 2.0;
      mapData[3 * (l * mapSubX + w) + 2] = (l - mapSubZ * 0.5) * 2.0;
    }
  }
  const mapWidthPointNb = 2000;     // 2000 points in the map width
  const mapHeightPointNb = 1000;    // 1000 points in the map height
  const terrainSub = 100;           // the terrain wil be 100x100 vertices only
  const mapParams = {
    mapData,
    mapSubX: mapWidthPointNb,
    mapSubZ: mapHeightPointNb,
    terrainSub: terrainSub
  };

  const terrain = BABYLON.DynamicTerrain("terrain", mapParams, scene);
  const terrainMesh = terrain.mesh;

  // terrainMesh.diffuseTexture = myNiceTexture;
  
  terrain.LODLimits = [4, 3, 2, 1, 1];
}
