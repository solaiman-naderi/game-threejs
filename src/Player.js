import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRapier, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Player() {
  const [subscribeKey, getKeys] = useKeyboardControls();
  const [smoothCameraPosition] = useState(new THREE.Vector3(100, 100, -100));
  const [smoothCameraTarget] = useState(new THREE.Vector3());
  const body = useRef();

  const jump = () => {
    if (body.current && body.current.translation().y < 0.3134491741657257) {
      body.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
    }
  };

  useEffect(
    () =>
      subscribeKey(
        (state) => state.jump,
        (value) => {
          if (value) {
            jump();
          }
        }
      ),
    []
  );
  useFrame((state, delta) => {
    if (body.current) {
      const { forward, backward, leftward, rightward, jump } = getKeys();

      const impulse = { x: 0, y: 0, z: 0 };
      const torque = { x: 0, y: 0, z: 0 };

      const impulseStrength = 0.6 * delta;
      const torqueStrength = 0.2 * delta;

      if (forward) {
        impulse.z -= impulseStrength;
        torque.x -= torqueStrength;
      }

      if (backward) {
        impulse.z += impulseStrength;
        torque.x += torqueStrength;
      }

      if (rightward) {
        impulse.x += impulseStrength;
        torque.z -= torqueStrength;
      }

      if (leftward) {
        impulse.x -= impulseStrength;
        torque.z += torqueStrength;
      }

      body.current?.applyImpulse(impulse);
      body.current?.applyTorqueImpulse(torque);

      // Camera

      const bodyPosition = body.current.translation();

      const cameraPosition = new THREE.Vector3();
      cameraPosition.copy(bodyPosition);
      cameraPosition.y += 0.4;
      cameraPosition.z += 2.1;

      const cameraTarget = new THREE.Vector3();
      cameraTarget.copy(bodyPosition);
      cameraTarget.y += 0.11;
      cameraTarget.z -= 6;

      smoothCameraPosition.lerp(cameraPosition, 5 * delta);
      smoothCameraTarget.lerp(cameraTarget, 5 * delta);

      state.camera.position.copy(smoothCameraPosition);
      state.camera.lookAt(smoothCameraTarget);
    }
  });
  return (
    <RigidBody
      colliders="ball"
      restitution={0.2}
      friction={1}
      position={[0, 1, 4]}
      ref={body}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color={"mediumpurple"} />
      </mesh>
    </RigidBody>
  );
}
