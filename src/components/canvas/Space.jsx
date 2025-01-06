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
        position={isMobile ? [0, 0.5, -1.5] : [1, -1.4, 0]} // Adjusted Y position for mobile
      />
    </mesh>
  );
};

const SpaceCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [rotationValue, setRotationValue] = useState(0);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [scaleFactor, setScaleFactor] = useState(0.25);
  const gestureStarted = useRef(false);
  const lastTouchX = useRef(null);
  const rotationSpeed = useRef(0);
  const rafId = useRef(null);

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
      setScaleFactor(Math.max(0.2, Math.min(scale, 0.4)));
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

  useEffect(() => {
    const animateRotation = () => {
      if (Math.abs(rotationSpeed.current) > 0.001) {
        setRotationValue(prev => prev + rotationSpeed.current);
        rotationSpeed.current *= 0.95;
        rafId.current = requestAnimationFrame(animateRotation);
      }
    };

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  const handleTouchStart = (e) => {
    if (!containerRef.current) return;
    
    const touch = e.touches[0];
    const containerBounds = containerRef.current.getBoundingClientRect();
    
    if (
      touch.clientX >= containerBounds.left &&
      touch.clientX <= containerBounds.right &&
      touch.clientY >= containerBounds.top &&
      touch.clientY <= containerBounds.bottom
    ) {
      gestureStarted.current = true;
      lastTouchX.current = touch.clientX;
      rotationSpeed.current = 0;
    }
  };

  const handleTouchMove = (e) => {
    if (!gestureStarted.current || !lastTouchX.current) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - lastTouchX.current;
    
    rotationSpeed.current = deltaX * 0.01;
    
    const newRotation = rotationValue + rotationSpeed.current;
    setRotationValue(newRotation);
    
    lastTouchX.current = touch.clientX;
  };

  const handleTouchEnd = () => {
    gestureStarted.current = false;
    lastTouchX.current = null;
    
    if (Math.abs(rotationSpeed.current) > 0.001) {
      rafId.current = requestAnimationFrame(function animate() {
        setRotationValue(prev => prev + rotationSpeed.current);
        rotationSpeed.current *= 0.95;
        if (Math.abs(rotationSpeed.current) > 0.001) {
          rafId.current = requestAnimationFrame(animate);
        }
      });
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    if (isMobile) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true });
      container.addEventListener("touchmove", handleTouchMove, { passive: true });
      container.addEventListener("touchend", handleTouchEnd, { passive: true });
    } else {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (isMobile) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
      } else {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [isMobile, rotationValue]);

  return (
    <div 
      ref={containerRef}
      style={{
        height: isMobile ? "60vh" : "100vh", // Slightly increased height for mobile
        width: "100%",
        touchAction: "pan-y",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <Canvas
        ref={canvasRef}
        frameLoop="demand"
        shadows
        camera={{
          position: isMobile ? [0, 0, 4] : [20, 3, 5], // Adjusted camera position for mobile
          fov: isMobile ? 45 : 25, // Adjusted FOV for mobile
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