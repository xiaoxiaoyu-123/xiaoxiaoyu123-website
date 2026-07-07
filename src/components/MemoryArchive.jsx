import React, { useMemo, useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useVideoTexture, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, ArrowLeft, Sparkles, Move, Image as ImageIcon, XCircle, SkipForward, Play, Pause, Music, FileText } from 'lucide-react';
import { PHOTO_DATA } from '../config/photos';
import LyricsPanel from './LyricsPanel';

// 错误边界：防止 Three.js 图片加载失败导致页面白屏
class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff', fontFamily: 'monospace', fontSize: '14px' }}>
          <p>✨ 记忆星海正在加载中...</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const COLORS = {
    STAR_WHITE: new THREE.Color("#ffffff"),
    HOT_PINK: new THREE.Color("#ff1493"),
    CYAN: new THREE.Color("#00ffff"),
    VIOLET: new THREE.Color("#8b00ff"),
    STAR_DUST: new THREE.Color("#ffffff") 
};

// --- [NEW] 记忆星海粒子浪潮 (Particle Wave Sea - ALL-ANGLE VERSION) ---
const ParticleWave = () => {
    const count = 35000;
    const meshRef = useRef();
    
    // 生成柔和的圆形光晕纹理
    const glowTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.3)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(canvas);
    }, []);

    const [positions, offsets] = useMemo(() => {
        const p = new Float32Array(count * 3);
        const o = new Float32Array(count); 
        for (let i = 0; i < count; i++) {
            const r = 3.0 + Math.sqrt(Math.random()) * 58; 
            const theta = Math.random() * Math.PI * 2;
            p[i*3] = r * Math.cos(theta);
            // 微量纵向偏移 (±0.4)，确保侧视和俯视可见，且保持精致感
            p[i*3+1] = -11.5 + (Math.random() - 0.5) * 0.8; 
            p[i*3+2] = r * Math.sin(theta);
            o[i] = r; 
        }
        return [p, o];
    }, []);

    const yOffsets = useMemo(() => {
        const arr = new Float32Array(count);
        for(let i=0; i<count; i++) arr[i] = (Math.random() - 0.5) * 0.8;
        return arr;
    }, []);

    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.elapsedTime;
            const posAttr = meshRef.current.geometry.attributes.position;
            for (let i = 0; i < count; i++) {
                const r = offsets[i];
                const wave = Math.sin(r * 0.25 - time * 0.6) * 0.85;
                const wave2 = Math.cos(r * 0.12 + time * 0.4) * 0.3;
                posAttr.setY(i, (-11.5 + yOffsets[i]) + wave + wave2);
            }
            posAttr.needsUpdate = true;
            meshRef.current.rotation.y += 0.0003;
        }
    });

    return (
        <points ref={meshRef} renderOrder={5}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial 
                size={0.6} 
                map={glowTexture} 
                transparent 
                opacity={0.8} 
                fog={false} 
                blending={THREE.AdditiveBlending} 
                depthWrite={false} 
                sizeAttenuation={true} 
            />
        </points>
    );
};

// --- 环境星尘系统 (Star-Moon-Snow Trinity Version - ENHANCED) ---
const StarDust = () => {
    const totalCount = 5000;
    const countPerType = Math.floor(totalCount / 3);
    const textures = useMemo(() => {
        const createTex = (drawFn) => {
            const canvas = document.createElement('canvas');
            canvas.width = 64; canvas.height = 64;
            const ctx = canvas.getContext('2d');
            // 恢复最经典的 12 点发光，确保纹理极致清晰
            ctx.fillStyle = 'white'; ctx.shadowBlur = 12; ctx.shadowColor = 'white';
            drawFn(ctx);
            return new THREE.CanvasTexture(canvas);
        };
        return {
            star: createTex((ctx) => {
                const cx = 32, cy = 32, spikes = 5, outer = 28, inner = 12;
                let rot = Math.PI/2*3, step = Math.PI/spikes;
                ctx.beginPath(); ctx.moveTo(cx, cy - outer);
                for(let i=0; i<spikes; i++) {
                    ctx.lineTo(cx + Math.cos(rot)*outer, cy + Math.sin(rot)*outer); rot += step;
                    ctx.lineTo(cx + Math.cos(rot)*inner, cy + Math.sin(rot)*inner); rot += step;
                }
                ctx.closePath(); ctx.fill();
            }),
            snow: createTex((ctx) => {
                ctx.strokeStyle = 'white'; ctx.lineWidth = 5; ctx.lineCap = 'round';
                const cx = 32, cy = 32;
                for(let i=0; i<6; i++) {
                    const angle = (i * 60) * Math.PI / 180;
                    ctx.beginPath(); ctx.moveTo(cx, cy);
                    ctx.lineTo(cx + Math.cos(angle)*28, cy + Math.sin(angle)*28);
                    const bx = cx + Math.cos(angle)*18, by = cy + Math.sin(angle)*18;
                    ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(angle+0.6)*10, by + Math.sin(angle+0.6)*10);
                    ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(angle-0.6)*10, by + Math.sin(angle-0.6)*10);
                    ctx.stroke();
                }
            }),
            moon: createTex((ctx) => {
                ctx.beginPath();
                // 调整弧度范围，让实体部分位于右侧，开口位于左侧
                const start = Math.PI * 0.6;
                const end = Math.PI * 1.4;
                ctx.arc(32, 32, 26, start, end, true); // 使用 counter-clockwise 绘制实体圆弧
                // 使用贝塞尔曲线勾勒内凹部分，形成优雅的左开口月牙
                ctx.bezierCurveTo(44, 19, 44, 45, 32 + Math.cos(start)*26, 32 + Math.sin(start)*26);
                ctx.fill();
            })
        };
    }, []);

    return (
        <group>
            <PartSet count={countPerType} texture={textures.star} speedMult={1.0} />
            <PartSet count={countPerType} texture={textures.snow} speedMult={0.8} />
            <PartSet count={countPerType} texture={textures.moon} speedMult={0.6} />
        </group>
    );
};

const PartSet = ({ count, texture, speedMult }) => {
    const meshRef = useRef();
    const pos = useMemo(() => {
        const p = new Float32Array(count * 3);
        const rand = () => Math.random();
        for (let i = 0; i < count; i++) {
            const r = 25 + rand() * 65; 
            const theta = rand() * Math.PI * 2;
            const phi = Math.acos(rand() * 2 - 1);
            p[i*3] = r * Math.sin(phi) * Math.cos(theta);
            p[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
            p[i*3+2] = r * Math.cos(phi);
        }
        return p;
    }, [count]);
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.00015 * speedMult;
            meshRef.current.rotation.x += 0.00008 * speedMult;
            meshRef.current.material.opacity = 0.75 + Math.sin(state.clock.elapsedTime * 0.6 * speedMult) * 0.25;
        }
    });
    return (
        <points ref={meshRef}>
            <bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} /></bufferGeometry>
            <pointsMaterial size={1.05} map={texture} transparent alphaTest={0.05} color={COLORS.STAR_DUST} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation={true} />
        </points>
    );
};

const EnergyBeam = () => {
    const count = 18000;
    const meshRef = useRef();
    const [pos, colors] = useMemo(() => {
        const p = new Float32Array(count * 3);
        const c = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const h = Math.random() * 32.5 - 11.5;
            const rBase = Math.pow(Math.random(), 5.0) * 1.5; 
            const angle = Math.random() * Math.PI * 2;
            p[i*3] = Math.cos(angle) * rBase;
            p[i*3+1] = h;
            p[i*3+2] = Math.sin(angle) * rBase;
            const bColor = COLORS.STAR_WHITE.clone();
            if (rBase > 0.6) bColor.lerp(COLORS.HOT_PINK, 0.4);
            c[i*3] = bColor.r; c[i*3+1] = bColor.g; c[i*3+2] = bColor.b;
        }
        return [p, c];
    }, []);
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = (state.clock.elapsedTime * 0.15) % 0.12;
            meshRef.current.rotation.y += 0.008;
        }
    });
    return (
        <points ref={meshRef} renderOrder={11}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.045} vertexColors transparent opacity={0.65} fog={false} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
    );
};

const RadiantTree = () => {
    const pointsCount = 95000;
    const { positions, colors, sizes, finalCount } = useMemo(() => {
        const p = new Float32Array(pointsCount * 3);
        const c = new Float32Array(pointsCount * 3);
        const s = new Float32Array(pointsCount);
        const numTiers = 6; 
        let ptr = 0;
        for (let i = 0; i < pointsCount; i++) {
            const yNorm = Math.random();
            const tierIndex = Math.floor(yNorm * numTiers);
            const tierProgress = (yNorm * numTiers) - tierIndex; 
            const baseRadius = 13.5; 
            const tierExpansion = 0.9 + Math.pow(1.0 - tierProgress, 3.5) * 0.45;
            const maxR = Math.max(0.35 * (1.1 - yNorm), baseRadius * (1.0 - Math.pow(yNorm, 1.2)) * tierExpansion);
            const r = Math.pow(Math.random(), 1.4) * maxR; 
            if (r > maxR * 0.98) continue; 
            const angle = Math.random() * Math.PI * 2;
            p[ptr*3] = Math.cos(angle) * r;
            p[ptr*3+1] = yNorm * 32.0 - 11.5;
            p[ptr*3+2] = Math.sin(angle) * r;
            const bColor = COLORS.STAR_WHITE.clone();
            const rNorm = r / (maxR + 0.001);
            if (rNorm > 0.88) {
                const rand = Math.random();
                if (rand > 0.6) bColor.lerp(COLORS.CYAN, 0.6);
                else bColor.lerp(COLORS.HOT_PINK, 0.8);
            } else { bColor.lerp(COLORS.HOT_PINK, THREE.MathUtils.smoothstep(rNorm, 0.1, 0.8) * 0.8); }
            bColor.multiplyScalar(1.0 + (1.0 - rNorm) * 1.5);
            c[ptr*3] = bColor.r; c[ptr*3+1] = bColor.g; c[ptr*3+2] = bColor.b;
            s[ptr] = (r < 1.5 ? 0.16 : 0.08) * (1.2 + Math.random() * 0.6); 
            ptr++;
            if (ptr >= pointsCount) break;
        }
        return { positions: p, colors: c, sizes: s, finalCount: ptr };
    }, []);
    const geomRef = useRef();
    useEffect(() => { if (geomRef.current) geomRef.current.setDrawRange(0, finalCount); }, [finalCount]);
    const ref = useRef();
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y -= 0.0004;
            ref.current.material.opacity = 0.85 + Math.sin(state.clock.elapsedTime * 1.8) * 0.08;
        }
    });
    return (
        <points ref={ref} renderOrder={10}>
            <bufferGeometry ref={geomRef}>
                <bufferAttribute attach="attributes-position" count={pointsCount} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={pointsCount} array={colors} itemSize={3} />
                <bufferAttribute attach="attributes-size" count={pointsCount} array={sizes} itemSize={1} />
            </bufferGeometry>
            <pointsMaterial vertexColors size={0.14} transparent opacity={0.9} fog={false} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation={true} />
        </points>
    );
};

const LuminousPedestal = () => {
    const count = 9000;
    const meshRef = useRef();
    const [pos, colors] = useMemo(() => {
        const p = new Float32Array(count * 3);
        const c = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 8.5 + Math.random() * 32.0; 
            const theta = Math.random() * Math.PI * 2;
            p[i*3] = Math.cos(theta) * r;
            p[i*3+1] = (Math.random() - 0.5) * 1.2 - 11.5;
            p[i*3+2] = Math.sin(theta) * r;
            const bColor = COLORS.HOT_PINK.clone().lerp(COLORS.VIOLET, Math.random() * 0.5);
            c[i*3] = bColor.r; c[i*3+1] = bColor.g; c[i*3+2] = bColor.b;
        }
        return [p, c];
    }, []);
    useFrame(() => { if (meshRef.current) meshRef.current.rotation.y += 0.008; });
    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.2} vertexColors transparent opacity={0.35} fog={false} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
    );
};

const HeartTop = () => {
    const count = 4500;
    const meshRef = useRef();
    const pos = useMemo(() => {
        const p = new Float32Array(count * 3);
        const scale = 0.13; 
        for (let i = 0; i < count; i++) {
            const t = Math.random() * Math.PI * 2;
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
            p[i*3] = x * scale;
            p[i*3+1] = (y + 6) * scale + 23.5; 
            p[i*3+2] = (Math.random() - 0.5) * 1.8;
        }
        return p;
    }, []);
    useFrame((state) => { if (meshRef.current) meshRef.current.rotation.y += 0.015; });
    return (
        <points ref={meshRef}>
            <bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} /></bufferGeometry>
            <pointsMaterial size={0.38} color={COLORS.HOT_PINK} transparent opacity={1} fog={false} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
    );
};

// 安全加载纹理，失败时返回默认纹理防止崩溃
function SafeTexture({ url }) {
  const [texture, setTexture] = useState(null);
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(url, (tex) => setTexture(tex), undefined, () => {
      // 加载失败：用1x1像素默认纹理
      const fallback = new THREE.DataTexture(new Uint8Array([40, 40, 60, 255]), 1, 1);
      fallback.needsUpdate = true;
      setTexture(fallback);
    });
    return () => {};
  }, [url]);
  return texture ? <meshBasicMaterial map={texture} transparent opacity={1} fog={false} /> : null;
}

const MediaNode = ({ photo, position, onSelect }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
        meshRef.current.quaternion.copy(state.camera.quaternion);
        const t = state.clock.elapsedTime;
        
        // 确保数值安全
        const phaseOffset = typeof photo.id === 'number' ? photo.id : (parseInt(photo.id.replace(/\D/g, '')) || 0);
        meshRef.current.position.set(position[0], position[1] + Math.sin(t * 0.4 + phaseOffset) * 0.3, position[2]);
        
        const targetScale = hovered ? 1.2 : 1.0;
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <mesh ref={meshRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} onClick={() => onSelect(photo)}>
      <planeGeometry args={[3.4, 3.4]} />
      {photo.type === 'video' ? (
        <VideoTextureMesh url={photo.url} />
      ) : (
        <SafeTexture url={photo.url} />
      )}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[3.6, 3.6]} />
        <meshBasicMaterial
            color={hovered ? COLORS.HOT_PINK : "#ffffff"}
            transparent
            opacity={hovered ? 0.4 : 0.15}
            fog={false}
        />
      </mesh>
    </mesh>
  );
};

// 安全加载视频纹理，失败时静默处理
function VideoTextureMesh({ url }) {
  let videoTex;
  try {
    videoTex = useVideoTexture(url, { muted: true, loop: true, start: true, crossOrigin: "Anonymous" });
  } catch(e) {
    return null;
  }
  return <meshBasicMaterial map={videoTex} transparent opacity={1} fog={false} />;
}

const getNebulaPos = (i, total) => {
    const phi = Math.acos(0.85 - (1.7 * i) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;
    const radius = 55 + Math.random() * 25;
    const angleOffset = Math.PI * 0.5 - (Math.sqrt(total * Math.PI) * Math.acos(0.85)); 
    const x = radius * Math.cos(theta + angleOffset) * Math.sin(phi);
    const y = (Math.random() * 40) - 5; 
    const z = radius * Math.sin(theta + angleOffset) * Math.sin(phi);
    return [x, y, z];
};

// ===== 音乐跳动条组件 (与 HobbiesSection 保持风格一致) =====
function MusicVisualizer({ isPlaying }) {
  const notes = [
    { id: 1, delay: 0, size: 12 },
    { id: 2, delay: 0.2, size: 8 },
    { id: 3, delay: 0.4, size: 10 },
  ];

  return (
    <div className="flex items-center gap-[4px] h-3 justify-center pointer-events-none">
      {notes.map((note) => (
        <motion.div
          key={note.id}
          initial="stopped"
          animate={isPlaying ? "playing" : "stopped"}
          variants={{
            playing: {
              scale: [0.8, 1.2, 0.8],
              opacity: [0.6, 1, 0.6],
              color: ["#00ffff", "#ff1493", "#8b00ff", "#00ffff"], // 星海主题色彩
              y: [0, -4, 0],
              transition: {
                scale: { repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: note.delay },
                opacity: { repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: note.delay },
                y: { repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: note.delay },
                color: { repeat: Infinity, duration: 3, ease: "linear" }
              }
            },
            stopped: {
              scale: 0.8,
              opacity: 0.3,
              y: 0,
              color: "rgba(255, 255, 255, 0.3)",
              transition: { duration: 0.5 }
            }
          }}
        >
          <Music size={note.size} strokeWidth={2.5} />
        </motion.div>
      ))}
    </div>
  );
}

const PLAYLIST = [
  { title: "小半", artist: "陈粒", url: "/陈粒-小半.mp3", lyrics: [
    { time: 0.01, text: "不敢回看" },
    { time: 2.25, text: "左顾右盼不自然的暗自喜欢" },
    { time: 6.82, text: "偷偷搭讪总没完地坐立难安" },
    { time: 11.26, text: "试探说晚安 多空泛又心酸" },
    { time: 17.57, text: "低头呢喃" },
    { time: 20.02, text: "对你的偏爱太过于明目张胆" },
    { time: 24.31, text: "在原地打转的小丑伤心不断" },
    { time: 28.64, text: "空空留遗憾 多难堪又为难" },
    { time: 34.87, text: "释然 慵懒 尽欢 时间风干后你我再无关" },
    { time: 43.60, text: "没答案 怎么办 看不惯我自我欺瞒" },
    { time: 51.59, text: "纵容着 喜欢的 讨厌的 宠溺的 厌倦的" },
    { time: 57.04, text: "一个个慢慢黯淡" },
    { time: 60.28, text: "纵容着 任性的 随意的 放肆的 轻易的" },
    { time: 65.78, text: "将所有欢脱倾翻" },
    { time: 69.10, text: "不应该 太心软 不大胆 太死板 不果断" },
    { time: 74.53, text: "玩弄着肆无忌惮" },
    { time: 77.82, text: "不应该 舍弃了 死心了 放手了 断念了" },
    { time: 83.25, text: "无可奈何不耐烦" },
    { time: 86.98, text: "不算" },
    { time: 91.56, text: "灯火阑珊" },
    { time: 94.09, text: "我的心借了你的光是明是暗" },
    { time: 98.42, text: "笑自己情绪太泛滥形只影单" },
    { time: 102.79, text: "自嘲成习惯 多敏感又难缠" },
    { time: 109.36, text: "低头呢喃" },
    { time: 111.49, text: "对你的偏爱太过于明目张胆" },
    { time: 115.87, text: "在原地打转的小丑伤心不断" },
    { time: 120.27, text: "空空留遗憾 多难堪又为难" },
    { time: 126.50, text: "释然 慵懒 尽欢 时间风干后你我再无关" },
    { time: 134.95, text: "没答案 怎么办 看不惯我自我欺瞒" },
    { time: 143.08, text: "纵容着 喜欢的 讨厌的 宠溺的 厌倦的" },
    { time: 148.67, text: "一个个慢慢黯淡" },
    { time: 151.88, text: "纵容着 任性的 随意的 放肆的 轻易的" },
    { time: 157.38, text: "将所有欢脱倾翻" },
    { time: 160.66, text: "不应该 太心软 不大胆 太死板 不果断" },
    { time: 166.08, text: "玩弄着肆无忌惮" },
    { time: 169.26, text: "不应该 舍弃了 死心了 放手了 断念了" },
    { time: 174.84, text: "无可奈何不耐烦" },
    { time: 195.63, text: "任由着 你躲闪 我追赶 你走散 我呼喊" },
    { time: 198.81, text: "是谁在泛泛而谈" },
    { time: 204.30, text: "任由着 你来了 你笑了 你走了 不看我" },
    { time: 209.76, text: "与理所当然分摊" },
    { time: 213.16, text: "不明白 残存的 没用的 多余的 不必的" },
    { time: 218.44, text: "破烂也在手紧攥" },
    { time: 221.77, text: "不明白 谁赧然 谁无端 谁古板 谁极端" },
    { time: 227.19, text: "无辜不知所以然" },
    { time: 231.16, text: "不管" },
    { time: 233.59, text: "纵容着 喜欢的 讨厌的 宠溺的 厌倦的" },
    { time: 235.90, text: "一个个慢慢黯淡" },
    { time: 239.19, text: "纵容着 任性的 随意的 放肆的 轻易的" },
    { time: 244.64, text: "将所有欢脱倾翻" },
    { time: 247.94, text: "不应该 太心软 不大胆 太死板 不果断" },
    { time: 253.36, text: "玩弄着肆无忌惮" },
    { time: 256.66, text: "不应该 舍弃了 死心了 放手了 断念了" },
    { time: 262.11, text: "无可奈何不耐烦" },
  ] },
  { title: "起风了", artist: "冯沁苑(买辣椒也用券)", url: "/冯沁苑(买辣椒也用券)-起风了.mp3", lyrics: [
    { time: 25.237, text: "这一路上走走停停" },
    { time: 28.592, text: "顺着少年漂流的痕迹" },
    { time: 31.681, text: "迈出车站的前一刻" },
    { time: 34.795, text: "竟有些犹豫" },
    { time: 37.794, text: "不禁笑这近乡情怯" },
    { time: 41.191, text: "仍无可避免" },
    { time: 43.819, text: "而长野的天" },
    { time: 45.134, text: "依旧那么暖" },
    { time: 46.684, text: "风吹起了从前" },
    { time: 49.153, text: "从前初识这世间" },
    { time: 52.185, text: "万般流连" },
    { time: 53.962, text: "看着天边似在眼前" },
    { time: 56.798, text: "也甘愿赴汤蹈火去走它一遍" },
    { time: 61.966, text: "如今走过这世间" },
    { time: 65.001, text: "万般流连" },
    { time: 66.632, text: "翻过岁月不同侧脸" },
    { time: 69.861, text: "措不及防闯入你的笑颜" },
    { time: 75.513, text: "我曾难自拔于世界之大" },
    { time: 79.605, text: "也沉溺于其中梦话" },
    { time: 82.837, text: "不得真假 不做挣扎 不惧笑话" },
    { time: 88.501, text: "我曾将青春翻涌成她" },
    { time: 91.930, text: "也曾指尖弹出盛夏" },
    { time: 95.281, text: "心之所动 且就随缘去吧" },
    { time: 101.156, text: "逆着光行走 任风吹雨打" },
    { time: 118.028, text: "短短的路走走停停" },
    { time: 121.171, text: "也有了几分的距离" },
    { time: 124.236, text: "不知抚摸的是故事 还是段心情" },
    { time: 130.711, text: "也许期待的不过是 与时间为敌" },
    { time: 136.193, text: "再次看到你" },
    { time: 137.991, text: "微凉晨光里" },
    { time: 139.556, text: "笑得很甜蜜" },
    { time: 142.116, text: "从前初识这世间" },
    { time: 144.937, text: "万般流连" },
    { time: 146.663, text: "看着天边似在眼前" },
    { time: 149.616, text: "也甘愿赴汤蹈火去走它一遍" },
    { time: 154.711, text: "如今走过这世间" },
    { time: 157.657, text: "万般流连" },
    { time: 159.389, text: "翻过岁月不同侧脸" },
    { time: 162.360, text: "措不及防闯入你的笑颜" },
    { time: 168.265, text: "我曾难自拔于世界之大" },
    { time: 172.336, text: "也沉溺于其中梦话" },
    { time: 175.538, text: "不得真假 不做挣扎 不惧笑话" },
    { time: 181.140, text: "我曾将青春翻涌成她" },
    { time: 185.235, text: "也曾指尖弹出盛夏" },
    { time: 188.062, text: "心之所动 且就随缘去吧" },
    { time: 219.324, text: "晚风吹起你鬓间的白发" },
    { time: 223.574, text: "抚平回忆留下的疤" },
    { time: 226.788, text: "你的眼中 明暗交杂 一笑生花" },
    { time: 232.294, text: "暮色遮住你蹒跚的步伐" },
    { time: 236.330, text: "走进床头藏起的画" },
    { time: 239.544, text: "画中的你 低着头说话" },
    { time: 245.074, text: "我仍感叹于世界之大" },
    { time: 248.784, text: "也沉醉于儿时情话" },
    { time: 252.150, text: "不剩真假 不做挣扎 无谓笑话" },
    { time: 257.925, text: "我终将青春还给了她" },
    { time: 261.677, text: "连同指尖弹出的盛夏" },
    { time: 265.007, text: "心之所动 就随风去了" },
    { time: 270.601, text: "以爱之名 你还愿意吗" },
  ] }
];

export default function MemoryArchive({ onBack, bgmAudioRef, isBgmPlaying, setIsBgmPlaying }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const { progress } = useProgress();
  const [forceLoad, setForceLoad] = useState(false);
  const [isLocalPlaying, setIsLocalPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const localAudioRef = useRef(null);
  const initiallyPlaying = useRef(false);
  
  // --- [NEW] 评论系统状态 ---
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 20 * 1024 * 1024) {
          alert("文件大小不能超过 20MB 哦！");
          return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClearFile = () => {
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
      if (selectedPhoto) {
          fetch(`/api/comments/${selectedPhoto.id}`)
              .then(res => res.json())
              .then(data => {
                  if (data.status === 'success') setComments(data.data || []);
              })
              .catch(err => console.error("Failed to load comments:", err));
      } else {
          setComments([]);
      }
  }, [selectedPhoto]);

  const handleSubmitComment = async (e) => {
      e.preventDefault();
      if (!newComment.trim() && !selectedFile) return;
      setIsSubmitting(true);
      
      try {
          let media_url = null;
          let media_type = null;
          
          if (selectedFile) {
              const formData = new FormData();
              formData.append("file", selectedFile);
              const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
              const uploadData = await uploadRes.json();
              if (uploadData.status === "success") {
                  media_url = uploadData.url;
                  media_type = selectedFile.type.startsWith('video/') ? 'video' : 'image';
              } else { throw new Error("文件上传失败"); }
          }

          const visitorData = JSON.parse(localStorage.getItem('bob_visitor_data') || '{"name":"未命名","avatar":"https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"}');
          const res = await fetch(`/api/comments`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  photo_id: String(selectedPhoto.id), 
                  content: newComment,
                  media_url,
                  media_type,
                  nickname: visitorData.name,
                  avatar: visitorData.avatar
              })
          });
          const data = await res.json();
          alert(data.message);
          setNewComment("");
          handleClearFile();
      } catch (err) {
          alert("提交失败，请检查网络连接");
          console.error(err);
      } finally {
          setIsSubmitting(false);
      }
  };

  // 1. [接管逻辑] 挂载时强制接管全局 BGM，卸载时恢复
  useEffect(() => {
    if (isBgmPlaying && bgmAudioRef?.current) {
        initiallyPlaying.current = true;
        bgmAudioRef.current.pause();
        setIsBgmPlaying?.(false);
    }
    
    return () => {
        if (initiallyPlaying.current && bgmAudioRef?.current) {
            bgmAudioRef.current.play().catch(e => console.warn("BGM Resume blocked:", e));
            setIsBgmPlaying?.(true);
        }
    };
  }, []); // 仅在挂载和卸载时执行

  // 2. [本地歌单逻辑] 处理本地多曲目切换
  useEffect(() => {
    // 切换曲目时先清理旧音频
    if (localAudioRef.current) {
        localAudioRef.current.pause();
        localAudioRef.current = null;
    }

    // 初始化/播放当前曲目
    const audio = new Audio(PLAYLIST[currentTrackIndex].url);
    audio.loop = true;
    audio.volume = 1.0; // 设置基准音量
    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };
    localAudioRef.current = audio;

    let audioCtx = null;
    const setupMemoryBoost = () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        const source = audioCtx.createMediaElementSource(audio);
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 1.5; // 设置为 1.5 倍音量 (150%)
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
      } catch (e) {
        console.warn("Memory BGM Boost failed:", e);
      }
    };
    
    audio.play()
      .then(() => {
        setIsLocalPlaying(true);
        setupMemoryBoost();
      })
      .catch(e => {
        console.warn("Autoplay blocked:", e);
        setIsLocalPlaying(false);
      });

    return () => {
        if (audioCtx) audioCtx.close();
        if (localAudioRef.current) {
            localAudioRef.current.pause();
            localAudioRef.current = null;
        }
    };
  }, [currentTrackIndex]);

  const toggleLocalMusic = (e) => {
    e.stopPropagation();
    if (!localAudioRef.current) return;
    
    if (isLocalPlaying) {
      localAudioRef.current.pause();
    } else {
      localAudioRef.current.play().catch(err => console.error(err));
    }
    setIsLocalPlaying(!isLocalPlaying);
  };

  const handleNextTrack = (e) => {
    e.stopPropagation();
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // --- [NEW] 处理视频与背景音乐冲突 ---
  const wasPlayingBeforeVideo = useRef(false);
  useEffect(() => {
    if (selectedPhoto?.type === 'video') {
      if (isLocalPlaying) {
        wasPlayingBeforeVideo.current = true;
        if (localAudioRef.current) {
           localAudioRef.current.pause();
           setIsLocalPlaying(false);
        }
      }
    } else if (!selectedPhoto && wasPlayingBeforeVideo.current) {
      if (localAudioRef.current) {
         localAudioRef.current.play().catch(e => console.warn("Video cleanup resume failed:", e));
         setIsLocalPlaying(true);
      }
      wasPlayingBeforeVideo.current = false;
    }
  }, [selectedPhoto]);

  useEffect(() => {
    if (selectedPhoto?.id === 'v7' && videoRef.current) {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioCtx.createMediaElementSource(videoRef.current);
            const gainNode = audioCtx.createGain();
            gainNode.gain.value = 2.5; 
            source.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            return () => { audioCtx.close(); };
        } catch (e) { console.warn("Audio Boost failed:", e); }
    }
  }, [selectedPhoto]);

  useEffect(() => {
    const timer = setTimeout(() => { if (progress < 100) setForceLoad(true); }, 4500); 
    return () => clearTimeout(timer);
  }, [progress]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `body, #root { background: black !important; overflow: hidden; margin: 0; } canvas { background: black !important; }`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const isLoaded = progress === 100 || forceLoad;
  const videoRef = useRef(null);

  const photoPositions = useMemo(() => {
    return PHOTO_DATA.map((_, i) => getNebulaPos(i, PHOTO_DATA.length));
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 5000, backgroundColor: 'black', overflow: 'hidden', color: 'white' }}>
      <AnimatePresence>
        {!isLoaded && (
          <motion.div key="loader" exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, zIndex: 10000, background: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: COLORS.HOT_PINK, fontFamily: 'monospace', letterSpacing: '0.4em', marginBottom: '1.2rem' }}>正在唤醒记忆星海...{Math.round(progress)}%</span>
            <div style={{ width: '240px', height: '1px', background: 'rgba(255,20,147,0.1)', position: 'relative' }}>
                <motion.div style={{ position: 'absolute', height: '100%', background: COLORS.HOT_PINK }} animate={{ width: `${progress}%` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position: 'absolute', top: '2.5rem', left: '2.5rem', zIndex: 6000, display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={onBack} style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(25px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.08)', color: 'white', padding: '1rem 2.2rem', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '10px', fontWeight: '900', letterSpacing: '0.3em', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}><ArrowLeft size={16} strokeWidth={3} /> 返回现实</button>
        
        {/* 专属音乐控制胶囊 - 增强为多曲目切换 */}
        <div 
          style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(30px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.08)', color: 'white', borderRadius: '16px', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)' }}
        >
          <button onClick={toggleLocalMusic} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
             <MusicVisualizer isPlaying={isLocalPlaying} />
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', minWidth: '100px' }}>
            <span style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{PLAYLIST[currentTrackIndex].title}</span>
            <span style={{ fontSize: '9px', fontWeight: '500', opacity: 0.5 }}>{PLAYLIST[currentTrackIndex].artist}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '5px', paddingLeft: '15px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
             <button 
               onClick={toggleLocalMusic}
               title={isLocalPlaying ? "暂停" : "播放"}
               style={{ background: 'none', border: 'none', color: 'white', opacity: 0.6, cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center' }}
               onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
               onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
             >
               {isLocalPlaying ? <Pause size={16} /> : <Play size={16} fill="white" />}
             </button>

             <button
               onClick={handleNextTrack}
               title="切换下一首"
               style={{ background: 'none', border: 'none', color: 'white', opacity: 0.6, cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center' }}
               onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
               onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
             >
               <SkipForward size={16} />
             </button>

             <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', width: '40px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
               {formatTime(currentTime)}
             </span>

             <button
               onClick={() => setShowLyrics(!showLyrics)}
               title="歌词"
               style={{ background: showLyrics ? 'rgba(34,211,238,0.2)' : 'none', border: showLyrics ? '1px solid rgba(34,211,238,0.3)' : 'none', color: showLyrics ? '#22d3ee' : 'white', opacity: 0.6, cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '8px' }}
               onMouseEnter={(e) => { if (!showLyrics) e.currentTarget.style.opacity = '1'; }}
               onMouseLeave={(e) => { if (!showLyrics) e.currentTarget.style.opacity = '0.6'; }}
             >
               <FileText size={16} />
             </button>
          </div>
        </div>
      </div>

      {/* 歌词面板 */}
      <AnimatePresence>
        {showLyrics && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ position: 'absolute', top: '7rem', left: '2.5rem', zIndex: 6000 }}
          >
            <LyricsPanel
              lyricsSource={PLAYLIST[currentTrackIndex].lyrics}
              currentTime={currentTime}
              songTitle={PLAYLIST[currentTrackIndex].title}
              songArtist={PLAYLIST[currentTrackIndex].artist}
              height={160}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <CanvasErrorBoundary>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 15, 80], fov: 42 }} gl={{ alpha: false, antialias: true, logarithmicDepthBuffer: true }}>
        <color attach="background" args={['#000000']} />
        <Suspense fallback={null}>
            <fog attach="fog" args={['#000000', 30, 150]} />
          <group position={[0, -12, 0]}>
            <ParticleWave />
            <StarDust />
            <EnergyBeam />
            <RadiantTree />
            <LuminousPedestal />
            <HeartTop />
            {PHOTO_DATA.map((p, i) => (
              <MediaNode key={p.id} photo={p} position={photoPositions[i]} onSelect={setSelectedPhoto} />
            ))}
          </group>
        </Suspense>
        <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.3} maxPolarAngle={Math.PI / 2 + 0.12} minDistance={45} maxDistance={110} />
      </Canvas>
      </CanvasErrorBoundary>      <AnimatePresence>
        {selectedPhoto && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 7000, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(40px) saturate(200%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.95 }} style={{ position: 'relative', background: 'rgba(10, 10, 20, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderLeft: '2px solid rgba(0, 255, 255, 0.2)', borderTop: '1px solid rgba(255, 182, 193, 0.15)', borderRadius: '32px', overflow: 'hidden', maxWidth: '1150px', width: '100%', display: 'flex', flexDirection: 'row', height: '80vh', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}>
                <button onClick={() => setSelectedPhoto(null)} style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 8000, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white', width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}><X size={20} /></button>
                <div style={{ flex: 1.6, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    {selectedPhoto.type === 'video' ? <video ref={videoRef} src={selectedPhoto.url} autoPlay loop controls style={{ maxHeight: '100%', maxWidth: '100%' }} /> : <img src={selectedPhoto.url} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', transform: selectedPhoto.rotate ? `rotate(${selectedPhoto.rotate}deg)` : 'none', transition: 'transform 0.4s ease' }} />}
                </div>
                <div style={{ flex: 1, padding: '4rem 3rem', color: 'white', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                    <div style={{ color: COLORS.HOT_PINK, display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', flexShrink: 0 }}>
                        <Sparkles size={16} /><span style={{ fontSize: '12px', fontWeight: '900', letterSpacing: '0.4em' }}>精神印记</span>
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1.5rem', lineHeight: '1', letterSpacing: '-0.02em', whiteSpace: 'pre-line', flexShrink: 0 }}>{selectedPhoto.title}</h2>
                    {selectedPhoto.location && selectedPhoto.location !== selectedPhoto.title && (
                        <div style={{ alignSelf: 'flex-start', flexShrink: 0, marginBottom: '2rem' }}>
                            <div style={{ fontSize: '10px', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>拍摄地点 / 备注</div>
                            <span style={{ color: 'white', fontSize: '15px', fontWeight: '500', whiteSpace: 'pre-line' }}>{selectedPhoto.location}</span>
                        </div>
                    )}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
                        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '15px', paddingRight: '10px' }} className="custom-scrollbar">
                           {comments.length === 0 ? (
                               <div style={{ opacity: 0.4, fontSize: '13px', marginTop: '40px', textAlign: 'center' }}>暂无评论，快来抢沙发~</div>
                           ) : (
                               comments.map(c => (
                                   <div key={c.id} style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                                       {c.avatar ? <img src={c.avatar} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }} alt="avatar" /> : <div style={{ width: '36px', height: '36px', borderRadius: '18px', background: 'rgba(255,255,255,0.1)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{c.nickname ? c.nickname.charAt(0) : (c.location ? c.location.charAt(0) : "匿")}</div>}
                                       <div style={{ flex: 1 }}>
                                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                               <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: '600' }}>{c.nickname || "访客"}</span>
                                               <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>来自 {c.location ? c.location.split(' (')[0] : "未知地域"}</span>
                                           </div>
                                           <div style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,0.95)', whiteSpace: 'pre-wrap', marginBottom: '8px' }}>{c.content}</div>
                                           {c.media_url && (
                                               <div style={{ marginBottom: '10px', display: 'inline-block', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                                                   {c.media_type === 'video' ? <video src={c.media_url} style={{ maxWidth: '100%', borderRadius: '8px', maxHeight: '200px' }} controls /> : <img src={c.media_url} style={{ maxWidth: '100%', borderRadius: '8px', maxHeight: '200px' }} alt="comment upload" onClick={() => window.open(c.media_url)} />}
                                               </div>
                                           )}
                                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.15)' }}><span>{c.created_at?.slice(0, 16).replace('T', ' ')}</span></div>
                                       </div>
                                   </div>
                               ))
                           )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                            {previewUrl && (
                                <div style={{ position: 'relative', display: 'inline-block', width: 'fit-content' }}>
                                    {selectedFile?.type?.startsWith('video/') ? <video src={previewUrl} style={{ height: '80px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }} muted /> : <img src={previewUrl} style={{ height: '80px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }} alt="preview" />}
                                    <button type="button" onClick={handleClearFile} style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'black', borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer', color: 'white' }}><XCircle size={20} fill="#fe2c55" /></button>
                                </div>
                            )}
                            <form onSubmit={handleSubmitComment} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input type="file" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} accept="image/*,video/*" />
                                <button type="button" onClick={() => fileInputRef.current?.click()} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', width: '40px', height: '40px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, color: 'white', transition: 'background 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}><ImageIcon size={18} /></button>
                                <div style={{ flex: 1, position: 'relative' }}><input type="text" placeholder={selectedFile ? "添加描述文字..." : "输入你的评论..."} value={newComment} onChange={(e) => setNewComment(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '12px 16px', borderRadius: '24px', outline: 'none', fontSize: '14px', transition: 'all 0.3s' }} onFocus={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }} onBlur={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }} /></div>
                                <button type="submit" disabled={isSubmitting || (!newComment.trim() && !selectedFile)} style={{ background: isSubmitting ? 'transparent' : ((newComment.trim() || selectedFile) ? '#fe2c55' : 'transparent'), color: (newComment.trim() || selectedFile) ? 'white' : 'rgba(255,255,255,0.3)', border: 'none', padding: '10px 16px', borderRadius: '24px', cursor: (newComment.trim() || selectedFile) ? 'pointer' : 'default', fontWeight: 'bold', fontSize: '14px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>发送</button>
                            </form>
                        </div>
                    </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
