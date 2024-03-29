import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRapier, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
export default function Player() {
  const [subscribeKey, getKeys] = useKeyboardControls();
  const body = useRef();

  const jump = () => {
    if (body.current) {
      console.log(body.current);
    }
    body.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
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

    body.current.applyImpulse(impulse);
    body.current.applyTorqueImpulse(torque);
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
