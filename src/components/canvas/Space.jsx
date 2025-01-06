import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

const Space = ({ isMobile, rotationValue, scaleFactor }) => {
  const space = useGLTF("./space-shuttle.glb");

  useFrame(() => {
    space.scene.rotation.y += (rotationValue - space.scene.rotation.y) * 0.1;
  });

  const lightPosition = [
    Math.cos(rotationValue) * 2,
    1,
    Math.sin(rotationValue) * 2
  ];

  return (
    <mesh>
      <hemisphereLight intensity={0.3} groundColor="black" />
      <spotLight
        position={lightPosition}
        angle={0.12}
        penumbra={1}
        intensity={2}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={2} />
      <primitive
        object={space.scene}
        scale={scaleFactor}
        position={isMobile ? [0, -0.5, -1.5] : [1, -1.4, 0]}
      />
    </mesh>
  );
};

const SpaceCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [rotationValue, setRotationValue] = useState(0);
  const [touchStartY, setTouchStartY] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);
  const canvasRef = useRef(null);
  const [scaleFactor, setScaleFactor] = useState(0.25);
  const isRotatingRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const updateScale = () => {
      const scale = window.innerWidth / 1500;
      setScaleFactor(Math.max(0.2, Math.min(scale, 0.4))); // Limit scale between 0.2 and 0.4
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const handleMouseMove = (e) => {
    if (!isMobile) {
      const normalizedRotation = ((e.clientX / window.innerWidth) - 0.5) * Math.PI * 2;
      setRotationValue(normalizedRotation);
    }
  };

  const handleTouchStart = (e) => {
    if (!canvasRef.current) return;
    
    const touch = e.touches[0];
    const canvasBounds = canvasRef.current.getBoundingClientRect();
    
    // Check if touch is within canvas bounds
    if (
      touch.clientX >= canvasBounds.left &&
      touch.clientX <= canvasBounds.right &&
      touch.clientY >= canvasBounds.top &&
      touch.clientY <= canvasBounds.bottom
    ) {
      setTouchStartX(touch.clientX);
      setTouchStartY(touch.clientY);
      isRotatingRef.current = false;
    }
  };

  const handleTouchMove = (e) => {
    if (!touchStartX || !touchStartY || !canvasRef.current) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    // If horizontal movement is greater than vertical, assume rotation
    if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      isRotatingRef.current = true;
      const normalizedRotation = ((touch.clientX / window.innerWidth) - 0.5) * Math.PI * 2;
      setRotationValue(normalizedRotation);
      e.preventDefault(); // Prevent scrolling only during rotation
    } else if (!isRotatingRef.current) {
      // If we haven't started rotating, allow normal scroll
      return;
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
    setTouchStartY(null);
    isRotatingRef.current = false;
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    if (isMobile) {
      canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
      canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
      canvas.addEventListener("touchend", handleTouchEnd, { passive: true });
    } else {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (isMobile) {
        canvas.removeEventListener("touchstart", handleTouchStart);
        canvas.removeEventListener("touchmove", handleTouchMove);
        canvas.removeEventListener("touchend", handleTouchEnd);
      } else {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [isMobile, touchStartX, touchStartY]);

  return (
    <div style={{ 
      touchAction: "pan-y", // Enable vertical scrolling by default
      height: "100vh",
      width: "100%"
    }}>
      <Canvas
        ref={canvasRef}
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
          <Space isMobile={isMobile} rotationValue={rotationValue} scaleFactor={scaleFactor} />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default SpaceCanvas;