"use client";

import * as THREE from "three";
import { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { Canvas, ThreeElements, useFrame } from "@react-three/fiber";
import { Billboard, Text, TrackballControls } from "@react-three/drei";
import { generate } from "random-words";

interface WordProps extends Omit<ThreeElements["mesh"], "ref"> {
  children: string;
  position: THREE.Vector3;
}

const Word: React.FC<WordProps> = ({ children, position, ...props }) => {
  const color = new THREE.Color();
  const fontProps = {
    font: "/Inter_18pt-Bold.ttf",
    fontSize: 2.5,
    letterSpacing: -0.05,
    lineHeight: 1,
    "material-toneMapped": false,
  };
  const ref =
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>>(
      null
    );
  const [hovered, setHovered] = useState(false);

  const over = (e: React.PointerEvent) => {
    e.stopPropagation();
    setHovered(true);
  };

  const out = () => setHovered(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  useFrame(() => {
    if (ref.current && ref.current.material instanceof THREE.Material) {
      ref.current.material.color.lerp(
        color.set(hovered ? "#fa2720" : "white"),
        0.1
      );
    }
  });

  return (
    <Billboard position={position} {...props}>
      <Text
        ref={ref}
        onPointerOver={over}
        onPointerOut={out}
        onClick={() => console.log("clicked")}
        {...fontProps}
      >
        {children}
      </Text>
    </Billboard>
  );
};

interface CloudProps {
  count?: number;
  radius?: number;
}

const Cloud: React.FC<CloudProps> = ({ count = 4, radius = 20 }) => {
  const words = useMemo(() => {
    const temp: [THREE.Vector3, string][] = [];
    const spherical = new THREE.Spherical();
    const phiSpan = Math.PI / (count + 1);
    const thetaSpan = (Math.PI * 2) / count;

    for (let i = 1; i < count + 1; i++) {
      for (let j = 0; j < count; j++) {
        const word = generate();
        temp.push([
          new THREE.Vector3().setFromSpherical(
            spherical.set(radius, phiSpan * i, thetaSpan * j)
          ),
          Array.isArray(word) ? word[0] : word,
        ]);
      }
    }

    return temp;
  }, [count, radius]);

  return (
    <>
      {words.map(([pos, word], index) => (
        <Word key={index} position={pos}>
          {word}
        </Word>
      ))}
    </>
  );
};

const SpherePage: React.FC = () => {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 35], fov: 90 }}>
      <fog attach="fog" args={["#202025", 0, 80]} />
      <Suspense fallback={null}>
        <group rotation={[10, 10.5, 10]}>
          <Cloud count={8} radius={20} />
        </group>
      </Suspense>
      <TrackballControls />
    </Canvas>
  );
};

export default SpherePage;
