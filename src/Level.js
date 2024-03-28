import * as THREE from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useState } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { useLayoutEffect } from "react";
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
  const group = useRef();
  const modelRef = useRef();

  const { scene, animations } = useGLTF("/models/man.gltf");
  const { names, actions } = useAnimations(animations, group);
  useEffect(() => {
    scene.children.forEach((item) => {
      item.castShadow = true;
    });
  }, []);
  useEffect(() => {
    actions[names[1]].reset().fadeIn(0.5).play();
  }, [names]);
  return (
    <group receiveShadow dispose={null} ref={modelRef} position={position}>
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={material}
        scale={[4, 0.2, 4]}
        position={[0, -0.1, 0]}
      />
      <RigidBody type="fixed" colliders="hull" restitution={0.2} friction={0}>
        <primitive ref={group} object={scene} scale={3} />
      </RigidBody>
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

function Walls({ length = 1 }) {
  return (
    <>
      <RigidBody type="fixed" restitution={0.2} friction={0}>
        <mesh
          position={[2.15, 0.75, -10]}
          geometry={boxGeometry}
          material={floorMaterialGenerator("red")}
          scale={[0.3, 1.5, 32]}
          castShadow
        />

        <mesh
          position={[-2.15, 0.75, -10]}
          geometry={boxGeometry}
          material={floorMaterialGenerator("red")}
          scale={[0.3, 1.5, 32]}
          receiveShadow
        />

        <mesh
          position={[0, 0.75, -26]}
          geometry={boxGeometry}
          material={floorMaterialGenerator("red")}
          scale={[4, 1.5, 0.3]}
          receiveShadow
        />
        <CuboidCollider
          args={[2, 0.1, 16]}
          position={[0, -0.1, -10]}
          restitution={0.2}
          friction={1}
        />
      </RigidBody>
    </>
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
      <BlockSpinner
        material={floorMaterialGenerator("blue")}
        position={[0, 0, -12]}
        scale={[3.5, 0.3, 0.3]}
        animateType="rotation"
      />

      <BlockSpinner
        material={floorMaterialGenerator("blue")}
        position={[0, 0, -16]}
        scale={[1.5, 1.5, 0.3]}
        animateType="position-x"
      />

      <BlockSpinner
        material={floorMaterialGenerator("blue")}
        position={[0, 0, -20]}
        scale={[1.5, 0.2, 0.3]}
        animateType="position-y"
      />
      <BlockEnd
        position={[0, 0, -24]}
        material={floorMaterialGenerator("limegreen")}
      />

      <Walls />
    </>
  );
}
