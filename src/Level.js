import * as THREE from "three";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

function floorMaterialGenerator(color = "limegreen") {
  return new THREE.MeshStandardMaterial({ color });
}

function blobMaterialGenerator(color = "yellow") {
  return new THREE.MeshStandardMaterial({ color });
}

function BlockStart({ position = [0, 0, 0], material = {} }) {
  return (
    <group position={position}>
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={material}
        scale={[4, 0.2, 4]}
        position={[0, -0.1, 0]}
      />
    </group>
  );
}

function BlockSpinner({ position = [0, 0, 0], material = {} }) {
  return (
    <group position={position}>
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={material}
        scale={[4, 0.2, 4]}
        position={[0, -0.1, 0]}
      />
      <mesh
        geometry={boxGeometry}
        material={blobMaterialGenerator()}
        position={[0, 0, 0]}
        scale={[3.5, 0.3, 0.3]}
        castShadow
        receiveShadow
      />
    </group>
  );
}

export default function () {
  return (
    <>
      <BlockStart />
      <BlockStart material={floorMaterialGenerator()} position={[0, 0, 4]} />
      <BlockSpinner
        material={floorMaterialGenerator("red")}
        position={[0, 0, 0]}
      />
    </>
  );
}
