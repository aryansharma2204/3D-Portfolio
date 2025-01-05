import React, { Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

const Space = ({ isMobile, rotationValue }) => {
  const space = useGLTF("./space-shuttle/scene.gltf");

  // Only rotate on Y axis (horizontal)
  useFrame(() => {
    space.scene.rotation.y = rotationValue;
  });

  // Responsive values based on screen size
  const getScale = () => isMobile ? 0.2 : 0.25;
  const getPosition = () => isMobile ? [-1.5, -1, -2.2] : [1, -1.4, 0];

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight
        position={isMobile ? [-10, 30, 5] : [-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={isMobile ? 0.7 : 1} />
      <primitive
        object={space.scene}
        scale={getScale()}
        position={getPosition()}
      />
    </mesh>
  );
};

const SpaceCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [rotationValue, setRotationValue] = useState(0);

  useEffect(() => {
    // Check for mobile device
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  useEffect(() => {
    const handleMove = (e) => {
      // Get X coordinate from either mouse or touch event
      const xPosition = e.touches ? e.touches[0].clientX : e.clientX;
      
      // Convert x position to rotation value (0 to 2π)
      const normalizedRotation = (xPosition / window.innerWidth) * Math.PI * 2;
      
      // Apply smooth transition
      setRotationValue(current => {
        const diff = normalizedRotation - current;
        return current + diff * 0.1;
      });
    };

    // Add appropriate event listener based on device type
    if (isMobile) {
      window.addEventListener("touchmove", handleMove);
    } else {
      window.addEventListener("mousemove", handleMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
    };
  }, [isMobile]);

  return (
    <Canvas
      frameloop="demand"
      shadows
      camera={{
        position: isMobile ? [4, 2, 3] : [20, 3, 5],
        fov: isMobile ? 35 : 25,
      }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}  // Disable OrbitControls rotation
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