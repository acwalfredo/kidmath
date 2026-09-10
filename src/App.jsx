import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Star,
  Trophy,
  Sparkles,
  Volume2,
  VolumeX,
  Award,
  Shield,
  Clock,
  ArrowRight,
  Home,
  CheckCircle2,
  Compass,
  Gift,
  Lock,
  Flame,
  RotateCcw,
  Shapes,
  Plus,
  Minus,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

// --- Web Audio 互動音效生成器 (跨瀏覽器支援，免外部音檔) ---
const playSound = (type, enabled = true) => {
  if (!enabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'correct') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        osc.type = 'triangle';
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.4);
      });
    } else if (type === 'jump') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(580, ctx.currentTime + 0.15);
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } else if (type === 'tap') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 600;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
      osc.type = 'triangle';
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }
  } catch (e) {}
};

// --- 彩帶慶祝特效組件 ---
const Confetti = () => {
  const pieces = useMemo(() => {
    return Array.from({ length: 36 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'][i % 7],
      size: Math.random() * 8 + 8,
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute animate-bounce"
          style={{
            left: `${p.x}%`,
            top: `${10 + Math.random() * 25}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.id % 2 === 0 ? '50%' : '3px',
            transform: `rotate(${p.id * 25}deg)`,
          }}
        />
      ))}
    </div>
  );
};

// --- 高質感幾何圖形向量繪製組件 ---
const ShapeSVG = ({ type, className = "w-16 h-16" }) => {
  switch (type) {
    case 'square': // 正方形
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect x="15" y="15" width="70" height="70" rx="8" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="6" />
        </svg>
      );
    case 'rectangle': // 長方形
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect x="10" y="25" width="80" height="50" rx="8" fill="#10B981" stroke="#047857" strokeWidth="6" />
        </svg>
      );
    case 'circle': // 圓形
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="38" fill="#EF4444" stroke="#B91C1C" strokeWidth="6" />
        </svg>
      );
    case 'triangle': // 三角形
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <polygon points="50,12 12,85 88,85" fill="#F59E0B" stroke="#B45309" strokeWidth="6" strokeLinejoin="round" />
        </svg>
      );
    case 'rhombus': // 菱形
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <polygon points="50,10 88,50 50,90 12,50" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="6" strokeLinejoin="round" />
        </svg>
      );
    case 'trapezoid': // 梯形
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <polygon points="30,20 70,20 90,82 10,82" fill="#EC4899" stroke="#BE185D" strokeWidth="6" strokeLinejoin="round" />
        </svg>
      );
    case 'parallelogram': // 平行四邊形
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <polygon points="32,20 90,20 68,82 10,82" fill="#06B6D4" stroke="#0E7490" strokeWidth="6" strokeLinejoin="round" />
        </svg>
      );
    case 'cube': // 正方體 (3D)
      return (
        <svg viewBox="0 0 100 100" className={className}>
          {/* Top Face */}
          <polygon points="50,10 85,28 50,46 15,28" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="4" strokeLinejoin="round" />
          {/* Left Face */}
          <polygon points="15,28 50,46 50,88 15,70" fill="#2563EB" stroke="#1D4ED8" strokeWidth="4" strokeLinejoin="round" />
          {/* Right Face */}
          <polygon points="50,46 85,28 85,70 50,88" fill="#1D4ED8" stroke="#1E40AF" strokeWidth="4" strokeLinejoin="round" />
        </svg>
      );
    case 'cylinder': // 圓柱體 (3D)
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M20,30 L20,70 A30,15 0 0,0 80,70 L80,30" fill="#34D399" stroke="#047857" strokeWidth="5" />
          <ellipse cx="50" cy="70" rx="30" ry="15" fill="#10B981" stroke="#047857" strokeWidth="5" />
          <ellipse cx="50" cy="30" rx="30" ry="15" fill="#6EE7B7" stroke="#047857" strokeWidth="5" />
        </svg>
      );
    case 'cone': // 圓錐體 (3D)
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <polygon points="50,10 15,75 85,75" fill="#FBBF24" stroke="#D97706" strokeWidth="5" strokeLinejoin="round" />
          <ellipse cx="50" cy="75" rx="35" ry="14" fill="#F59E0B" stroke="#D97706" strokeWidth="5" />
        </svg>
      );
    default:
      return <div className="text-4xl">❓</div>;
  }
};

export default function App() {
  // 畫面路由: 'map' | 'ten-frame' | 'number-line' | 'patterns' | 'balance' | 'shapes' | 'closet' | 'parent'
  const [currentScreen, setCurrentScreen] = useState('map');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [stars, setStars] = useState(28);
  const [streakDays, setStreakDays] = useState(3);
  const [completedCounts, setCompletedCounts] = useState({
    tenFrame: 4,
    numberLine: 3,
    patterns: 5,
    balance: 2,
    shapes: 3,
  });

  const [spriteAccessory, setSpriteAccessory] = useState('crown');
  const [spriteColor, setSpriteColor] = useState('bg-amber-400');

  // 護眼定時器狀態
  const [remainingMinutes, setRemainingMinutes] = useState(15);
  const [showRestModal, setShowRestModal] = useState(false);
  const [celebration, setCelebration] = useState(false);

  // 成就徽章清單
  const badges = [
    { id: 'ten-master', name: '十格陣大師', desc: '完成拖曳湊十法練習', icon: '🌟', unlocked: completedCounts.tenFrame >= 3 },
    { id: 'frog-jumper', name: '數軸跳跳蛙', desc: '掌握逐格跳躍加減法', icon: '🐸', unlocked: completedCounts.numberLine >= 3 },
    { id: 'pattern-detective', name: '規律大偵探', desc: '破解小火車圖形密碼', icon: '🔍', unlocked: completedCounts.patterns >= 3 },
    { id: 'balance-king', name: '天平平衡大師', desc: '成功解出等量代換難題', icon: '⚖️', unlocked: completedCounts.balance >= 2 },
    { id: 'shape-wizard', name: '幾何大魔法師', desc: '認識 10 種平面與立體圖形', icon: '📐', unlocked: completedCounts.shapes >= 2 },
    { id: 'streak-star', name: '堅持小勇士', desc: '連續學習打卡 3 天', icon: '🔥', unlocked: streakDays >= 3 },
    { id: 'super-sprite', name: '小小奧數王', desc: '收集超過 20 顆數學星星', icon: '👑', unlocked: stars >= 20 },
  ];

  const triggerReward = (addedStars = 2) => {
    playSound('correct', soundEnabled);
    setStars((prev) => prev + addedStars);
    setCelebration(true);
    setTimeout(() => setCelebration(false), 2200);
  };

  // 護眼提醒倒計時
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingMinutes((prev) => {
        if (prev <= 1) {
          setShowRestModal(true);
          return 15;
        }
        return prev - 1;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-amber-50 to-emerald-100 text-slate-800 font-sans select-none pb-12">
      {celebration && <Confetti />}

      {/* --- RWD 天空頂部導航欄 --- */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b-4 border-amber-300 shadow-md px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            {currentScreen !== 'map' ? (
              <button
                onClick={() => {
                  playSound('tap', soundEnabled);
                  setCurrentScreen('map');
                }}
                className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl text-xs sm:text-sm transition-transform active:scale-95 shadow-md border-b-2 border-orange-600"
              >
                <Home className="w-4 h-4" />
                <span>返回地圖</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl animate-bounce">🪄</span>
                <span className="font-black text-base sm:text-xl text-amber-900 tracking-wide drop-shadow-sm">
                  幼兒數學小精靈
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* 星星計數器 */}
            <div className="flex items-center gap-1 sm:gap-1.5 bg-amber-100 border-2 border-amber-400 px-2.5 sm:px-3 py-1 rounded-full shadow-inner">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-400 animate-pulse" />
              <span className="font-black text-amber-900 text-sm sm:text-lg">{stars}</span>
            </div>

            {/* 打卡天數 */}
            <div className="hidden sm:flex items-center gap-1 bg-rose-100 border-2 border-rose-300 px-3 py-1 rounded-full text-xs font-black text-rose-700">
              <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>{streakDays} 天連續</span>
            </div>

            {/* 音效切換 */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 sm:p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition border-2 border-slate-300"
              title="開關音效"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* 精靈小屋 */}
            <button
              onClick={() => {
                playSound('tap', soundEnabled);
                setCurrentScreen('closet');
              }}
              className="p-1.5 sm:p-2 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-700 transition border-2 border-pink-300 shadow-sm"
              title="精靈小屋與徽章牆"
            >
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* 家長守護 */}
            <button
              onClick={() => {
                playSound('tap', soundEnabled);
                setCurrentScreen('parent');
              }}
              className="p-1.5 sm:p-2 rounded-2xl bg-indigo-100 hover:bg-indigo-200 text-indigo-700 transition border-2 border-indigo-300 shadow-sm"
              title="家長守護與發展儀表板"
            >
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* --- 主內容路由 --- */}
      <main className="max-w-5xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        {currentScreen === 'map' && (
          <WorldMapView
            onSelectLevel={(key) => {
              playSound('tap', soundEnabled);
              setCurrentScreen(key);
            }}
            completedCounts={completedCounts}
            spriteAccessory={spriteAccessory}
            spriteColor={spriteColor}
          />
        )}

        {currentScreen === 'ten-frame' && (
          <TenFrameModule
            soundEnabled={soundEnabled}
            onSuccess={() => {
              triggerReward(2);
              setCompletedCounts((prev) => ({ ...prev, tenFrame: prev.tenFrame + 1 }));
            }}
            onBack={() => setCurrentScreen('map')}
          />
        )}

        {currentScreen === 'number-line' && (
          <NumberLineModule
            soundEnabled={soundEnabled}
            onSuccess={() => {
              triggerReward(2);
              setCompletedCounts((prev) => ({ ...prev, numberLine: prev.numberLine + 1 }));
            }}
            onBack={() => setCurrentScreen('map')}
          />
        )}

        {currentScreen === 'patterns' && (
          <PatternTrainModule
            soundEnabled={soundEnabled}
            onSuccess={() => {
              triggerReward(3);
              setCompletedCounts((prev) => ({ ...prev, patterns: prev.patterns + 1 }));
            }}
            onBack={() => setCurrentScreen('map')}
          />
        )}

        {currentScreen === 'balance' && (
          <BalanceScaleModule
            soundEnabled={soundEnabled}
            onSuccess={() => {
              triggerReward(3);
              setCompletedCounts((prev) => ({ ...prev, balance: prev.balance + 1 }));
            }}
            onBack={() => setCurrentScreen('map')}
          />
        )}

        {currentScreen === 'shapes' && (
          <ShapesModule
            soundEnabled={soundEnabled}
            onSuccess={() => {
              triggerReward(3);
              setCompletedCounts((prev) => ({ ...prev, shapes: prev.shapes + 1 }));
            }}
            onBack={() => setCurrentScreen('map')}
          />
        )}

        {currentScreen === 'closet' && (
          <SpriteHomeView
            stars={stars}
            badges={badges}
            spriteAccessory={spriteAccessory}
            setSpriteAccessory={setSpriteAccessory}
            spriteColor={spriteColor}
            setSpriteColor={setSpriteColor}
            soundEnabled={soundEnabled}
            onBack={() => setCurrentScreen('map')}
          />
        )}

        {currentScreen === 'parent' && (
          <ParentDashboardView
            completedCounts={completedCounts}
            stars={stars}
            streakDays={streakDays}
            remainingMinutes={remainingMinutes}
            setRemainingMinutes={setRemainingMinutes}
            soundEnabled={soundEnabled}
            onBack={() => setCurrentScreen('map')}
          />
        )}
      </main>

      {/* --- 護眼提醒彈窗 --- */}
      {showRestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border-4 border-amber-300 animate-fade-in">
            <div className="text-6xl mb-3 animate-bounce">🌙</div>
            <h3 className="text-xl font-black text-slate-800 mb-2">小精靈要休息囉！</h3>
            <p className="text-slate-600 text-sm mb-5 font-bold leading-relaxed">
              眼睛動一動，看看窗外綠色的大樹吧！伸個懶腰喝口水，等一下再回來玩喔～
            </p>
            <button
              onClick={() => setShowRestModal(false)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 rounded-2xl shadow-lg border-b-4 border-emerald-700 transition"
            >
              休息好了，繼續冒險！
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 1. 世界地圖視圖 (World Map View)
// ==========================================
function WorldMapView({ onSelectLevel, completedCounts, spriteAccessory, spriteColor }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 歡迎橫幅 */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-white flex items-center justify-between relative overflow-hidden">
        <div className="z-10 max-w-[220px] sm:max-w-md text-white">
          <span className="inline-block bg-white/30 backdrop-blur-md text-white text-[10px] sm:text-xs font-black px-2.5 py-0.5 sm:py-1 rounded-full mb-1.5 border border-white/40">
            ✨ CPA 具象數學探險
          </span>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black drop-shadow-md leading-tight">
            歡迎來到數學奇幻島！
          </h2>
          <p className="text-white/90 text-[11px] sm:text-sm mt-1 font-bold">
            點擊下方島嶼，和小精靈解開數學謎題！
          </p>
        </div>

        {/* 動態精靈角色 (具備圖片檔備用降級機制) */}
        <div className="relative flex flex-col items-center">
          {!imgError ? (
            <div className="relative flex items-center justify-center">
              <img
                src="/images/my-sprite-character.png"
                alt="數學小精靈"
                onError={() => setImgError(true)}
                className="w-16 h-16 sm:w-24 sm:h-24 object-contain animate-bounce drop-shadow-md"
              />
              {spriteAccessory === 'crown' && <span className="absolute -top-4 text-2xl sm:text-3xl">👑</span>}
              {spriteAccessory === 'hat' && <span className="absolute -top-5 text-2xl sm:text-3xl">🧙‍♂️</span>}
              {spriteAccessory === 'glasses' && <span className="absolute text-xl sm:text-2xl">🕶️</span>}
              {spriteAccessory === 'wings' && <span className="absolute -right-3 text-2xl sm:text-3xl">🧚</span>}
            </div>
          ) : (
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${spriteColor} shadow-2xl flex items-center justify-center relative animate-bounce border-4 border-white`}>
              {spriteAccessory === 'crown' && <span className="absolute -top-4 text-2xl sm:text-3xl">👑</span>}
              {spriteAccessory === 'hat' && <span className="absolute -top-5 text-2xl sm:text-3xl">🧙‍♂️</span>}
              {spriteAccessory === 'glasses' && <span className="absolute text-xl sm:text-2xl">🕶️</span>}
              {spriteAccessory === 'wings' && <span className="absolute -right-3 text-2xl sm:text-3xl">🧚</span>}
              <div className="flex gap-1.5 sm:gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-slate-900 rounded-full" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-slate-900 rounded-full" />
              </div>
              <div className="w-4 h-1.5 sm:w-5 sm:h-2 border-b-4 border-slate-900 rounded-full absolute bottom-3" />
            </div>
          )}
        </div>
      </div>

      {/* 五大島嶼矩陣 (全響應式 RWD) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* 島嶼 1：拖曳湊十城堡 */}
        <div
          onClick={() => onSelectLevel('ten-frame')}
          className="bg-white hover:bg-amber-50/50 border-4 border-amber-300 rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 relative group"
        >
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl sm:text-4xl shadow-inner group-hover:scale-110 transition-transform">
              🏰
            </div>
            <span className="bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-full border border-amber-300">
              已通關：{completedCounts.tenFrame} 次
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-800 mt-3 sm:mt-4 group-hover:text-amber-600 transition-colors">
            第 1 島：數字城堡（拖曳湊十法）
          </h3>
          <p className="text-slate-500 text-xs mt-1 font-bold">
            從星星寶盒親手將星星「逐一放入」十格陣，體驗湊滿 10 的快樂！
          </p>
          <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t-2 border-amber-100 flex items-center justify-between text-amber-700 font-black text-xs sm:text-sm">
            <span>放入星星湊成 10 🚀</span>
            <span className="bg-amber-200 px-2 py-0.5 rounded-lg text-xs">⭐️ +2</span>
          </div>
        </div>

        {/* 島嶼 2：奇幼森林逐格跳 */}
        <div
          onClick={() => onSelectLevel('number-line')}
          className="bg-white hover:bg-emerald-50/50 border-4 border-emerald-300 rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 relative group"
        >
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-3xl sm:text-4xl shadow-inner group-hover:scale-110 transition-transform">
              🐸
            </div>
            <span className="bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-full border border-emerald-300">
              已通關：{completedCounts.numberLine} 次
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-800 mt-3 sm:mt-4 group-hover:text-emerald-600 transition-colors">
            第 2 島：奇幼森林（逐格跳跳蛙）
          </h3>
          <p className="text-slate-500 text-xs mt-1 font-bold">
            按鍵讓小青蛙在數軸上「逐格向前跳或後退」，真實感受長度加減！
          </p>
          <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t-2 border-emerald-100 flex items-center justify-between text-emerald-700 font-black text-xs sm:text-sm">
            <span>逐格跳躍加減法 🚀</span>
            <span className="bg-emerald-200 px-2 py-0.5 rounded-lg text-xs">⭐️ +2</span>
          </div>
        </div>

        {/* 島嶼 3：規律小火車 */}
        <div
          onClick={() => onSelectLevel('patterns')}
          className="bg-white hover:bg-purple-50/50 border-4 border-purple-300 rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 relative group"
        >
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-100 border-2 border-purple-300 flex items-center justify-center text-3xl sm:text-4xl shadow-inner group-hover:scale-110 transition-transform">
              🚂
            </div>
            <span className="bg-purple-100 text-purple-900 text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-full border border-purple-300">
              已通關：{completedCounts.patterns} 次
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-800 mt-3 sm:mt-4 group-hover:text-purple-600 transition-colors">
            第 3 島：規律小火車（奧數圖形密碼）
          </h3>
          <p className="text-slate-500 text-xs mt-1 font-bold">
            修復小火車車廂，找出重複的隱藏邏輯規律！
          </p>
          <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t-2 border-purple-100 flex items-center justify-between text-purple-700 font-black text-xs sm:text-sm">
            <span>修復火車軌道 🚀</span>
            <span className="bg-purple-200 px-2 py-0.5 rounded-lg text-xs">⭐️ +3</span>
          </div>
        </div>

        {/* 島嶼 4：神奇天平 */}
        <div
          onClick={() => onSelectLevel('balance')}
          className="bg-white hover:bg-sky-50/50 border-4 border-sky-300 rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 relative group"
        >
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-sky-100 border-2 border-sky-300 flex items-center justify-center text-3xl sm:text-4xl shadow-inner group-hover:scale-110 transition-transform">
              ⚖️
            </div>
            <span className="bg-sky-100 text-sky-900 text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-full border border-sky-300">
              已通關：{completedCounts.balance} 次
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-800 mt-3 sm:mt-4 group-hover:text-sky-600 transition-colors">
            第 4 島：神奇天平（奧數等量代換）
          </h3>
          <p className="text-slate-500 text-xs mt-1 font-bold">
            小動物平衡替換，提前建立小學代數思維！
          </p>
          <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t-2 border-sky-100 flex items-center justify-between text-sky-700 font-black text-xs sm:text-sm">
            <span>讓天平平衡吧 🚀</span>
            <span className="bg-sky-200 px-2 py-0.5 rounded-lg text-xs">⭐️ +3</span>
          </div>
        </div>

        {/* 島嶼 5：魔法幾何形狀王國 */}
        <div
          onClick={() => onSelectLevel('shapes')}
          className="bg-white hover:bg-teal-50/50 border-4 border-teal-300 rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 relative group sm:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-teal-100 border-2 border-teal-300 flex items-center justify-center text-3xl sm:text-4xl shadow-inner group-hover:scale-110 transition-transform">
              📐
            </div>
            <span className="bg-teal-100 text-teal-900 text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-full border border-teal-300">
              已通關：{completedCounts.shapes} 次
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-800 mt-3 sm:mt-4 group-hover:text-teal-600 transition-colors">
            第 5 島：幾何魔法王國（十種平面與立體圖形）
          </h3>
          <p className="text-slate-500 text-xs mt-1 font-bold">
            探索菱形、梯形、長方形、平行四邊形、正方體、圓柱體、圓錐體等邊角特徵！
          </p>
          <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t-2 border-teal-100 flex items-center justify-between text-teal-700 font-black text-xs sm:text-sm">
            <span>進入幾何形狀王國 🚀</span>
            <span className="bg-teal-200 px-2 py-0.5 rounded-lg text-xs">⭐️ +3</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. 湊十法模組 (逐一拖曳/點擊放入格子)
// ==========================================
function TenFrameModule({ soundEnabled, onSuccess, onBack }) {
  const [base, setBase] = useState(7);
  // gridStates 紀錄每個格子的狀態: null 或 'base' 或 'user'
  const [gridCells, setGridCells] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const needed = 10 - base;

  // 初始化十格陣
  useEffect(() => {
    const initial = Array(10).fill(null);
    for (let i = 0; i < base; i++) {
      initial[i] = 'base';
    }
    setGridCells(initial);
    setIsCorrect(false);
  }, [base]);

  // 已由孩子補上的星星數量
  const placedUserCount = gridCells.filter((c) => c === 'user').length;

  // 放入一顆星星到指定空位（支援點擊/拖放）
  const placeStarInCell = (index) => {
    if (isCorrect) return;
    if (gridCells[index] !== null) return; // 格子非空

    playSound('pop', soundEnabled);
    const updated = [...gridCells];
    updated[index] = 'user';
    setGridCells(updated);

    const newUserCount = updated.filter((c) => c === 'user').length;
    if (newUserCount === needed) {
      setIsCorrect(true);
      onSuccess();
    }
  };

  // 點擊已放入的星星可取回
  const removeStarFromCell = (index) => {
    if (isCorrect) return;
    if (gridCells[index] !== 'user') return;

    playSound('tap', soundEnabled);
    const updated = [...gridCells];
    updated[index] = null;
    setGridCells(updated);
  };

  // 一鍵放入第一顆空格
  const handlePickStarFromBox = () => {
    if (isCorrect) return;
    const firstEmptyIndex = gridCells.findIndex((c) => c === null);
    if (firstEmptyIndex !== -1) {
      placeStarInCell(firstEmptyIndex);
    }
  };

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', 'star');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    placeStarInCell(index);
  };

  return (
    <div className="bg-white border-4 border-amber-300 rounded-3xl p-4 sm:p-6 shadow-2xl max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-slate-500 font-black text-xs sm:text-sm flex items-center gap-1 hover:text-slate-800">
          ← 返回地圖
        </button>
        <span className="bg-amber-100 text-amber-900 font-black text-[11px] sm:text-xs px-3 py-1 rounded-full border border-amber-300">
          湊十法：逐一放入星星
        </span>
      </div>

      <div className="text-center mb-5">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">
          城堡原有 <span className="text-amber-600 font-black">{base}</span> 顆金星 ⭐
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm font-bold mt-1">
          請從寶盒中<span className="text-rose-600 underline font-black">拖曳或點擊星星</span>，將十格陣逐一填滿！
        </p>
      </div>

      {/* CPA 核心：2x5 十格陣，支援逐一拖放 / 點擊 */}
      <div className="max-w-md mx-auto bg-amber-100/70 p-3 sm:p-4 rounded-3xl border-4 border-amber-300 mb-6 shadow-inner">
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {gridCells.map((cellState, idx) => {
            const isBase = cellState === 'base';
            const isUser = cellState === 'user';

            return (
              <div
                key={idx}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
                onClick={() => {
                  if (isUser) removeStarFromCell(idx);
                  else if (cellState === null) placeStarInCell(idx);
                }}
                className={`h-14 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black cursor-pointer transition-all border-3 ${
                  isBase
                    ? 'bg-amber-300 border-amber-500 shadow-md'
                    : isUser
                    ? 'bg-emerald-400 border-emerald-600 shadow-lg scale-105 animate-pop'
                    : 'bg-white border-dashed border-amber-300 hover:border-amber-500 hover:bg-amber-50'
                }`}
              >
                {isBase && '⭐'}
                {isUser && '🟢'}
                {!isBase && !isUser && <span className="text-amber-200 text-xs font-bold">{idx + 1}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* 星星寶盒 Supply Box (可拖曳 & 點擊) */}
      {!isCorrect && (
        <div className="bg-amber-50 p-4 rounded-2xl border-2 border-dashed border-amber-300 text-center max-w-md mx-auto mb-6 shadow-sm">
          <div className="text-xs font-black text-amber-800 mb-2">
            🎁 綠星寶盒 (點擊或拖曳綠星入陣)：
          </div>
          <div className="flex justify-center items-center gap-3">
            <div
              draggable
              onDragStart={handleDragStart}
              onClick={handlePickStarFromBox}
              className="w-14 h-14 bg-emerald-400 hover:bg-emerald-500 border-3 border-emerald-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg cursor-grab active:cursor-grabbing transition-transform active:scale-90"
              title="按住拖曳或點擊入格"
            >
              🟢
            </div>
            <div className="text-xs font-bold text-slate-600 text-left">
              已放入：<span className="text-emerald-600 font-black text-base">{placedUserCount}</span> / {needed} 顆
            </div>
          </div>
        </div>
      )}

      {/* 動態算式呈現 */}
      <div className="bg-slate-100 border-2 border-slate-300 rounded-2xl p-3 sm:p-4 max-w-xs mx-auto text-center mb-6 shadow-inner">
        <div className="text-2xl sm:text-3xl font-black tracking-wider text-slate-800">
          <span className="text-amber-600">{base}</span> +{' '}
          <span className="text-emerald-600">{placedUserCount || '?'}</span> = 10
        </div>
      </div>

      {isCorrect && (
        <div className="text-center animate-fade-in">
          <div className="bg-emerald-100 text-emerald-900 border-2 border-emerald-300 font-black px-4 py-2 rounded-2xl mb-4 inline-block shadow-sm text-sm sm:text-base">
            🎉 太棒了！成功放入 {needed} 顆綠星，{base} + {needed} = 10！
          </div>
          <div>
            <button
              onClick={() => setBase((prev) => (prev % 4) + 5)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-black px-6 py-3 rounded-2xl shadow-lg border-b-4 border-amber-700 active:scale-95 transition"
            >
              下一題 ⭐️ +2
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


// ==========================================
// 3. 數軸逐格跳跳蛙模組 (逐格按鍵加減數)
// ==========================================
function NumberLineModule({ soundEnabled, onSuccess, onBack }) {
  const problems = [
    { start: 3, jump: 4, type: 'add', text: '小青蛙原本在 3，請幫牠【向前跳 4 格】！' },
    { start: 8, jump: 3, type: 'sub', text: '小青蛙站在 8，請幫牠【向後退 3 格】！' },
    { start: 5, jump: 5, type: 'add', text: '小青蛙在 5，請幫牠【向前跳 5 格】湊滿 10！' },
    { start: 9, jump: 4, type: 'sub', text: '小青蛙站在 9，請幫牠【向後退 4 格】！' },
  ];

  const [pIndex, setPIndex] = useState(0);
  const currentP = problems[pIndex % problems.length];
  const targetAnswer = currentP.type === 'add' ? currentP.start + currentP.jump : currentP.start - currentP.jump;

  const [currentFrogPos, setCurrentFrogPos] = useState(currentP.start);
  const [steppedCount, setSteppedCount] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setCurrentFrogPos(currentP.start);
    setSteppedCount(0);
    setIsDone(false);
  }, [pIndex]);

  const handleStepHop = (direction) => {
    if (isDone) return;

    playSound('jump', soundEnabled);
    let newPos = currentFrogPos;
    const newSteps = steppedCount + 1;

    if (direction === 'forward') {
      newPos = Math.min(10, currentFrogPos + 1);
    } else {
      newPos = Math.max(0, currentFrogPos - 1);
    }

    setCurrentFrogPos(newPos);
    setSteppedCount(newSteps);

    // 當青蛙到達目標位置時，即完成答題並觸發過關獎勵
    if (newPos === targetAnswer) {
      setIsDone(true);
      onSuccess();
    }
  };

  return (
    <div className="bg-white border-4 border-emerald-300 rounded-3xl p-4 sm:p-6 shadow-2xl max-w-2xl mx-auto">
     <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-slate-500 font-black text-xs sm:text-sm flex items-center gap-1 hover:text-slate-800">
          ← 返回地圖
        </button>
        <span className="bg-emerald-100 text-emerald-900 font-black text-[11px] sm:text-xs px-3 py-1 rounded-full border border-emerald-300">
          數軸跳跳蛙：逐格跳躍
        </span>
      </div>

      <div className="text-center mb-5">
        <h2 className="text-lg sm:text-2xl font-black text-slate-800">
          {currentP.text}
        </h2>
        <div className="mt-2 text-base sm:text-xl font-black text-slate-700 bg-emerald-50 border-2 border-emerald-200 inline-block px-4 py-1 rounded-full">
          {currentP.start} {currentP.type === 'add' ? '+' : '-'} {currentP.jump} = {isDone ? targetAnswer : currentFrogPos}
        </div>
      </div>

      {/* 數軸視覺化 (0 - 10 RWD 比例) */}
      <div className="bg-emerald-50/80 p-4 sm:p-6 rounded-3xl border-3 border-emerald-200 mb-6 relative">
        <div className="relative h-14 sm:h-16 mb-2">
          <div
            className="absolute transition-all duration-300 -translate-x-1/2 flex flex-col items-center"
            style={{ left: `${(currentFrogPos / 10) * 100}%` }}
          >
            <span className="text-3xl sm:text-4xl animate-bounce">🐸</span>
            <span className="text-[10px] sm:text-xs font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full mt-0.5">
              第 {currentFrogPos} 格
            </span>
          </div>
        </div>

        {/* 標尺 */}
        <div className="border-b-4 border-slate-700 flex justify-between relative px-1">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center relative -bottom-2">
              <div className="w-1 sm:w-1.5 h-3 sm:h-4 bg-slate-700 rounded-full" />
              <span className="text-xs sm:text-sm font-black text-slate-700 mt-1">{i}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 步數計數器與逐格控制按鈕 */}
      {!isDone ? (
        <div className="text-center space-y-4">
          <div className="text-xs sm:text-sm font-black text-emerald-800 bg-emerald-100/80 py-1.5 px-4 rounded-xl inline-block">
            🎯 已跳躍步數：<span className="text-rose-600 text-base sm:text-lg">{steppedCount}</span> / {currentP.jump} 格
          </div>

          <div className="flex justify-center gap-3 sm:gap-5">
            {currentP.type === 'sub' && (
              <button
                onClick={() => handleStepHop('backward')}
                className="bg-rose-500 hover:bg-rose-600 text-white font-black px-5 sm:px-7 py-3 rounded-2xl shadow-lg border-b-4 border-rose-700 active:scale-95 transition text-sm sm:text-base flex items-center gap-2"
              >
                <Minus className="w-5 h-5" />
                <span>向後退 1 格</span>
              </button>
            )}

            {currentP.type === 'add' && (
              <button
                onClick={() => handleStepHop('forward')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 sm:px-8 py-3.5 rounded-2xl shadow-xl border-b-4 border-emerald-700 active:scale-95 transition text-base sm:text-lg flex items-center gap-2"
              >
                <Plus className="w-6 h-6" />
                <span>向前跳 1 格 (+1)</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center animate-fade-in">
          <div className="bg-emerald-100 text-emerald-900 border-2 border-emerald-300 font-black px-4 py-2 rounded-2xl mb-4 inline-block text-sm sm:text-base">
            🎉 太棒了！逐格跳躍 {currentP.jump} 次，順利抵達第 {targetAnswer} 格！
          </div>
          <div>
            <button
              onClick={() => setPIndex((prev) => prev + 1)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-black px-6 py-3 rounded-2xl shadow-lg border-b-4 border-amber-700 active:scale-95 transition"
            >
              下一題 ⭐️ +2
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. 規律小火車模組 (Pattern Train Module)
// ==========================================
function PatternTrainModule({ soundEnabled, onSuccess, onBack }) {
  const patternsList = [
    { seq: ['🍎', '🍌', '🍎', '🍌', '?'], answer: '🍎', options: ['🍎', '🍌', '🍇'], desc: '蘋果、香蕉、蘋果、香蕉...下一個是？' },
    { seq: ['⭐', '⭐', '🌙', '⭐', '⭐', '?'], answer: '🌙', options: ['⭐', '🌙', '☀️'], desc: '星星、星星、月亮...規律密碼是？' },
  ];

  const [index, setIndex] = useState(0);
  const current = patternsList[index % patternsList.length];
  const [selected, setSelected] = useState(null);
  const [isSolved, setIsSolved] = useState(false);

  const handleOptionClick = (opt) => {
    setSelected(opt);
    if (opt === current.answer) {
      playSound('correct', soundEnabled);
      setIsSolved(true);
      onSuccess();
    } else {
      playSound('tap', soundEnabled);
    }
  };

  return (
    <div className="bg-white border-4 border-purple-300 rounded-3xl p-4 sm:p-6 shadow-2xl max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-slate-500 font-black text-xs sm:text-sm flex items-center gap-1 hover:text-slate-800">
          ← 返回地圖
        </button>
        <span className="bg-purple-100 text-purple-900 font-black text-[11px] sm:text-xs px-3 py-1 rounded-full border border-purple-300">
          奧數圖形密碼
        </span>
      </div>

      <div className="text-center mb-5">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">圖形密碼小火車</h2>
        <p className="text-slate-500 text-xs sm:text-sm font-bold mt-1">{current.desc}</p>
      </div>

      <div className="bg-purple-50 p-4 sm:p-6 rounded-3xl border-3 border-purple-200 mb-6 shadow-inner overflow-x-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-3 min-w-[280px]">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-600 rounded-2xl flex flex-col items-center justify-center text-white font-black text-[10px] sm:text-xs shadow-md">
            <span className="text-2xl">🚂</span>
          </div>

          {current.seq.map((item, i) => {
            const isMissing = item === '?';
            return (
              <div
                key={i}
                className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black shadow-sm border-2 ${
                  isMissing
                    ? isSolved
                      ? 'bg-emerald-200 border-emerald-400 animate-pulse'
                      : 'bg-white border-dashed border-purple-400'
                    : 'bg-white border-purple-200'
                }`}
              >
                {isMissing ? (isSolved ? selected : '?') : item}
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center">
        <div className="text-xs font-bold text-slate-500 mb-3">請選擇正確車廂補全軌道：</div>
        <div className="flex justify-center gap-3 sm:gap-4">
          {current.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleOptionClick(opt)}
              disabled={isSolved}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl text-2xl sm:text-3xl flex items-center justify-center shadow-md transition border-3 active:scale-95 ${
                selected === opt
                  ? opt === current.answer
                    ? 'bg-emerald-100 border-emerald-500 ring-4 ring-emerald-200'
                    : 'bg-rose-100 border-rose-400'
                  : 'bg-white border-slate-200 hover:border-purple-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {isSolved && (
          <div className="mt-6 animate-fade-in">
            <div className="bg-purple-100 text-purple-900 font-black px-4 py-2 rounded-2xl mb-3 inline-block text-sm sm:text-base">
              🎉 規律破解成功！火車嘟嘟嘟開動囉～
            </div>
            <div>
              <button
                onClick={() => {
                  setIndex((prev) => prev + 1);
                  setSelected(null);
                  setIsSolved(false);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-white font-black px-6 py-3 rounded-2xl shadow-lg border-b-4 border-amber-700 active:scale-95 transition"
              >
                下一節車廂 ⭐️ +3
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 5. 神奇天平模組 (Balance Scale Module)
// ==========================================
function BalanceScaleModule({ soundEnabled, onSuccess, onBack }) {
  const [rabbitCount, setRabbitCount] = useState(0);
  const targetRabbits = 4;
  const isBalanced = rabbitCount === targetRabbits;
  const tiltAngle = Math.max(-10, Math.min(10, (rabbitCount - 4) * 3));

  const addRabbit = () => {
    if (isBalanced) return;
    playSound('tap', soundEnabled);
    const count = rabbitCount + 1;
    setRabbitCount(count);

    if (count === targetRabbits) {
      playSound('correct', soundEnabled);
      onSuccess();
    }
  };

  return (
    <div className="bg-white border-4 border-sky-300 rounded-3xl p-4 sm:p-6 shadow-2xl max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-slate-500 font-black text-xs sm:text-sm flex items-center gap-1 hover:text-slate-800">
          ← 返回地圖
        </button>
        <span className="bg-sky-100 text-sky-900 font-black text-[11px] sm:text-xs px-3 py-1 rounded-full border border-sky-300">
          奧數等量代換
        </span>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">神奇小動物平衡天平</h2>
        <div className="inline-block bg-amber-100 border border-amber-300 px-3 sm:px-4 py-1 rounded-full text-xs font-bold text-amber-900 mt-2">
          已知：1 隻大熊 🐻 = 2 隻小兔 🐰
        </div>
        <p className="text-slate-500 text-xs font-bold mt-2">
          左邊放了 <span className="text-sky-700 font-black">2 隻大熊 🐻🐻</span>，右邊需要幾隻小兔 🐰 才能平手？
        </p>
      </div>

      <div className="bg-sky-50/80 p-4 sm:p-6 rounded-3xl border-3 border-sky-200 mb-6 shadow-inner relative h-44 sm:h-48 flex items-center justify-center">
        <div
          className="w-56 sm:w-64 h-3 bg-amber-800 rounded-full transition-transform duration-500 ease-out relative flex justify-between items-center"
          style={{ transform: `rotate(${tiltAngle}deg)` }}
        >
          <div className="absolute -left-2 top-2 flex flex-col items-center">
            <div className="w-0.5 h-10 sm:h-12 bg-slate-400" />
            <div className="w-20 sm:w-24 h-10 sm:h-12 bg-amber-200 border-2 border-amber-500 rounded-b-2xl shadow-md flex items-center justify-center text-lg sm:text-xl">
              🐻🐻
            </div>
          </div>

          <div className="absolute -right-2 top-2 flex flex-col items-center">
            <div className="w-0.5 h-10 sm:h-12 bg-slate-400" />
            <div className="w-20 sm:w-24 h-10 sm:h-12 bg-amber-200 border-2 border-amber-500 rounded-b-2xl shadow-md flex items-center justify-center text-xs sm:text-sm font-black flex-wrap p-1">
              {rabbitCount === 0 ? '空' : Array.from({ length: rabbitCount }).map((_, i) => <span key={i}>🐰</span>)}
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 flex flex-col items-center">
          <div className="w-4 h-10 sm:h-12 bg-amber-900 rounded-t-md" />
          <div className="w-14 sm:w-16 h-3 bg-amber-950 rounded-full" />
        </div>
      </div>

      <div className="text-center">
        {!isBalanced ? (
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setRabbitCount((p) => Math.max(0, p - 1))}
              className="px-3 sm:px-4 py-2 bg-slate-100 border-2 border-slate-300 rounded-xl font-black text-xs sm:text-sm"
            >
              - 1 隻
            </button>
            <button
              onClick={addRabbit}
              className="bg-sky-500 hover:bg-sky-600 text-white font-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl shadow-lg border-b-4 border-sky-700 active:scale-95 transition text-xs sm:text-sm"
            >
              放一隻小兔 🐰（目前 {rabbitCount} 隻）
            </button>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="bg-emerald-100 text-emerald-900 font-black px-4 py-2 rounded-2xl mb-3 inline-block text-xs sm:text-sm">
              🎉 完美平衡！2 隻熊 = 4 隻小兔！
            </div>
            <div>
              <button
                onClick={() => setRabbitCount(0)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-black px-6 py-3 rounded-2xl shadow-lg border-b-4 border-amber-700 active:scale-95 transition"
              >
                再玩一次 ⭐️ +3
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 6. 幾何王國擴充模組 (10 大幾何形狀題目庫)
// ==========================================
function ShapesModule({ soundEnabled, onSuccess, onBack }) {
  // 多樣化幾何圖形庫
  const shapeQuestions = [
    {
      question: "請找出【四條邊一樣長、傾斜像風箏】的菱形！",
      targetName: "菱形",
      typeKey: "rhombus",
      options: ["rhombus", "square", "circle", "triangle"],
      hint: "就像寶石或風箏一樣斜斜的喔！",
    },
    {
      question: "請找出【兩組對邊一樣長、有 4 個直直角】的長方形！",
      targetName: "長方形",
      typeKey: "rectangle",
      options: ["circle", "rectangle", "square", "trapezoid"],
      hint: "就像門或者黑板一樣扁扁長的喔！",
    },
    {
      question: "請找出【只有一對邊平行、上短下長】的梯形！",
      targetName: "梯形",
      typeKey: "trapezoid",
      options: ["triangle", "parallelogram", "trapezoid", "rhombus"],
      hint: "就像小梯子或提袋的形狀！",
    },
    {
      question: "請找出【兩組對邊平行、傾斜的】平行四邊形！",
      targetName: "平行四邊形",
      typeKey: "parallelogram",
      options: ["rectangle", "parallelogram", "square", "circle"],
      hint: "像正方形被輕輕推斜了一樣喔！",
    },
    {
      question: "這是立體魔術！請找出有【6 個正方形面】的正方體！",
      targetName: "正方體 (3D)",
      typeKey: "cube",
      options: ["square", "cube", "cylinder", "cone"],
      hint: "就像玩遊戲用的骰子或玩具積木！",
    },
    {
      question: "滾滾滾！請找出【上下是圓形、像水管或罐頭】的圓柱體！",
      targetName: "圓柱體 (3D)",
      typeKey: "cylinder",
      options: ["cylinder", "cone", "circle", "cube"],
      hint: "就像喝飲料的罐頭一樣可以滾動！",
    },
    {
      question: "請找出【底面是圓形、頂端尖尖像冰淇淋筒】的圓錐體！",
      targetName: "圓錐體 (3D)",
      typeKey: "cone",
      options: ["triangle", "cylinder", "cone", "cube"],
      hint: "像派對帽子或冰淇淋甜筒喔！",
    },
    {
      question: "小精靈蓋屋頂！請找出【有 3 條邊、3 個尖尖角】的三角形！",
      targetName: "三角形",
      typeKey: "triangle",
      options: ["triangle", "square", "rhombus", "circle"],
      hint: "數數看：1、2、3 條邊！",
    },
  ];

  const [qIndex, setQIndex] = useState(0);
  const current = shapeQuestions[qIndex % shapeQuestions.length];
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelect = (optKey) => {
    setSelected(optKey);
    if (optKey === current.typeKey) {
      playSound('correct', soundEnabled);
      setIsCorrect(true);
      onSuccess();
    } else {
      playSound('tap', soundEnabled);
    }
  };

  return (
    <div className="bg-white border-4 border-teal-300 rounded-3xl p-4 sm:p-6 shadow-2xl max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-slate-500 font-black text-xs sm:text-sm flex items-center gap-1 hover:text-slate-800">
          ← 返回地圖
        </button>
        <span className="bg-teal-100 text-teal-900 font-black text-[11px] sm:text-xs px-3 py-1 rounded-full border border-teal-300">
          幾何圖形魔法王國
        </span>
      </div>

      <div className="text-center mb-5">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">幾何魔法召喚考驗</h2>
        <p className="text-slate-700 text-xs sm:text-sm font-bold mt-2 bg-teal-50 border-2 border-teal-200 p-3 rounded-2xl max-w-md mx-auto leading-relaxed">
          {current.question}
        </p>
      </div>

      {/* 四大視覺化向量圖形選項 (SVG RWD Grid) */}
      <div className="max-w-md mx-auto grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        {current.options.map((optKey, i) => (
          <button
            key={i}
            onClick={() => handleSelect(optKey)}
            disabled={isCorrect}
            className={`h-28 sm:h-32 rounded-3xl flex flex-col items-center justify-center p-2 shadow-md border-4 transition-all active:scale-95 ${
              selected === optKey
                ? optKey === current.typeKey
                  ? 'bg-emerald-100 border-emerald-500 ring-4 ring-emerald-200 scale-105'
                  : 'bg-rose-100 border-rose-400'
                : 'bg-white border-teal-100 hover:border-teal-300 hover:bg-teal-50/50'
            }`}
          >
            <ShapeSVG type={optKey} className="w-16 h-16 sm:w-20 sm:h-20" />
          </button>
        ))}
      </div>

      {isCorrect && (
        <div className="text-center animate-fade-in">
          <div className="bg-teal-100 text-teal-900 font-black px-4 py-2 rounded-2xl mb-4 inline-block border border-teal-300 text-xs sm:text-base">
            🎉 太棒了！成功識別【{current.targetName}】！
          </div>
          <div>
            <button
              onClick={() => {
                setQIndex((prev) => prev + 1);
                setSelected(null);
                setIsCorrect(false);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white font-black px-6 py-3 rounded-2xl shadow-lg border-b-4 border-amber-700 active:scale-95 transition"
            >
              挑戰下一關形狀 ⭐️ +3
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 7. 精靈換裝小屋與成就徽章牆
// ==========================================
function SpriteHomeView({
  stars,
  badges,
  spriteAccessory,
  setSpriteAccessory,
  spriteColor,
  setSpriteColor,
  soundEnabled,
  onBack,
}) {
  const accessories = [
    { id: 'none', name: '自然', icon: '😊', cost: 0 },
    { id: 'crown', name: '皇冠', icon: '👑', cost: 5 },
    { id: 'hat', name: '魔法帽', icon: '🧙‍♂️', cost: 10 },
    { id: 'glasses', name: '墨鏡', icon: '🕶️', cost: 15 },
    { id: 'wings', name: '翅膀', icon: '🧚', cost: 20 },
  ];

  return (
    <div className="bg-white border-4 border-pink-300 rounded-3xl p-4 sm:p-6 shadow-2xl max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-slate-500 font-black text-xs sm:text-sm flex items-center gap-1 hover:text-slate-800">
          ← 返回地圖
        </button>
        <span className="bg-pink-100 text-pink-900 font-black text-[11px] sm:text-xs px-3 py-1 rounded-full border border-pink-300">
          精靈小屋與成就牆
        </span>
      </div>

      <div className="bg-gradient-to-b from-pink-100 to-amber-50 p-4 sm:p-6 rounded-3xl border-3 border-pink-200 mb-6 flex flex-col items-center">
        <div className="relative mb-3">
          <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full ${spriteColor} shadow-xl flex items-center justify-center relative border-4 border-white`}>
            {spriteAccessory === 'crown' && <span className="absolute -top-5 text-3xl sm:text-4xl animate-bounce">👑</span>}
            {spriteAccessory === 'hat' && <span className="absolute -top-6 text-3xl sm:text-4xl animate-bounce">🧙‍♂️</span>}
            {spriteAccessory === 'glasses' && <span className="absolute text-2xl sm:text-3xl">🕶️</span>}
            {spriteAccessory === 'wings' && <span className="absolute -right-4 text-3xl sm:text-4xl">🧚</span>}

            <div className="flex gap-2.5 sm:gap-3">
              <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-slate-900 rounded-full" />
              <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-slate-900 rounded-full" />
            </div>
            <div className="w-5 h-2.5 sm:w-6 sm:h-3 border-b-4 border-slate-900 rounded-full absolute bottom-5 sm:bottom-6" />
          </div>
        </div>

        <div className="flex gap-2">
          {['bg-amber-400', 'bg-rose-400', 'bg-emerald-400', 'bg-sky-400'].map((c) => (
            <button
              key={c}
              onClick={() => {
                playSound('tap', soundEnabled);
                setSpriteColor(c);
              }}
              className={`w-6 h-6 rounded-full ${c} border-2 ${spriteColor === c ? 'border-slate-800 scale-110' : 'border-white'}`}
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm sm:text-base font-black text-slate-800 mb-3 flex items-center gap-1.5">
          <Gift className="w-5 h-5 text-pink-500" />
          <span>精靈換裝衣帽間（累積星星解鎖）</span>
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 sm:gap-3">
          {accessories.map((acc) => {
            const isUnlocked = stars >= acc.cost;
            const isEquipped = spriteAccessory === acc.id;

            return (
              <button
                key={acc.id}
                disabled={!isUnlocked}
                onClick={() => {
                  playSound('tap', soundEnabled);
                  setSpriteAccessory(acc.id);
                }}
                className={`p-2.5 sm:p-3 rounded-2xl border-3 flex flex-col items-center justify-center transition ${
                  isEquipped
                    ? 'bg-pink-100 border-pink-500 ring-2 ring-pink-300 scale-105'
                    : isUnlocked
                    ? 'bg-white border-slate-200 hover:border-pink-300'
                    : 'bg-slate-50 border-dashed border-slate-200 opacity-60'
                }`}
              >
                <span className="text-2xl sm:text-3xl mb-1">{acc.icon}</span>
                <span className="text-[11px] sm:text-xs font-black text-slate-700">{acc.name}</span>
                {!isUnlocked && (
                  <span className="text-[10px] text-amber-600 font-bold mt-1 flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5" /> {acc.cost}⭐️
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-sm sm:text-base font-black text-slate-800 mb-3 flex items-center gap-1.5">
          <Award className="w-5 h-5 text-amber-500" />
          <span>冒險徽章收集館</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-3 sm:p-3.5 rounded-2xl border-2 flex items-center gap-3 ${
                b.unlocked ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-dashed border-slate-200 opacity-50'
              }`}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl ${b.unlocked ? 'bg-amber-200' : 'bg-slate-200'}`}>
                {b.unlocked ? b.icon : '🔒'}
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-black text-slate-800">{b.name}</h5>
                <p className="text-slate-500 text-[11px] sm:text-xs font-bold">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 8. 家長守護與學習儀表板
// ==========================================
function ParentDashboardView({
  completedCounts,
  stars,
  streakDays,
  remainingMinutes,
  setRemainingMinutes,
  soundEnabled,
  onBack,
}) {
  return (
    <div className="bg-white border-4 border-indigo-300 rounded-3xl p-4 sm:p-6 shadow-2xl max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-slate-500 font-black text-xs sm:text-sm flex items-center gap-1 hover:text-slate-800">
          ← 返回地圖
        </button>
        <span className="bg-indigo-100 text-indigo-900 font-black text-[11px] sm:text-xs px-3 py-1 rounded-full border border-indigo-300">
          家長守護與報告
        </span>
      </div>

      <div className="mb-5">
        <h3 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          <span>寶貝的數學思維成長報告</span>
        </h3>
        <p className="text-slate-500 text-xs font-bold mt-1">
          依據 CPA（具象 $\rightarrow$ 圖像 $\rightarrow$ 抽象）教學模型與奧數思維維度統計
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-6">
        <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-center">
          <div className="text-xl sm:text-2xl font-black text-amber-700">{stars}</div>
          <div className="text-[10px] sm:text-xs font-bold text-amber-900 mt-0.5">累積星星</div>
        </div>
        <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200 text-center">
          <div className="text-xl sm:text-2xl font-black text-rose-700">{streakDays} 天</div>
          <div className="text-[10px] sm:text-xs font-bold text-rose-900 mt-0.5">連續打卡</div>
        </div>
        <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-center">
          <div className="text-xl sm:text-2xl font-black text-emerald-700">
            {completedCounts.tenFrame + completedCounts.numberLine + completedCounts.patterns + completedCounts.balance + completedCounts.shapes}
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-emerald-900 mt-0.5">累積通關數</div>
        </div>
      </div>

      {/* 五大維度進度條 */}
      <div className="space-y-3.5 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 mb-6">
        <h4 className="text-xs sm:text-sm font-black text-slate-700">五大維度思維雷達</h4>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span>十格陣數感與拖曳湊十</span>
            <span className="text-amber-600">{Math.min(100, completedCounts.tenFrame * 25)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.min(100, completedCounts.tenFrame * 25)}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span>數軸空間與逐格跳躍加減</span>
            <span className="text-emerald-600">{Math.min(100, completedCounts.numberLine * 25)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.min(100, completedCounts.numberLine * 25)}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span>模式識別與圖形規律</span>
            <span className="text-purple-600">{Math.min(100, completedCounts.patterns * 20)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-purple-400 rounded-full" style={{ width: `${Math.min(100, completedCounts.patterns * 20)}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span>等量代換與邏輯推理</span>
            <span className="text-sky-600">{Math.min(100, completedCounts.balance * 30)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-sky-400 rounded-full" style={{ width: `${Math.min(100, completedCounts.balance * 30)}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span>幾何圖形與空間特徵</span>
            <span className="text-teal-600">{Math.min(100, completedCounts.shapes * 25)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-teal-400 rounded-full" style={{ width: `${Math.min(100, completedCounts.shapes * 25)}%` }} />
          </div>
        </div>
      </div>

      {/* 護眼定時設定 */}
      <div className="bg-indigo-50 p-3.5 sm:p-4 rounded-2xl border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
          <div>
            <h5 className="text-xs sm:text-sm font-black text-slate-800">單次使用時間護眼提醒</h5>
            <p className="text-[11px] sm:text-xs text-slate-500 font-bold">
              距離下次提醒還剩：<span className="text-indigo-700 font-black">{remainingMinutes} 分鐘</span>
            </p>
          </div>
        </div>

        <div className="flex gap-1.5 sm:gap-2">
          {[10, 15, 20].map((m) => (
            <button
              key={m}
              onClick={() => setRemainingMinutes(m)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-black border ${
                remainingMinutes === m ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              {m} 分鐘
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}