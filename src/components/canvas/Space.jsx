import React, { Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

const Space = ({ isMobile, rotationValue }) => {
  const space = useGLTF("./space-shuttle/scene.gltf");

  useFrame(() => {
    space.scene.rotation.y += (rotationValue - space.scene.rotation.y) * 0.1;
  });

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight
        position={isMobile ? [-10, 50, 10] : [-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      <primitive
        object={space.scene}
        scale={isMobile ? 0.07 : 0.25}
        position={isMobile ? [0, -0.5, -1.5] : [1, -1.4, 0]}
      />
    </mesh>
  );
};

const SpaceCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [rotationValue, setRotationValue] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleMove = (e) => {
      const xPosition = e.touches ? e.touches[0].clientX : e.clientX;
      const normalizedRotation = ((xPosition / window.innerWidth) - 0.5) * Math.PI;
      setRotationValue(normalizedRotation);
    };

    if (isMobile) {
      window.addEventListener("touchmove", handleMove, { passive: true });
      window.addEventListener("touchstart", handleMove, { passive: true });
    } else {
      window.addEventListener("mousemove", handleMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchstart", handleMove);
    };
  }, [isMobile]);

  return (
    <Canvas
      frameLoop="demand"
      shadows
      camera={{
        position: isMobile ? [0, 0, 5] : [20, 3, 5],
        fov: isMobile ? 50 : 25,
        near: 0.1,
        far: 200
      }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Space isMobile={isMobile} rotationValue={rotationValue} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default SpaceCanvas;