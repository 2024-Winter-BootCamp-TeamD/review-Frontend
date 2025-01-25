import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const GalaxyBackground = ({ isVisible }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!isVisible) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10); // 카메라 위치 조정

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    const mountNode = mountRef.current;
    mountNode.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.1;

    // 🌌 별 생성 (나선형 패턴 + 색상 랜덤화)
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 5000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const colorOptions = [
      new THREE.Color(1, 0.5, 0.5), // 붉은색
      new THREE.Color(1, 1, 1), // 흰색
      new THREE.Color(0.5, 0.5, 1), // 푸른색
    ];

    for (let i = 0; i < starCount; i++) {
      const r = Math.sqrt(Math.random()) * 5 + 2; // 중심에서 점점 퍼지도록 설정
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI / 2; // 은하 평면을 따르는 구조

      positions[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(phi) * 0.5; // 은하의 두께 조정
      positions[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);

      // 랜덤 색상 지정
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // 🌟 별에 Glow 효과 추가
    const starMaterial = new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.07, // 별 크기 조정
      transparent: true,
      opacity: 0.2, // 약간의 투명함 추가
      blending: THREE.AdditiveBlending, // Glow 효과 적용
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const animate = () => {
      requestAnimationFrame(animate);
      stars.rotation.y += 0.0005;
      stars.rotation.x += 0.0003;
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountNode.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [isVisible]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        top: 0,
        left: "30vw",
        width: "100vw",
        height: "100vh",
        display: isVisible ? "block" : "none",
        zIndex: -1,
      }}
    />
  );
};

export default GalaxyBackground;
