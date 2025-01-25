import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const GalaxyEffect = () => {
  const starsRef = useRef();

  useEffect(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const numStars = 5000;
    const colorOptions = [
      new THREE.Color(1, 0.5, 0.5),
      new THREE.Color(1, 1, 1),
      new THREE.Color(0.5, 0.5, 1),
    ];

    for (let i = 0; i < numStars; i++) {
      const r = Math.sqrt(Math.random()) * 5 + 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI / 2;

      positions.push(r * Math.cos(theta) * Math.cos(phi), r * Math.sin(phi) * 0.5, r * Math.sin(theta) * Math.cos(phi));

      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    starsRef.current.geometry = geometry;
  }, []);

  return (
    <points ref={starsRef}>
      <bufferGeometry />
      <pointsMaterial vertexColors size={0.04} blending={THREE.AdditiveBlending} />
    </points>
  );
};

export default function GalaxyBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8] }}
      style={{ position: "absolute", width: "100vw", height: "100vh", backgroundColor: "#000" }}
    >
      <OrbitControls autoRotate autoRotateSpeed={0.2} />
      <GalaxyEffect />
    </Canvas>
  );
}
