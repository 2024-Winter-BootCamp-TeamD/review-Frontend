import React, { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const WarpEffect = () => {
  const linesRef = useRef();

  useEffect(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const numLines = 1300;

    for (let i = 0; i < numLines; i++) {
      const x = (Math.random() - 0.5) * 10000;
      const y = Math.random() * 100000;
      const z = (Math.random() - 0.5) * 10000;
      positions.push(x, y, z, x, y - 18000, z);

      const color = new THREE.Color(Math.random(), Math.random(), Math.random());
      colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    linesRef.current.geometry = geometry;
  }, []);

  useFrame((state, delta) => {
    if (state.camera.position.y > 0) {
      state.camera.position.y -= 75000 * delta;
    }
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry />
      <lineBasicMaterial vertexColors />
    </lineSegments>
  );
};

export default function WarpScreen() {
  return (
    <Canvas
      camera={{ position: [0, 100000, 0], up: [0, 0, 1], far: 100000 }}
      style={{ position: "absolute", width: "100vw", height: "100vh", backgroundColor: "#000" }}
    >
      <EffectComposer>
        <Bloom intensity={2} mipmapBlur luminanceThreshold={0.55} luminanceSmoothing={0} />
      </EffectComposer>
      <ambientLight intensity={15} />
      <WarpEffect />
    </Canvas>
  );
}
