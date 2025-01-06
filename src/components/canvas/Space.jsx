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
  const [isTouching, setIsTouching] = useState(false);
  const [initialTouchX, setInitialTouchX] = useState(null);
  const [scaleFactor, setScaleFactor] = useState(0.25);
  const canvasRef = useRef(null);
  const touchStartTimeRef = useRef(null);

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
      setScaleFactor(scale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const normalizedRotation = ((e.clientX / window.innerWidth) - 0.5) * Math.PI * 2;
      setRotationValue(normalizedRotation);
    };

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      const canvasBounds = canvasRef.current.getBoundingClientRect();
      
      // Check if touch is within canvas bounds
      if (
        touch.clientX >= canvasBounds.left &&
        touch.clientX <= canvasBounds.right &&
        touch.clientY >= canvasBounds.top &&
        touch.clientY <= canvasBounds.bottom
      ) {
        setInitialTouchX(touch.clientX);
        setIsTouching(true);
        touchStartTimeRef.current = Date.now();
      }
    };

    const handleTouchMove = (e) => {
      if (!isTouching || !initialTouchX) return;

      const touch = e.touches[0];
      const touchDuration = Date.now() - touchStartTimeRef.current;
      const touchDelta = Math.abs(touch.clientX - initialTouchX);

      // If touch movement is primarily horizontal and within the first 100ms,
      // assume it's intended for rotation
      if (touchDuration < 100 && touchDelta > 10) {
        const normalizedRotation = ((touch.clientX / window.innerWidth) - 0.5) * Math.PI * 2;
        setRotationValue(normalizedRotation);
        e.preventDefault(); // Only prevent default for intentional rotation
      }
    };

    const handleTouchEnd = () => {
      setIsTouching(false);
      setInitialTouchX(null);
      touchStartTimeRef.current = null;
    };

    if (isMobile) {
      const canvas = canvasRef.current;
      canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
      canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
      canvas.addEventListener("touchend", handleTouchEnd, { passive: true });
    } else {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (isMobile && canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.removeEventListener("touchstart", handleTouchStart);
        canvas.removeEventListener("touchmove", handleTouchMove);
        canvas.removeEventListener("touchend", handleTouchEnd);
      } else {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [isMobile, isTouching, initialTouchX]);

  return (
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
  );
};

export default SpaceCanvas;