import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

const Space = ({ isRotating, setIsRotating, setCurrentRotation }) => {
  const spaceRef = useRef();
  const { scene } = useGLTF("./space-shuttle.glb");
  let previousTouch = null;

  useFrame(() => {
    if (spaceRef.current) {
      // Update model rotation based on drag
      if (isRotating) {
        spaceRef.current.rotation.y += 0.01;
        setCurrentRotation(spaceRef.current.rotation.y);
      }
    }
  });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsRotating(true);

    // Store touch position for mobile
    if (e.touches) {
      previousTouch = e.touches[0].clientX;
    }
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    setIsRotating(false);
    previousTouch = null;
  };

  const handlePointerMove = (e) => {
    e.stopPropagation();
    if (isRotating) {
      if (previousTouch && e.touches) {
        const touch = e.touches[0];
        const delta = (touch.clientX - previousTouch) * 0.01;
        spaceRef.current.rotation.y += delta;
        setCurrentRotation(spaceRef.current.rotation.y);
        previousTouch = touch.clientX;
      }
    }
  };

  return (
    <mesh
      ref={spaceRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    >
      <hemisphereLight intensity={0.5} groundColor="black" />
      <pointLight intensity={1} position={[10, 10, 10]} />
      <primitive
        object={scene}
        scale={2.5}
        position-y={0}
        rotation-y={0}
      />
    </mesh>
  );
};

const SpaceCanvas = () => {
  const [isRotating, setIsRotating] = React.useState(false);
  const [currentRotation, setCurrentRotation] = React.useState(0);

  return (
    <Canvas
      shadows
      frameloop='demand'
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Space
          isRotating={isRotating}
          setIsRotating={setIsRotating}
          setCurrentRotation={setCurrentRotation}
        />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default SpaceCanvas;