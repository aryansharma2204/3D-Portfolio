import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import CanvasLoader from "../Loader";

const Space = ({ isMobile, modelRotation, scale }) => {
  const { scene } = useGLTF("./space-shuttle.glb");
  const modelRef = useRef();

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y = modelRotation;
    }
  });

  return (
    <mesh ref={modelRef}>
      <hemisphereLight intensity={0.5} groundColor="black" />
      <pointLight intensity={1} position={[10, 10, 10]} />
      <primitive 
        object={scene}
        scale={scale}
        position={isMobile ? [0, -0.5, -1.5] : [0, -1.4, 0]}
        rotation-y={0}
      />
    </mesh>
  );
};

const SpaceCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previousTouch, setPreviousTouch] = useState(null);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const handleMouseDown = (event) => {
    setIsDragging(true);
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const sensitivity = 0.01;
      const delta = event.movementX * sensitivity;
      setRotation((prev) => prev + delta);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    setPreviousTouch({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (event) => {
    if (isDragging && previousTouch) {
      const touch = event.touches[0];
      const sensitivity = 0.01;
      const delta = (touch.clientX - previousTouch.x) * sensitivity;
      setRotation((prev) => prev + delta);
      setPreviousTouch({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setPreviousTouch(null);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ width: '100%', height: '100%', touchAction: 'none' }}
    >
      <Canvas
        ref={canvasRef}
        frameloop="demand"
        shadows
        camera={{ position: [20, 3, 5], fov: 25 }}
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
          <Space 
            isMobile={isMobile}
            modelRotation={rotation}
            scale={isMobile ? 0.7 : 0.75}
          />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default SpaceCanvas;