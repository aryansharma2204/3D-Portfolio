import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

const Space = ({ isMobile, rotationValue }) => {
  const space = useGLTF("./space-shuttle/scene.gltf");
  
  useFrame(() => {
    // Limit rotation range for mobile to keep object in view
    if (isMobile) {
      const minRotation = -Math.PI / 4; // -45 degrees
      const maxRotation = Math.PI / 4;  // +45 degrees
      space.scene.rotation.y = Math.max(minRotation, Math.min(maxRotation, rotationValue));
    } else {
      space.scene.rotation.y = rotationValue;
    }
  });

  // Adjusted scale and position for better mobile visibility
  const getScale = () => isMobile ? 0.15 : 0.25;
  const getPosition = () => isMobile ? [0, -0.5, -2] : [1, -1.4, 0];

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight
        position={isMobile ? [-5, 25, 5] : [-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={isMobile ? 1.2 : 1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={isMobile ? 0.8 : 1} />
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
  const [isDragging, setIsDragging] = useState(false);
  const touchStartXRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      // Desktop mouse movement handler
      const handleMouseMove = (e) => {
        const xPosition = e.clientX;
        const normalizedRotation = (xPosition / window.innerWidth) * Math.PI * 2;
        setRotationValue(current => {
          const diff = normalizedRotation - current;
          return current + diff * 0.1;
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    } else {
      // Mobile touch handlers
      const handleTouchStart = (e) => {
        touchStartXRef.current = e.touches[0].clientX;
        setIsDragging(true);
      };

      const handleTouchMove = (e) => {
        if (!isDragging || !touchStartXRef.current) return;

        // Prevent default only when intentionally rotating the object
        e.preventDefault();
        
        const touchX = e.touches[0].clientX;
        const deltaX = touchX - touchStartXRef.current;
        
        // Make rotation more subtle on mobile
        const normalizedRotation = (deltaX / window.innerWidth) * Math.PI;
        setRotationValue(current => {
          const diff = normalizedRotation;
          return current + diff * 0.05; // Reduced sensitivity for mobile
        });
        
        touchStartXRef.current = touchX;
      };

      const handleTouchEnd = () => {
        setIsDragging(false);
        touchStartXRef.current = null;
      };

      const container = containerRef.current;
      if (container) {
        container.addEventListener("touchstart", handleTouchStart, { passive: true });
        container.addEventListener("touchmove", handleTouchMove, { passive: false });
        container.addEventListener("touchend", handleTouchEnd, { passive: true });

        return () => {
          container.removeEventListener("touchstart", handleTouchStart);
          container.removeEventListener("touchmove", handleTouchMove);
          container.removeEventListener("touchend", handleTouchEnd);
        };
      }
    }
  }, [isMobile, isDragging]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}>
      <Canvas
        frameloop="demand"
        shadows
        camera={{
          position: isMobile ? [3, 1.5, 4] : [20, 3, 5], // Adjusted mobile camera
          fov: isMobile ? 40 : 25, // Wider FOV for mobile
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
    </div>
  );
};

export default SpaceCanvas;