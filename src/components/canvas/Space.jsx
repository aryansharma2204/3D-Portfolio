import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import CanvasLoader from "../Loader";

const Space = ({ isMobile, rotationValue, scaleFactor, onModelLoad }) => {
  const space = useGLTF("./space-shuttle.glb");
  const meshRef = useRef();

  useEffect(() => {
    if (space && onModelLoad) {
      onModelLoad(space.scene);
    }
  }, [space, onModelLoad]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotationValue;
    }
  });

  const lightPosition = [
    Math.cos(rotationValue) * 2,
    1,
    Math.sin(rotationValue) * 2
  ];

  return (
    <group ref={meshRef}>
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
    </group>
  );
};

const SpaceCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [rotationValue, setRotationValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastX, setLastX] = useState(null);
  const [scaleFactor, setScaleFactor] = useState(0.25);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const dragSensitivity = 0.01; // Adjust this value to control rotation speed

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
      setScaleFactor(Math.max(0.15, scale));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const handleModelLoad = (model) => {
    modelRef.current = model;
  };

  const checkIntersection = (x, y) => {
    if (!canvasRef.current || !modelRef.current) return false;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const rect = canvasRef.current.getBoundingClientRect();
    
    mouse.x = ((x - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((y - rect.top) / rect.height) * 2 + 1;

    // Get the camera from the canvas
    const camera = canvasRef.current.camera;
    if (!camera) return false;

    raycaster.setFromCamera(mouse, camera);
    
    // Create an array of all meshes in the model
    const meshes = [];
    modelRef.current.traverse((child) => {
      if (child.isMesh) {
        meshes.push(child);
      }
    });

    const intersects = raycaster.intersectObjects(meshes);
    return intersects.length > 0;
  };

  const handlePointerDown = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // For debugging
    console.log('Pointer down', { clientX, clientY });
    
    // Always allow dragging for now (remove this line once intersection works)
    setIsDragging(true);
    setLastX(clientX);

    // Uncomment this once the model is properly loaded and detected
    /*if (checkIntersection(clientX, clientY)) {
      setIsDragging(true);
      setLastX(clientX);
    }*/
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    
    if (lastX !== null) {
      const delta = (clientX - lastX) * dragSensitivity;
      setRotationValue(prev => prev + delta);
    }
    
    setLastX(clientX);
    
    // Prevent default only when dragging
    if (e.cancelable) {
      e.preventDefault();
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setLastX(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Mouse events
    canvas.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    // Touch events
    canvas.addEventListener('touchstart', handlePointerDown);
    canvas.addEventListener('touchmove', handlePointerMove, { passive: false });
    canvas.addEventListener('touchend', handlePointerUp);

    return () => {
      canvas.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);

      canvas.removeEventListener('touchstart', handlePointerDown);
      canvas.removeEventListener('touchmove', handlePointerMove);
      canvas.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, lastX]);

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
        <Space 
          isMobile={isMobile} 
          rotationValue={rotationValue} 
          scaleFactor={scaleFactor}
          onModelLoad={handleModelLoad}
        />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default SpaceCanvas;