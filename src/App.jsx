import React, { useState, useEffect, useMemo, Component } from 'react';
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
  ArrowLeft,
  Home,
  CheckCircle2,
  Compass,
  Gift,
  Lock,
  Flame,
  RotateCcw,
  Shapes,
  MoveHorizontal
} from 'lucide-react';

// --- 防空白頁 React 錯誤捕捉組件 (Error Boundary) ---
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Crash Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4 text-center">
          <div className="bg-white p-6 rounded-3xl shadow-2xl border-4 border-amber-300 max-w-md w-full">
            <div className="text-5xl mb-3">🪄</div>
            <h2 className="text-xl font-black text-slate-800 mb-2">數學魔法暫時休息中</h2>
            <p className="text-slate-600 text-xs font-bold mb-4">
              系統偵測到運行異常，請點擊下方按鈕重新啟動冒險！
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3 rounded-2xl shadow-lg border-b-4 border-emerald-700 active:scale-95 transition"
            >
              🔄 重新加載冒險畫面
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Web Audio 互動音效生成器 (免外部音檔) ---
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
    }
  } catch (e) {}
};

// --- 彩帶慶祝特效 ---
const Confetti = () => {
  const pieces = useMemo(() => {
    return Array.from({ length: 32 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][i % 6],
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
            top: `${10 + Math.random() * 20}%`,
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

// --- 可自訂小精靈角色渲染組件 (支援 my-sprite-character.png 與皇冠/配件同步 Bounce) ---
const SpriteCharacter = ({ spriteColor, spriteAccessory, size = "normal", bounce = true }) => {
  const [imgError, setImgError] = useState(false);

  const containerSizes = {
    small: "w-12 h-12",
    normal: "w-16 h-16 sm:w-20 sm:h-20",
    large: "w-24 h-24 sm:w-28 sm:h-28",
  };

  const accessoryStyles = {
    crown: "absolute -top-5 sm:-top-6 text-2xl sm:text-3xl z-10 drop-shadow-md",
    hat: "absolute -top-6 sm:-top-7 text-2xl sm:text-3xl z-10 drop-shadow-md",
    glasses: "absolute top-1/3 text-xl sm:text-2xl z-10 drop-shadow-md",
    wings: "absolute -right-4 top-1/4 text-2xl sm:text-3xl z-10 drop-shadow-md",
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${bounce ? 'animate-bounce' : ''}`}>
      {/* 皇冠與配件 (與小精靈同在一個 Bounce 容器內，達到完美的同步彈跳) */}
      {spriteAccessory === 'crown' && <span className={accessoryStyles.crown}>👑</span>}
      {spriteAccessory === 'hat' && <span className={accessoryStyles.hat}>🧙‍♂️</span>}
      {spriteAccessory === 'glasses' && <span className={accessoryStyles.glasses}>🕶️</span>}
      {spriteAccessory === 'wings' && <span className={accessoryStyles.wings}>🧚</span>}

      {/* 小精靈主體圖片 (優先使用 my-sprite-character.png，若尚未載入則優雅切換至 CSS 造型) */}
      <div
        className={`${containerSizes[size]} rounded-full ${spriteColor} shadow-2xl flex items-center justify-center relative border-4 border-white overflow-hidden transition-all duration-300`}
      >
        {!imgError ? (
          <img
            src="images/my-sprite-character.png"
            alt="小精靈"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            <div className="flex gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-slate-900 rounded-full" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-slate-900 rounded-full" />
            </div>
            <div className="w-4 sm:w-5 h-1.5 sm:h-2 border-b-4 border-slate-900 rounded-full absolute bottom-3 sm:bottom-4" />
          </div>
        )}
      </div>
    </div>
  );
};

// --- Vector SVG 幾何繪圖渲染組件 (支援多樣 2D & 3D 圖形) ---
const ShapeSVG = ({ type, className = "w-16 h-16" }) => {
  switch (type) {
    case '正方形':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect x="15" y="15" width="70" height="70" rx="6" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="6" />
        </svg>
      );
    case '長方形':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <rect x="10" y="25" width="80" height="50" rx="6" fill="#10b981" stroke="#047857" strokeWidth="6" />
        </svg>
      );
    case '圓形':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="38" fill="#f43f5e" stroke="#be123c" strokeWidth="6" />
        </svg>
      );
    case '三角形':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <polygon points="50,12 88,82 12,82" fill="#f59e0b" stroke="#b45309" strokeWidth="6" strokeLinejoin="round" />
        </svg>
      );
    case '菱形':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <polygon points="50,10 88,50 50,90 12,50" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="6" strokeLinejoin="round" />
        </svg>
      );
    case '梯形':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <polygon points="28,20 72,20 88,80 12,80" fill="#ec4899" stroke="#be185d" strokeWidth="6" strokeLinejoin="round" />
        </svg>
      );
    case '平行四邊形':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <polygon points="30,20 90,20 70,80 10,80" fill="#06b6d4" stroke="#0e7490" strokeWidth="6" strokeLinejoin="round" />
        </svg>
      );
    case '正方體':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M50 12 L85 30 L85 70 L50 88 L15 70 L15 30 Z" fill="#6366f1" stroke="#4338ca" strokeWidth="5" strokeLinejoin="round" />
          <path d="M50 12 L50 88 M15 30 L50 50 L85 30" fill="none" stroke="#4338ca" strokeWidth="5" strokeLinejoin="round" />
        </svg>
      );
    case '圓柱體':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M20 25 L20 75 A 30 12 0 0 0 80 75 L80 25" fill="#f97316" stroke="#c2410c" strokeWidth="5" />
          <ellipse cx="50" cy="25" rx="30" ry="12" fill="#fdba74" stroke="#c2410c" strokeWidth="5" />
          <ellipse cx="50" cy="75" rx="30" ry="12" fill="none" stroke="#c2410c" strokeWidth="5" strokeDasharray="4 4" />
        </svg>
      );
    case '圓錐體':
      return (
        <svg viewBox="0 0 100 100" className={className}>
          <path d="M50 12 L18 78 A 32 12 0 0 0 82 78 Z" fill="#14b8a6" stroke="#0f766e" strokeWidth="5" strokeLinejoin="round" />
          <ellipse cx="50" cy="78" rx="32" ry="12" fill="#5eead4" stroke="#0f766e" strokeWidth="5" />
        </svg>
      );
    default:
      return null;
  }
};

function MainApp() {
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

  const [remainingMinutes, setRemainingMinutes] = useState(15);
  const [showRestModal, setShowRestModal] = useState(false);
  const [celebration, setCelebration] = useState(false);

  const badges = [
    { id: 'ten-master', name: '十格陣大師', desc: '完成拖曳湊十法練習', icon: '🌟', unlocked: (completedCounts.tenFrame || 0) >= 3 },
    { id: 'frog-jumper', name: '數軸跳跳蛙', desc: '掌握逐格前跳與後退運算', icon: '🐸', unlocked: (completedCounts.numberLine || 0) >= 3 },
    { id: 'pattern-detective', name: '規律大偵探', desc: '破解小火車圖形密碼', icon: '🔍', unlocked: (completedCounts.patterns || 0) >= 3 },
    { id: 'balance-king', name: '天平平衡大師', desc: '成功解出等量代換難題', icon: '⚖️', unlocked: (completedCounts.balance || 0) >= 2 },
    { id: 'shape-wizard', name: '幾何形狀大師', desc: '認識 2D 與 3D 圖形與特徵', icon: '📐', unlocked: (completedCounts.shapes || 0) >= 2 },
    { id: 'streak-star', name: '堅持小勇士', desc: '連續學習打卡 3 天', icon: '🔥', unlocked: streakDays >= 3 },
    { id: 'super-sprite', name: '小小奧數王', desc: '收集超過 20 顆數學星星', icon: '👑', unlocked: stars >= 20 },
  ];

  const triggerReward = (addedStars = 2) => {
    playSound('correct', soundEnabled);
    setStars((prev) => prev + addedStars);
    setCelebration(true);
    setTimeout(() => setCelebration(false), 2000);
  };

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
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-amber-50 to-emerald-100 text-slate-800 font-sans select-none pb-12 overflow-x-hidden">
      {celebration && <Confetti />}

      {/* 頂部導航欄 */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b-4 border-amber-300 shadow-md px-3 sm:px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            {currentScreen !== 'map' ? (
              <button
                onClick={() => {
                  playSound('tap', soundEnabled);
                  setCurrentScreen('map');
                }}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-black px-3.5 py-2 rounded-2xl text-xs sm:text-sm transition-transform active:scale-95 shadow-md border-b-2 border-orange-600"
              >
                <Home className="w-4 h-4" />
                <span>返回地圖</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl animate-bounce">🪄</span>
                <span className="font-black text-lg sm:text-xl text-amber-900 tracking-wide drop-shadow-sm">
                  數學小精靈冒險記
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 sm:gap-1.5 bg-amber-100 border-2 border-amber-400 px-2.5 sm:px-3 py-1 rounded-full shadow-inner">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-400 animate-pulse" />
              <span className="font-black text-amber-900 text-sm sm:text-lg">{stars}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1 bg-rose-100 border-2 border-rose-300 px-3 py-1 rounded-full text-xs font-black text-rose-700">
              <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>{streakDays} 天連續</span>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition border-2 border-slate-300"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            <button
              onClick={() => {
                playSound('tap', soundEnabled);
                setCurrentScreen('closet');
              }}
              className="p-2 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-700 transition border-2 border-pink-300 shadow-sm"
              title="精靈小屋與徽章牆"
            >
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={() => {
                playSound('tap', soundEnabled);
                setCurrentScreen('parent');
              }}
              className="p-2 rounded-2xl bg-indigo-100 hover:bg-indigo-200 text-indigo-700 transition border-2 border-indigo-300 shadow-sm"
              title="家長守護與發展儀表板"
            >
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 主要冒險畫面 */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6">
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
              setCompletedCounts((prev) => ({ ...prev, tenFrame: (prev.tenFrame || 0) + 1 }));
            }}
            onBack={() => setCurrentScreen('map')}
          />
        )}

        {currentScreen === 'number-line' && (
          <NumberLineModule
            soundEnabled={soundEnabled}
            onSuccess={() => {
              triggerReward(2);
              setCompletedCounts((prev) => ({ ...prev, numberLine: (prev.numberLine || 0) + 1 }));
            }}
            onBack={() => setCurrentScreen('map')}
          />
        )}

        {currentScreen === 'patterns' && (
          <PatternTrainModule
            soundEnabled={soundEnabled}
            onSuccess={() => {
              triggerReward(3);
              setCompletedCounts((prev) => ({ ...prev, patterns: (prev.patterns || 0) + 1 }));
            }}
            onBack={() => setCurrentScreen('map')}
          />
        )}

        {currentScreen === 'balance' && (
          <BalanceScaleModule
            soundEnabled={soundEnabled}
            onSuccess={() => {
              triggerReward(3);
              setCompletedCounts((prev) => ({ ...prev, balance: (prev.balance || 0) + 1 }));
            }}
            onBack={() => setCurrentScreen('map')}
          />
        )}

        {currentScreen === 'shapes' && (
          <ShapesModule
            soundEnabled={soundEnabled}
            onSuccess={() => {
              triggerReward(3);
              setCompletedCounts((prev) => ({ ...prev, shapes: (prev.shapes || 0) + 1 }));
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

      {/* 護眼休息提醒視窗 */}
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

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}

// 1. 世界地圖視圖
function WorldMapView({ onSelectLevel, completedCounts, spriteAccessory, spriteColor }) {
  const counts = completedCounts || {};
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-5 sm:p-6 shadow-xl border-4 border-white flex items-center justify-between relative overflow-hidden">
        <div className="z-10 max-w-xs md:max-w-md text-white">
          <span className="inline-block bg-white/30 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full mb-2 border border-white/40">
            ✨ CPA 具象數學探險
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black drop-shadow-md">
            歡迎來到數學奇幻島！
          </h2>
          <p className="text-white/90 text-xs sm:text-sm mt-1 font-bold">
            點擊下方島嶼，和你的專屬小精靈一起解開數學謎題！
          </p>
        </div>

        {/* 皇冠與小精靈插圖同步 Bounce 組合 */}
        <div className="relative flex flex-col items-center shrink-0">
          <SpriteCharacter
            spriteColor={spriteColor}
            spriteAccessory={spriteAccessory}
            size="normal"
            bounce={true}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <div
          onClick={() => onSelectLevel('ten-frame')}
          className="bg-white hover:bg-amber-50/50 border-4 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 relative group"
        >
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl sm:text-4xl shadow-inner group-hover:scale-110 transition-transform">
              🏰
            </div>
            <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full border border-amber-300">
              已過關：{counts.tenFrame || 0} 次
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-800 mt-3 sm:mt-4 group-hover:text-amber-600 transition-colors">
            第 1 島：數字城堡（拖曳湊十法）
          </h3>
          <p className="text-slate-500 text-xs mt-1 font-bold">
            十格陣拖曳/點擊填滿星星，感受 10 的合成感！
          </p>
          <div className="mt-3 sm:mt-4 pt-3 border-t-2 border-amber-100 flex items-center justify-between text-amber-700 font-black text-sm">
            <span>進入城堡放星星 🚀</span>
            <span className="bg-amber-200 px-2.5 py-0.5 rounded-lg text-xs">⭐️ +2</span>
          </div>
        </div>

        <div
          onClick={() => onSelectLevel('number-line')}
          className="bg-white hover:bg-emerald-50/50 border-4 border-emerald-300 rounded-3xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 relative group"
        >
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-3xl sm:text-4xl shadow-inner group-hover:scale-110 transition-transform">
              🐸
            </div>
            <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-full border border-emerald-300">
              已過關：{counts.numberLine || 0} 次
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-800 mt-3 sm:mt-4 group-hover:text-emerald-600 transition-colors">
            第 2 島：奇幻森林（逐格跳躍數軸）
          </h3>
          <p className="text-slate-500 text-xs mt-1 font-bold">
            逐格點選向前或向後跳躍，直觀掌握加減法！
          </p>
          <div className="mt-3 sm:mt-4 pt-3 border-t-2 border-emerald-100 flex items-center justify-between text-emerald-700 font-black text-sm">
            <span>一步步向前跳 🚀</span>
            <span className="bg-emerald-200 px-2.5 py-0.5 rounded-lg text-xs">⭐️ +2</span>
          </div>
        </div>

        <div
          onClick={() => onSelectLevel('patterns')}
          className="bg-white hover:bg-purple-50/50 border-4 border-purple-300 rounded-3xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 relative group"
        >
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-100 border-2 border-purple-300 flex items-center justify-center text-3xl sm:text-4xl shadow-inner group-hover:scale-110 transition-transform">
              🚂
            </div>
            <span className="bg-purple-100 text-purple-900 text-xs font-black px-3 py-1 rounded-full border border-purple-300">
              已過關：{counts.patterns || 0} 次
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-800 mt-3 sm:mt-4 group-hover:text-purple-600 transition-colors">
            第 3 島：規律小火車（奧數圖形密碼）
          </h3>
          <p className="text-slate-500 text-xs mt-1 font-bold">
            修復小火車車廂，找出重複的隱藏邏輯規律！
          </p>
          <div className="mt-3 sm:mt-4 pt-3 border-t-2 border-purple-100 flex items-center justify-between text-purple-700 font-black text-sm">
            <span>修復火車軌道 🚀</span>
            <span className="bg-purple-200 px-2.5 py-0.5 rounded-lg text-xs">⭐️ +3</span>
          </div>
        </div>

        <div
          onClick={() => onSelectLevel('balance')}
          className="bg-white hover:bg-sky-50/50 border-4 border-sky-300 rounded-3xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 relative group"
        >
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-sky-100 border-2 border-sky-300 flex items-center justify-center text-3xl sm:text-4xl shadow-inner group-hover:scale-110 transition-transform">
              ⚖️
            </div>
            <span className="bg-sky-100 text-sky-900 text-xs font-black px-3 py-1 rounded-full border border-sky-300">
              已過關：{counts.balance || 0} 次
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-800 mt-3 sm:mt-4 group-hover:text-sky-600 transition-colors">
            第 4 島：神奇天平（奧數等量代換）
          </h3>
          <p className="text-slate-500 text-xs mt-1 font-bold">
            小動物平衡替換，提前建立小學代數思維！
          </p>
          <div className="mt-3 sm:mt-4 pt-3 border-t-2 border-sky-100 flex items-center justify-between text-sky-700 font-black text-sm">
            <span>讓天平平衡吧 🚀</span>
            <span className="bg-sky-200 px-2.5 py-0.5 rounded-lg text-xs">⭐️ +3</span>
          </div>
        </div>

        <div
          onClick={() => onSelectLevel('shapes')}
          className="bg-white hover:bg-teal-50/50 border-4 border-teal-300 rounded-3xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 relative group md:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-teal-100 border-2 border-teal-300 flex items-center justify-center text-3xl sm:text-4xl shadow-inner group-hover:scale-110 transition-transform">
              📐
            </div>
            <span className="bg-teal-100 text-teal-900 text-xs font-black px-3 py-1 rounded-full border border-teal-300">
              已過關：{counts.shapes || 0} 次
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-800 mt-3 sm:mt-4 group-hover:text-teal-600 transition-colors">
            第 5 島：魔法形狀王國（2D 與 3D 幾何特徵）
          </h3>
          <p className="text-slate-500 text-xs mt-1 font-bold">
            辨識菱形、長方形、梯形、平行四邊形、正方體、圓柱體與圓錐體！
          </p>
          <div className="mt-3 sm:mt-4 pt-3 border-t-2 border-teal-100 flex items-center justify-between text-teal-700 font-black text-sm">
            <span>進入幾何形狀王國 🚀</span>
            <span className="bg-teal-200 px-2.5 py-0.5 rounded-lg text-xs">⭐️ +3</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. 湊十法模組 (逐一拖曳 / 放入星星)
function TenFrameModule({ soundEnabled, onSuccess, onBack }) {
  const [base, setBase] = useState(6);
  const [filledCount, setFilledCount] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const needed = 10 - base;

  const handleAddStar = () => {
    if (isCorrect || filledCount >= needed) return;
    playSound('tap', soundEnabled);
    const newCount = filledCount + 1;
    setFilledCount(newCount);

    if (newCount === needed) {
      setIsCorrect(true);
      onSuccess();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, cellIdx) => {
    e.preventDefault();
    if (cellIdx >= base && filledCount < needed) {
      handleAddStar();
    }
  };

  return (
    <div className="bg-white border-4 border-amber-300 rounded-3xl p-4 sm:p-6 shadow-2xl max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-slate-500 font-black text-xs sm:text-sm flex items-center gap-1 hover:text-slate-800">
          ← 返回地圖
        </button>
        <span className="bg-amber-100 text-amber-900 font-black text-xs px-3 py-1 rounded-full border border-amber-300">
          逐一拖曳湊十法
        </span>
      </div>

      <div className="text-center mb-5">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">
          十格陣已有 <span className="text-amber-600">{base}</span> 顆黃金星 ⭐
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm font-bold mt-1">
          請從下方「星星寶盒」拖曳或點擊星星，一顆顆填滿剩餘的空格！
        </p>
      </div>

      <div className="bg-amber-100/70 p-3 sm:p-5 rounded-3xl border-4 border-amber-300 mb-6 shadow-inner">
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {Array.from({ length: 10 }).map((_, idx) => {
            const isBaseCell = idx < base;
            const isFilledCell = idx >= base && idx < base + filledCount;

            return (
              <div
                key={idx}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
                onClick={() => {
                  if (!isBaseCell && !isFilledCell) handleAddStar();
                }}
                className={`h-14 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-4xl font-black transition-all border-3 ${
                  isBaseCell
                    ? 'bg-amber-300 border-amber-500 shadow-md'
                    : isFilledCell
                    ? 'bg-emerald-400 border-emerald-600 shadow-lg scale-105 animate-pulse'
                    : 'bg-white border-dashed border-amber-300 hover:border-amber-500 cursor-pointer'
                }`}
              >
                {isBaseCell && '⭐'}
                {isFilledCell && '🟢'}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl mb-6">
        <div className="text-2xl sm:text-3xl font-black text-slate-800">
          <span className="text-amber-600">{base}</span> +{' '}
          <span className="text-emerald-600 underline font-extrabold">{filledCount}</span> = 10
        </div>

        {!isCorrect && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500">星星寶盒 ➔</span>
            <div
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', 'star')}
              onClick={handleAddStar}
              className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-300 border-3 border-emerald-600 shadow-lg flex items-center justify-center text-3xl cursor-grab active:cursor-grabbing hover:scale-110 transition transform"
              title="按一下或拖曳進格子"
            >
              🟢
            </div>
          </div>
        )}
      </div>

      {isCorrect && (
        <div className="text-center animate-fade-in">
          <div className="bg-emerald-100 text-emerald-900 border-2 border-emerald-300 font-black px-4 py-2 rounded-2xl mb-4 inline-block shadow-sm text-sm sm:text-base">
            🎉 成功放入 {needed} 顆星星！{base} + {needed} = 10 滿十成功！
          </div>
          <div>
            <button
              onClick={() => {
                setBase((prev) => (prev % 4) + 5);
                setFilledCount(0);
                setIsCorrect(false);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white font-black px-6 py-3 rounded-2xl shadow-lg border-b-4 border-amber-700 active:scale-95 transition text-sm sm:text-base"
            >
              挑戰下一個數字城堡 ⭐️ +2
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 3. 數軸逐格跳跳蛙模組 (逐格按鍵加減數)
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

    if (direction === 'forward') {
      newPos = Math.min(10, currentFrogPos + 1);
    } else {
      newPos = Math.max(0, currentFrogPos - 1);
    }

    setCurrentFrogPos(newPos);
    setSteppedCount((prev) => prev + 1);

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
        <span className="bg-emerald-100 text-emerald-900 font-black text-xs px-3 py-1 rounded-full border border-emerald-300">
          數軸逐格按鍵跳躍
        </span>
      </div>

      <div className="text-center mb-5">
        <h2 className="text-lg sm:text-2xl font-black text-slate-800">
          {currentP.text}
        </h2>
        <div className="mt-2 text-lg sm:text-xl font-black text-slate-700 bg-emerald-50 border-2 border-emerald-200 inline-block px-4 py-1 rounded-full">
          {currentP.start} {currentP.type === 'add' ? '+' : '-'} {currentP.jump} = {isDone ? targetAnswer : '?'}
        </div>
      </div>

      <div className="bg-emerald-50/90 p-4 sm:p-6 rounded-3xl border-3 border-emerald-200 mb-6 relative">
        <div className="relative h-16 mb-2">
          <div
            className="absolute transition-all duration-300 -translate-x-1/2 flex flex-col items-center"
            style={{ left: `${(currentFrogPos / 10) * 100}%` }}
          >
            <span className="text-3xl sm:text-4xl animate-bounce">🐸</span>
            <span className="text-xs font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full mt-0.5">
              {currentFrogPos}
            </span>
          </div>
        </div>

        <div className="border-b-4 border-slate-700 flex justify-between relative px-1">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center relative -bottom-2">
              <div className="w-1 sm:w-1.5 h-3 sm:h-4 bg-slate-700 rounded-full" />
              <span className="text-xs sm:text-sm font-black text-slate-700 mt-1">{i}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        {!isDone ? (
          <div className="flex justify-center items-center gap-3 sm:gap-4">
            <button
              onClick={() => handleStepHop('backward')}
              className="bg-rose-500 hover:bg-rose-600 text-white font-black px-4 sm:px-6 py-3 rounded-2xl shadow-lg border-b-4 border-rose-700 active:scale-95 transition text-sm sm:text-base flex items-center gap-1.5"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>-1 向後退</span>
            </button>

            <button
              onClick={() => handleStepHop('forward')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-4 sm:px-6 py-3 rounded-2xl shadow-lg border-b-4 border-emerald-700 active:scale-95 transition text-sm sm:text-base flex items-center gap-1.5"
            >
              <span>+1 向前跳</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="bg-emerald-100 text-emerald-900 border-2 border-emerald-300 font-black px-4 py-2 rounded-2xl mb-4 inline-block text-sm sm:text-base">
              🎉 棒極了！小青蛙成功抵達第 {targetAnswer} 格！
            </div>
            <div>
              <button
                onClick={() => setPIndex((prev) => prev + 1)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-black px-6 py-3 rounded-2xl shadow-lg border-b-4 border-amber-700 active:scale-95 transition text-sm sm:text-base"
              >
                挑戰下一題跳躍 ⭐️ +2
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 4. 規律小火車模組
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
        <span className="bg-purple-100 text-purple-900 font-black text-xs px-3 py-1 rounded-full border border-purple-300">
          奧數圖形密碼
        </span>
      </div>

      <div className="text-center mb-5">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">圖形密碼小火車</h2>
        <p className="text-slate-500 text-xs sm:text-sm font-bold mt-1">{current.desc}</p>
      </div>

      <div className="bg-purple-50 p-4 sm:p-6 rounded-3xl border-3 border-purple-200 mb-6 shadow-inner overflow-x-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-3 min-w-[280px]">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-600 rounded-2xl flex flex-col items-center justify-center text-white font-black text-xs shadow-md shrink-0">
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
                className="bg-amber-500 hover:bg-amber-600 text-white font-black px-6 py-3 rounded-2xl shadow-lg border-b-4 border-amber-700 active:scale-95 transition text-sm sm:text-base"
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

// 5. 神奇天平模組
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
        <span className="bg-sky-100 text-sky-900 font-black text-xs px-3 py-1 rounded-full border border-sky-300">
          奧數等量代換
        </span>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">神奇小動物平衡天平</h2>
        <div className="inline-block bg-amber-100 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold text-amber-900 mt-1.5">
          已知：1 隻大熊 🐻 = 2 隻小兔 🐰
        </div>
        <p className="text-slate-500 text-xs sm:text-sm font-bold mt-2">
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
              className="bg-sky-500 hover:bg-sky-600 text-white font-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl shadow-lg border-b-4 border-sky-700 active:scale-95 transition text-xs sm:text-sm"
            >
              放一隻小兔 🐰（目前 {rabbitCount} 隻）
            </button>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="bg-emerald-100 text-emerald-900 font-black px-4 py-2 rounded-2xl mb-3 inline-block text-sm sm:text-base">
              🎉 完美平衡！2 隻熊 = 4 隻小兔！
            </div>
            <div>
              <button
                onClick={() => setRabbitCount(0)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-black px-6 py-3 rounded-2xl shadow-lg border-b-4 border-amber-700 active:scale-95 transition text-sm sm:text-base"
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

// 6. 魔法形狀王國模組
function ShapesModule({ soundEnabled, onSuccess, onBack }) {
  const shapeQuestions = [
    {
      question: "請找出【四條邊一樣長、平行傾斜】的「菱形」！",
      targetName: "菱形",
      options: ["正方形", "菱形", "長方形", "圓形"],
    },
    {
      question: "請找出【對邊一樣長、有 4 個直角】的「長方形」！",
      targetName: "長方形",
      options: ["三角形", "長方形", "梯形", "正方形"],
    },
    {
      question: "請找出【只有一對對邊平行】的「梯形」！",
      targetName: "梯形",
      options: ["梯形", "平行四邊形", "菱形", "圓形"],
    },
    {
      question: "請找出【兩組對邊互相平行】的「平行四邊形」！",
      targetName: "平行四邊形",
      options: ["三角形", "平行四邊形", "正方形", "長方形"],
    },
    {
      question: "請找出 3D 立體有 6 個正方形面的「正方體」！",
      targetName: "正方體",
      options: ["正方形", "正方體", "圓柱體", "圓錐體"],
    },
    {
      question: "請找出上下是圓形、像水管一樣的「圓柱體」！",
      targetName: "圓柱體",
      options: ["圓柱體", "圓錐體", "圓形", "正方體"],
    },
    {
      question: "請找出頂端尖尖、底部是圓形的「圓錐體」！",
      targetName: "圓錐體",
      options: ["圓錐體", "圓柱體", "三角形", "菱形"],
    },
  ];

  const [qIndex, setQIndex] = useState(0);
  const current = shapeQuestions[qIndex % shapeQuestions.length];
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelect = (shapeName) => {
    setSelectedOption(shapeName);
    if (shapeName === current.targetName) {
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
        <span className="bg-teal-100 text-teal-900 font-black text-xs px-3 py-1 rounded-full border border-teal-300">
          2D/3D 幾何特徵王國
        </span>
      </div>

      <div className="text-center mb-5">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">魔法形狀王國</h2>
        <p className="text-slate-600 text-xs sm:text-sm font-bold mt-2 bg-teal-50 border-2 border-teal-200 p-3 rounded-2xl max-w-md mx-auto">
          {current.question}
        </p>
      </div>

      <div className="max-w-md mx-auto grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        {current.options.map((shapeName, i) => (
          <button
            key={i}
            onClick={() => handleSelect(shapeName)}
            disabled={isCorrect}
            className={`p-3 sm:p-4 rounded-3xl flex flex-col items-center justify-center gap-2 shadow-lg border-4 transition-all active:scale-95 ${
              selectedOption === shapeName
                ? shapeName === current.targetName
                  ? 'bg-emerald-100 border-emerald-500 ring-4 ring-emerald-200 scale-105'
                  : 'bg-rose-100 border-rose-400'
                : 'bg-white border-teal-100 hover:border-teal-300'
            }`}
          >
            <ShapeSVG type={shapeName} className="w-14 h-14 sm:w-16 sm:h-16" />
            <span className="text-xs sm:text-sm font-black text-slate-800">{shapeName}</span>
          </button>
        ))}
      </div>

      {isCorrect && (
        <div className="text-center animate-fade-in">
          <div className="bg-teal-100 text-teal-900 font-black px-4 py-2 rounded-2xl mb-4 inline-block border border-teal-300 text-sm sm:text-base">
            🎉 太棒了！成功識別【{current.targetName}】！
          </div>
          <div>
            <button
              onClick={() => {
                setQIndex((prev) => prev + 1);
                setSelectedOption(null);
                setIsCorrect(false);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white font-black px-6 py-3 rounded-2xl shadow-lg border-b-4 border-amber-700 active:scale-95 transition text-sm sm:text-base"
            >
              挑戰下一個幾何形狀 ⭐️ +3
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 7. 精靈換裝小屋與成就徽章牆
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
        <span className="bg-pink-100 text-pink-900 font-black text-xs px-3 py-1 rounded-full border border-pink-300">
          精靈小屋與成就牆
        </span>
      </div>

      <div className="bg-gradient-to-b from-pink-100 to-amber-50 p-5 rounded-3xl border-3 border-pink-200 mb-6 flex flex-col items-center">
        <div className="relative mb-3">
          <SpriteCharacter
            spriteColor={spriteColor}
            spriteAccessory={spriteAccessory}
            size="large"
            bounce={true}
          />
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
        <h4 className="text-xs sm:text-base font-black text-slate-800 mb-3 flex items-center gap-1.5">
          <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
          <span>精靈換裝衣帽間（累積星星解鎖，不扣星星）</span>
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
        <h4 className="text-xs sm:text-base font-black text-slate-800 mb-3 flex items-center gap-1.5">
          <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
          <span>冒險徽章收集館</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(badges || []).map((b) => (
            <div
              key={b.id}
              className={`p-3 rounded-2xl border-2 flex items-center gap-3 ${
                b.unlocked ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-dashed border-slate-200 opacity-50'
              }`}
            >
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl ${b.unlocked ? 'bg-amber-200' : 'bg-slate-200'}`}>
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

// 8. 家長守護與學習儀表板
function ParentDashboardView({
  completedCounts,
  stars,
  streakDays,
  remainingMinutes,
  setRemainingMinutes,
  soundEnabled,
  onBack,
}) {
  const counts = completedCounts || {};
  return (
    <div className="bg-white border-4 border-indigo-300 rounded-3xl p-4 sm:p-6 shadow-2xl max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-slate-500 font-black text-xs sm:text-sm flex items-center gap-1 hover:text-slate-800">
          ← 返回地圖
        </button>
        <span className="bg-indigo-100 text-indigo-900 font-black text-xs px-3 py-1 rounded-full border border-indigo-300">
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
          <div className="text-[11px] sm:text-xs font-bold text-amber-900 mt-1">累積星星</div>
        </div>
        <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200 text-center">
          <div className="text-xl sm:text-2xl font-black text-rose-700">{streakDays} 天</div>
          <div className="text-[11px] sm:text-xs font-bold text-rose-900 mt-1">連續打卡</div>
        </div>
        <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-center">
          <div className="text-xl sm:text-2xl font-black text-emerald-700">
            {(counts.tenFrame || 0) + (counts.numberLine || 0) + (counts.patterns || 0) + (counts.balance || 0) + (counts.shapes || 0)}
          </div>
          <div className="text-[11px] sm:text-xs font-bold text-emerald-900 mt-1">累積通關數</div>
        </div>
      </div>

      <div className="space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 mb-6">
        <h4 className="text-xs sm:text-sm font-black text-slate-700">五大維度思維雷達</h4>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span>十格陣數感與拖曳湊十法</span>
            <span className="text-amber-600">{Math.min(100, (counts.tenFrame || 0) * 25)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.min(100, (counts.tenFrame || 0) * 25)}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span>數軸空間與逐格跳躍加減數</span>
            <span className="text-emerald-600">{Math.min(100, (counts.numberLine || 0) * 25)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.min(100, (counts.numberLine || 0) * 25)}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span>模式識別與圖形規律</span>
            <span className="text-purple-600">{Math.min(100, (counts.patterns || 0) * 20)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-purple-400 rounded-full" style={{ width: `${Math.min(100, (counts.patterns || 0) * 20)}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span>等量代換與邏輯推理</span>
            <span className="text-sky-600">{Math.min(100, (counts.balance || 0) * 30)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-sky-400 rounded-full" style={{ width: `${Math.min(100, (counts.balance || 0) * 30)}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span>2D/3D 幾何圖形與空間特徵</span>
            <span className="text-teal-600">{Math.min(100, (counts.shapes || 0) * 25)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-teal-400 rounded-full" style={{ width: `${Math.min(100, (counts.shapes || 0) * 25)}%` }} />
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-indigo-600 shrink-0" />
          <div>
            <h5 className="text-xs sm:text-sm font-black text-slate-800">單次使用時間護眼提醒</h5>
            <p className="text-[11px] sm:text-xs text-slate-500 font-bold">
              距離下次提醒還剩：<span className="text-indigo-700 font-black">{remainingMinutes} 分鐘</span>
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {[10, 15, 20].map((m) => (
            <button
              key={m}
              onClick={() => setRemainingMinutes(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border ${
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