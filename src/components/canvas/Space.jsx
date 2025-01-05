import React, { Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Space = ({ isMobile, mousePosition, touchPosition }) => {
  const space = useGLTF("./space-shuttle/scene.gltf");

  // Rotation logic with smoothing (only horizontal rotation)
  useFrame(() => {
    const rotationValue = isMobile ? touchPosition : mousePosition; // Use touchPosition for mobile
    space.scene.rotation.y = space.scene.rotation.y + (rotationValue - space.scene.rotation.y) * 0.1; // Smooth horizontal rotation
  });

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight
        position={isMobile ? [-10, 30, 5] : [-20, 50, 10]} // Adjusted for mobile
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={isMobile ? 0.7 : 1} /> {/* Adjust point light for mobile */}
      <primitive
        object={space.scene}
        scale={isMobile ? 0.3 : 0.25} // Even smaller scale for mobile
        position={isMobile ? [-2, -1, -2.2] : [1, -1.4, 0]} // Adjusted position for mobile
        rotation={[0, 0, 0]} // Initial rotation (will be updated dynamically)
      />
    </mesh>
  );
};

const SpaceCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [mousePosition, setMousePosition] = useState(0);
  const [touchPosition, setTouchPosition] = useState(0);

  useEffect(() => {
    // Handle screen size change for mobile
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  useEffect(() => {
    // Handle mouse move to change rotation based on cursor position (desktop)
    const handleMouseMove = (e) => {
      const mouseX = (e.clientX / window.innerWidth) * Math.PI * 2; // Left-right rotation (horizontal)
      setMousePosition(mouseX);
    };

    // Handle touch move to change rotation based on touch position (mobile)
    const handleTouchMove = (e) => {
      const touchX = (e.touches[0].clientX / window.innerWidth) * Math.PI * 2; // Left-right rotation (horizontal)
      setTouchPosition(touchX);
    };

    if (isMobile) {
      window.addEventListener("touchmove", handleTouchMove);
    } else {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isMobile]);

  return (
    <Canvas
      frameloop="demand"
      shadows
      dpr={[1, 2]}
      camera={{
        position: isMobile ? [6, 3, 4] : [20, 3, 5], // Adjust camera position for mobile
        fov: isMobile ? 30 : 25, // Adjust FOV for mobile to make it more compact
      }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false} // Disable zoom
          enablePan={false} // Disable panning
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Space isMobile={isMobile} mousePosition={mousePosition} touchPosition={touchPosition} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default SpaceCanvas;
