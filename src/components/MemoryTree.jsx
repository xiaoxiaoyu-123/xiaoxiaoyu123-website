import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { PHOTO_DATA } from '../config/photos';

// --- 三维空间工具函数 ---
const getTreePosition = (index, total) => {
  const angle = index * 0.5 + Math.PI * 2; // 螺旋角度
  const height = (index / total) * 8 - 4; // 高度分布从 -4 到 4
  const radius = (1 - (index / total)) * 4 + 0.5; // 从底部到顶部半径缩小
  return [
    Math.cos(angle) * radius,
    height,
    Math.sin(angle) * radius
  ];
};

// --- 单个照片节点组件 ---
const PhotoNode = ({ photo, position, onClick }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const texture = useMemo(() => new THREE.TextureLoader().load(photo.url), [photo.url]);

  useFrame((state) => {
    if (meshRef.current) {
      // 轻微的飘浮感
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime + photo.id) * 0.002;
      // 始终圆面向相机
      meshRef.current.quaternion.copy(state.camera.quaternion);
    }
  });

  return (
    <mesh 
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick(photo);
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[1.2, 1.2]} />
      <meshBasicMaterial 
        map={texture} 
        transparent 
        opacity={0.9} 
        side={THREE.DoubleSide}
      />
      {/* 悬停时的发光边框 */}
      {hovered && (
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.3, 1.3]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.5} />
        </mesh>
      )}
    </mesh>
  );
};

// --- 3D 圣诞树粒子背景 ---
const TreeParticles = () => {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < 1000; i++) {
        const t = i / 1000;
        const angle = t * 40;
        const radius = (1 - t) * 4;
        p.push(new THREE.Vector3(Math.cos(angle) * radius, t * 8 - 4, Math.sin(angle) * radius));
    }
    return p;
  }, []);

  return (
    <group>
      {points.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#00f3ff" : "#bd00ff"} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
};

// --- 主组件 ---
export default function MemoryTree({ onPhotoClick }) {
  return (
    <div className="w-full h-full bg-slate-900/20 rounded-[2rem] overflow-hidden relative border border-white/5 group">
      {/* 扫视线装饰 */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-scanline opacity-[0.03]"></div>
      
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
           <group rotation={[0, 0, 0]}>
              <TreeParticles />
              {PHOTO_DATA.map((photo, index) => (
                <PhotoNode 
                  key={photo.id}
                  photo={photo}
                  position={getTreePosition(index, PHOTO_DATA.length)}
                  onClick={onPhotoClick}
                />
              ))}
           </group>
        </Float>

        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          enablePan={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      {/* 底部 UI 提示 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-2">
        <div className="px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-[10px] uppercase tracking-[0.2em] text-cyan-400/80 font-bold">
           MEM_TREE_V3.0 // ACTIVE
        </div>
        <div className="text-[9px] text-white/30 font-mono italic">DRAG_TO_EXPLORE / CLICK_TO_EXPAND</div>
      </div>
    </div>
  );
}
