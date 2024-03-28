import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useState } from "react";
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
function BlockEnd({ position = [0, 0, 0], material = {} }) {
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

function BlockSpinner({
  position = [0, 0, 0],
  scale = [3.5, 0.3, 0.3],
  material = {},
  animateType = "rotation",
}) {
  const obstacle = useRef();
  const [speed] = useState(
    (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1)
  );
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (animateType == "rotation") {
      const rotation = new THREE.Quaternion();
      rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
      obstacle.current.setNextKinematicRotation(rotation);
    } else if (animateType == "position-y") {
      const y = Math.sin(time) + 1.15;
      obstacle.current.setNextKinematicTranslation({ x: 0, y, z: position[2] });
    } else if (animateType == "position-x") {
      const x = Math.sin(time);
      obstacle.current.setNextKinematicTranslation({
        x,
        y: 0.9,
        z: position[2],
      });
    }
  });
  return (
    <group position={position}>
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={material}
        scale={[4, 0.2, 4]}
        position={[0, -0.1, 0]}
      />
      <RigidBody
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
        ref={obstacle}
      >
        <mesh
          geometry={boxGeometry}
          material={blobMaterialGenerator()}
          position={[0, 0, 0]}
          scale={scale}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

export default function () {
  return (
    <>
      <BlockStart />
      <BlockStart material={floorMaterialGenerator()} position={[0, 0, 4]} />
      <BlockSpinner
        material={floorMaterialGenerator("blue")}
        position={[0, 0, 0]}
        scale={[3.5, 0.3, 0.3]}
        animateType="rotation"
      />
      <BlockSpinner
        material={floorMaterialGenerator("blue")}
        position={[0, 0, -4]}
        scale={[3.5, 0.3, 0.3]}
        animateType="position-y"
      />

      <BlockSpinner
        material={floorMaterialGenerator("blue")}
        position={[0, 0, -8]}
        scale={[1.5, 1.5, 0.3]}
        animateType="position-x"
      />
      <BlockEnd
        position={[0, 0, -12]}
        material={floorMaterialGenerator("limegreen")}
      />
    </>
  );
}
