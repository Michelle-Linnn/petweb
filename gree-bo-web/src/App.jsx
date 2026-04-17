import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float, Text, MeshWobbleMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

// --- 1. 3D 组件部分 (3D Components) ---

// 3D 盲盒模型组件：霓虹色彩（移除贴图依赖，避免本地文件报错）
const GreeBoBox = ({ vibe, isUnboxing, onOpen }) => {
  const neonGlowColors = {
    chill: '#20E2FF',
    energetic: '#FFD700',
    grumpy: '#FF4D4D',
    mysterious: '#A020F0'
  };

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh onClick={onOpen} castShadow>
        <boxGeometry args={[2, 2, 2]} />
        <MeshWobbleMaterial
          color={neonGlowColors[vibe]}
          emissive={neonGlowColors[vibe]}
          emissiveIntensity={1.2}
          factor={isUnboxing ? 2.5 : 0.1}
          speed={isUnboxing ? 10 : 0.8}
          roughness={0.15}
          metalness={0.6}
        />
        <Text
          position={[0, 0, 1.01]}
          fontSize={0.28}
          color="#fff"
          font="https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8pPU3v51jdEZz9VAbteWv.ttf"
          outlineWidth={0.01}
          outlineColor="#000"
        >
          GREE-BO
        </Text>
      </mesh>
    </Float>
  );
};

// 奖品模型：根据稀有度变换形态
const RewardItem = ({ rarity }) => {
  const config = {
    Legendary: { color: '#FFD700', speed: 8, label: 'GOLDEN TAG' },
    Rare: { color: '#FF007A', speed: 4, label: 'CYBER COLLAR' },
    Common: { color: '#20E2FF', speed: 2, label: 'NEON SNACK' }
  };

  const current = config[rarity] || config.Common;

  return (
    <Float speed={current.speed} rotationIntensity={3}>
      <mesh>
        {rarity === 'Legendary' ? (
          <torusKnotGeometry args={[0.7, 0.2, 128, 32]} />
        ) : (
          <octahedronGeometry args={[0.8, 0]} />
        )}
        <meshStandardMaterial
          color={current.color}
          emissive={current.color}
          emissiveIntensity={1.5}
          wireframe
        />
      </mesh>
      <Text position={[0, -1.8, 0]} fontSize={0.2} color={current.color}>
        {`[ ${rarity.toUpperCase()} FOUND ]`}
      </Text>
    </Float>
  );
};

// --- 2. UI 组件部分 (UI Components) ---

const PetForm = ({ onSubmit }) => (
  <motion.div
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: 100, opacity: 0 }}
    className="glass-panel"
  >
    <h2 style={{ color: '#20E2FF', marginBottom: '20px' }}>GREE-BO PROFILE</h2>
    <form onSubmit={(e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      onSubmit({ name: fd.get('name'), vibe: fd.get('vibe') });
    }}>
      <input name="name" placeholder="PET NAME" required className="retro-input" />
      <select name="vibe" className="retro-input">
        <option value="chill">CHILL (BLUE)</option>
        <option value="energetic">ENERGETIC (GOLD)</option>
        <option value="grumpy">GRUMPY (RED)</option>
        <option value="mysterious">MYSTERIOUS (PURPLE)</option>
      </select>
      <button type="submit" className="retro-btn">INITIALIZE BOX</button>
    </form>
  </motion.div>
);

// --- 3. 主逻辑部分 (Main Application) ---

export default function App() {
  const [stage, setStage] = useState('form'); // form, box, unboxing, reward
  const [petData, setPetData] = useState(null);
  const [reward, setReward] = useState(null);

  const handleStart = (data) => {
    setPetData(data);
    setStage('box');
  };

  const handleUnbox = () => {
    // 防止重复触发
    if (stage !== 'box') return;
    setStage('unboxing');
    // 随机权重算法 (Weighted Randomness)
    setTimeout(() => {
      const rand = Math.random() * 100;
      if (rand < 10) setReward('Legendary');
      else if (rand < 40) setReward('Rare');
      else setReward('Common');
      setStage('reward');
    }, 2000);
  };

  const handleReset = () => {
    setStage('form');
    setReward(null);
    setPetData(null);
  };

  return (
    <div className="app-container">
      {/* 顶部状态栏 */}
      <div className="header">
        <h1 className="logo">GREE-BO™</h1>
        {petData && <span className="pet-tag">TARGET: {petData.name.toUpperCase()}</span>}
      </div>

      <AnimatePresence mode="wait">
        {stage === 'form' && <PetForm key="form" onSubmit={handleStart} />}
      </AnimatePresence>

      {/* 3D 渲染画布 */}
      <div className="canvas-wrapper">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 0, 6]} />
          <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
          <ambientLight intensity={0.4} />

          <Suspense fallback={null}>
            {(stage === 'box' || stage === 'unboxing') && (
              <GreeBoBox
                vibe={petData?.vibe || 'chill'}
                isUnboxing={stage === 'unboxing'}
                onOpen={handleUnbox}
              />
            )}
            {stage === 'reward' && <RewardItem rarity={reward} />}
          </Suspense>

          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      {/* 底部交互提示 */}
      {stage === 'box' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="footer-hint">
          <p>SCAN COMPLETE. CLICK THE BOX TO UNVEIL SURPRISE.</p >
        </motion.div>
      )}

      {stage === 'reward' && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="retro-btn secondary"
          onClick={handleReset}
          style={{ position: 'absolute', bottom: '10%' }}
        >
          REORDER ANOTHER BOX
        </motion.button>
      )}

      <style>{`
        .app-container { width: 100vw; height: 100vh; background: #000; overflow: hidden; position: relative; font-family: 'Courier New', monospace; }
        .canvas-wrapper { position: absolute; inset: 0; z-index: 1; }
        .header { position: absolute; top: 30px; left: 30px; z-index: 10; pointer-events: none; }
        .logo { color: #fff; margin: 0; font-size: 2.5rem; letter-spacing: 5px; text-shadow: 2px 2px #FF007A; }
        .pet-tag { background: #FF007A; color: #fff; padding: 2px 8px; font-size: 0.8rem; }
        .glass-panel { position: absolute; z-index: 100; top: 50%; left: 50%; transform: translate(-50%, -50%);
                       background: rgba(0,0,0,0.85); border: 4px solid #fff; padding: 40px; min-width: 300px; box-shadow: 10px 10px 0px #20E2FF; }
        .retro-input { display: block; width: 100%; margin: 15px 0; padding: 12px; background: #111; color: #20E2FF; border: 2px solid #fff; border-radius: 0; outline: none; box-sizing: border-box; }
        .retro-btn { background: #fff; color: #000; border: none; padding: 15px 30px; font-weight: bold; cursor: pointer; letter-spacing: 2px; width: 100%; transition: 0.2s; font-family: 'Courier New', monospace; }
        .retro-btn:hover { background: #20E2FF; transform: translate(-2px, -2px); box-shadow: 4px 4px 0 #fff; }
        .retro-btn.secondary { width: auto; left: 50%; transform: translateX(-50%); }
        .footer-hint { position: absolute; bottom: 40px; width: 100%; text-align: center; z-index: 10; color: #fff; letter-spacing: 2px; animation: blink 1.5s infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}