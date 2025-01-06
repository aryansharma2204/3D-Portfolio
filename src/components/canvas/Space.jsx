import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

const Space = ({ isMobile, rotationValue, scaleFactor }) => {
  // Updated to load space-shuttle.glb
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
  const [scaleFactor, setScaleFactor] = useState(0.25); // Default scale
  const canvasRef = useRef(null);

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
      const scale = window.innerWidth / 1500; // Adjust 1500 to any reference value
      setScaleFactor(scale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    const handleMove = (e) => {
      const xPosition = e.touches ? e.touches[0].clientX : e.clientX;
      const normalizedRotation = ((xPosition / window.innerWidth) - 0.5) * Math.PI * 2;
      setRotationValue(normalizedRotation);
    };

    const handleTouchStart = (e) => {
      const canvasBounds = canvasRef.current.getBoundingClientRect();
      const isTouchInsideCanvas =
        e.touches[0].clientX >= canvasBounds.left &&
        e.touches[0].clientX <= canvasBounds.right &&
        e.touches[0].clientY >= canvasBounds.top &&
        e.touches[0].clientY <= canvasBounds.bottom;

      if (isTouchInsideCanvas) {
        setIsTouching(true);
        handleMove(e); // Optionally, trigger move on start for initial position
      }
    };

    const handleTouchMove = (e) => {
      if (isTouching) {
        handleMove(e);
        e.preventDefault();  // Prevent scrolling when touching and interacting with the canvas
      }
    };

    const handleTouchEnd = () => {
      setIsTouching(false);  // Reset flag when touch ends
    };

    if (isMobile) {
      window.addEventListener("touchstart", handleTouchStart, { passive: false });
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd, { passive: true });
    } else {
      window.addEventListener("mousemove", handleMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (isMobile) {
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [isMobile, isTouching]);

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
