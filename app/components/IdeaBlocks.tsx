'use client';

import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import { Text, PivotControls } from '@react-three/drei';
import type { PlaneProps } from '@react-three/cannon';

interface BlockProps {
  position: [number, number, number];
  text: string;
  color: string;
  onCollide?: (text: string) => void;
}

interface BlockData {
  id: number;
  text: string;
  position: [number, number, number];
  color: string;
}

const generateNewIdea = (idea1: string, idea2: string): string => {
  const combinations: Record<string, string> = {
    'music+painting': 'Visual Symphony',
    'book+computer': 'Digital Storytelling',
    'coffee+exercise': 'Energy Ritual',
  };
  
  const key = `${idea1}+${idea2}`;
  return combinations[key] || `${idea1} × ${idea2}`;
};

const Block: React.FC<BlockProps> = ({ position, text, color, onCollide }) => {
  const [ref, api] = useBox(() => ({
    mass: 1,
    position,
    args: [4, 4, 4],
    onCollide: onCollide ? () => onCollide(text) : undefined,
  }));

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const handleDrag = (matrix) => {
    // Extract position from matrix
    const position = [matrix.elements[12], matrix.elements[13], matrix.elements[14]];
    api.position.set(position[0], position[1], position[2]);
  };

  return (
    <PivotControls 
      anchor={[0, 0, 0]}
      depthTest={false}
      lineWidth={2}
      scale={2}
      onDrag={handleDrag}
    >
      <group ref={ref}>
        <mesh castShadow>
          <boxGeometry args={[4, 4, 4]} />
          <meshLambertMaterial color={color} />
        </mesh>
        <Text
          position={[0, 0, 2.1]}
          fontSize={0.5}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {text}
        </Text>
      </group>
    </PivotControls>
  );
};

const Ground: React.FC = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -5, 0],
  } as PlaneProps));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#f0f0f0" />
    </mesh>
  );
};

const IdeaBlocks: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockData[]>([
    { id: 1, text: 'music', position: [-10, 0, 0], color: '#ff9999' },
    { id: 2, text: 'painting', position: [10, 0, 0], color: '#99ff99' },
  ]);
  
  const collidedBlocks = useRef<Set<string>>(new Set());
  
  const handleCollision = (text: string) => {
    if (collidedBlocks.current.size < 2) {
      collidedBlocks.current.add(text);
      
      if (collidedBlocks.current.size === 2) {
        const [idea1, idea2] = [...collidedBlocks.current];
        const newIdea = generateNewIdea(idea1, idea2);
        
        setTimeout(() => {
          setBlocks(prev => [
            ...prev,
            {
              id: Date.now(),
              text: newIdea,
              position: [0, 10, 0],
              color: '#9999ff'
            }
          ]);
          collidedBlocks.current.clear();
        }, 500);
      }
    }
  };

  return (
    <div className="w-full h-screen">
      <Canvas shadows camera={{ position: [0, 15, 30], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} castShadow />
        <Physics gravity={[0, -9.81, 0]}>
          <Ground />
          {blocks.map(block => (
            <Block
              key={block.id}
              position={block.position}
              text={block.text}
              color={block.color}
              onCollide={handleCollision}
            />
          ))}
        </Physics>
      </Canvas>
      <div className="absolute top-4 left-4 text-white bg-black/50 p-2 rounded">
        <p>Drag the controls to move blocks and combine ideas!</p>
      </div>
    </div>
  );
};

export default IdeaBlocks;