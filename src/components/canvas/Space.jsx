import React, { Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

const Space = ({ isMobile, mousePosition, touchPosition }) => {
  const space = useGLTF("./space-shuttle/scene.gltf");

  // Enhanced smooth rotation with dynamic sensitivity
  useFrame(() => {
    const rotationValue = isMobile ? touchPosition : mousePosition;
    const sensitivity = isMobile ? 0.05 : 0.1; // Reduced sensitivity for mobile
    space.scene.rotation.y = space.scene.rotation.y + (rotationValue - space.scene.rotation.y) * sensitivity;
  });

  // Calculate responsive values based on screen size
  const getResponsiveValues = () => {
    const width = window.innerWidth;
    // Scale adjustments for different screen sizes
    if (width < 480) { // Extra small devices
      return {
        scale: 0.15,
        position: [-1, -1, -2],
        lightPosition: [-8, 25, 4]
      };
    } else if (width < 768) { // Small devices
      return {
        scale: 0.2,
        position: [-1.2, -1.2, -2.1],
        lightPosition: [-10, 30, 5]
      };
    } else if (width < 1024) { // Medium devices
      return {
        scale: 0.22,
        position: [0, -1.3, -1],
        lightPosition: [-15, 40, 7]
      };
    } else { // Large devices
      return {
        scale: 0.25,
        position: [1, -1.4, 0],
        lightPosition: [-20, 50, 10]
      };
    }
  };

  const responsiveValues = getResponsiveValues();

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight
        position={isMobile ? responsiveValues.lightPosition : [-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={isMobile ? 0.8 : 1} // Slightly adjusted for mobile
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={isMobile ? 0.7 : 1} />
      <primitive
        object={space.scene}
        scale={responsiveValues.scale}
        position={responsiveValues.position}
      />
    </mesh>
  );
};

const SpaceCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [mousePosition, setMousePosition] = useState(0);
  const [touchPosition, setTouchPosition] = useState(0);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    // Enhanced screen size detection
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      setIsMobile(window.innerWidth <= 768); // Updated breakpoint
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Improved touch and mouse handling
    const handleMouseMove = (e) => {
      const mouseX = (e.clientX / screenSize.width) * Math.PI * 2;
      setMousePosition(mouseX);
    };

    const handleTouchMove = (e) => {
      e.preventDefault(); // Prevent scrolling while touching
      const touchX = (e.touches[0].clientX / screenSize.width) * Math.PI * 2;
      setTouchPosition(touchX);
    };

    if (isMobile) {
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchstart", handleTouchMove, { passive: false });
    } else {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchMove);
    };
  }, [isMobile, screenSize]);

  // Calculate responsive camera values
  const getCameraSettings = () => {
    const width = screenSize.width;
    if (width < 480) {
      return { position: [3, 2, 2], fov: 40 };
    } else if (width < 768) {
      return { position: [4, 2, 3], fov: 35 };
    } else if (width < 1024) {
      return { position: [15, 3, 4], fov: 30 };
    } else {
      return { position: [20, 3, 5], fov: 25 };
    }
  };

  const cameraSettings = getCameraSettings();

  return (
    <Canvas
      frameloop="demand"
      shadows
      dpr={[1, Math.min(2, window.devicePixelRatio)]} // Optimize for device pixel ratio
      camera={{
        position: cameraSettings.position,
        fov: cameraSettings.fov,
      }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          dampingFactor={0.05} // Added smooth damping
          rotateSpeed={isMobile ? 0.5 : 1} // Adjusted rotation speed for mobile
        />
        <Space 
          isMobile={isMobile}
          mousePosition={mousePosition}
          touchPosition={touchPosition}
        />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default SpaceCanvas;