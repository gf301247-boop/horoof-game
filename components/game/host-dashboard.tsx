'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3X3, CheckCircle, XCircle, RotateCcw, Monitor, Eye, Shuffle, Clock, Plus, Minus } from 'lucide-react';
import { HexGrid } from './hex-grid';
import { WinCelebration } from './win-celebration';
import { useGame } from '@/lib/game-context';
import { GRID_SIZES } from '@/lib/game-types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mini hex cell for the mini-map
function MiniHexCell({
  letter,
  owner,
  isSelected,
  isWinningPath,
  onClick
}: {
  letter: string;
  owner: 'blue' | 'red' | null;
  isSelected: boolean;
  isWinningPath: boolean;
  onClick: () => void;
}) {
  const blueColor = 'oklch(0.65 0.22 250)';
  const redColor = 'oklch(0.6 0.25 25)';

  return (
    <button
      onClick={onClick}
      disabled={owner !== null}
      className={`
        w-10 h-11 relative flex items-center justify-center
        transition-all duration-200 rounded-md
        ${owner === null ? 'hover:bg-secondary cursor-pointer' : 'cursor-default'}
        ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
        ${isWinningPath ? 'animate-pulse' : ''}
      `}
      style={{
        backgroundColor: owner === 'blue'
          ? blueColor
          : owner === 'red'
            ? redColor
            : 'oklch(0.2 0.02 250)',
        boxShadow: isWinningPath
          ? `0 0 10px ${owner === 'blue' ? blueColor : redColor}`
          : 'none',
      }}
    >
      <span className={`text-xs font-bold ${owner ? 'text-foreground' : 'text-muted-foreground'}`}>
        {letter}
      </span>
    </button>
  );
}

// Host control panel for active question
function HostControlPanel() {
  const { selectedHex, awardBlue, awardRed, passWrong, deselectHex, resetSessionMemory, usedQuestionIds } = useGame();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedHex.isOpen) return;

      if (e.key === 'b' || e.key === 'B' || e.key === '1') {
        awardBlue();
      } else if (e.key === 'r' || e.key === 'R' || e.key === '3') {
        awardRed();
      } else if (e.key === 'x' || e.key === 'X' || e.key === '2' || e.key === 'Escape') {
        passWrong();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedHex.isOpen, awardBlue, awardRed, passWrong]);

  if (!selectedHex.hex || !selectedHex.isOpen) {
    return (
      <div className="bg-secondary/30 rounded-2xl p-6 border border-border/30 text-center">
        <Eye className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
        <p className="text-muted-foreground">اختر خلية من اللوحة لبدء السؤال</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card/90 backdrop-blur-xl rounded-2xl border border-border/50 overflow-hidden"
      style={{
        boxShadow: '0 0 40px oklch(0.5 0.2 250 / 0.1)',
      }}
    >
      {/* Header */}
      <div className="bg-secondary/30 px-6 py-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Letter */}
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, oklch(0.65 0.22 250 / 0.3), oklch(0.6 0.25 25 / 0.3))',
              }}
            >
              <span className="text-4xl font-bold text-foreground">{selectedHex.hex.letter}</span>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">اختيار الفائز</p>
              <p className="text-xl font-bold text-foreground">
                الأزرق أو الأحمر
              </p>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={deselectHex}>
            <XCircle className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Question & Answer */}
      <div className="p-6 space-y-4">
        {(() => {
          const questionData = selectedHex.question;
          return (
            <>
              {/* Question */}
              <div className="bg-secondary/20 rounded-xl p-4 border border-border/20">
                <p className="text-sm text-muted-foreground mb-2">السؤال</p>
                <p className="text-lg text-foreground leading-relaxed">
                  {questionData?.question || `أذكر كلمة تبدأ بحرف ${selectedHex.hex.letter}`}
                </p>
              </div>

              {/* Answer - Host Only */}
              <div
                className="rounded-xl p-4 border-2 border-dashed"
                style={{
                  borderColor: 'oklch(0.5 0.15 120)',
                  backgroundColor: 'oklch(0.5 0.15 120 / 0.1)',
                }}
              >
                <p className="text-sm mb-2" style={{ color: 'oklch(0.6 0.15 120)' }}>الإجابة الصحيحة (للمقدم فقط)</p>
                <p className="text-2xl font-bold text-foreground">
                  {questionData?.correctAnswer || `كلمة تبدأ بحرف ${selectedHex.hex.letter}`}
                </p>
              </div>
            </>
          );
        })()}
      </div>

      {/* Action Buttons */}
      <div className="p-6 pt-0">
        <div className="grid grid-cols-3 gap-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={awardBlue}
              className="w-full h-14 font-bold text-base rounded-xl text-foreground"
              style={{
                backgroundColor: 'oklch(0.65 0.22 250)',
                boxShadow: '0 0 20px oklch(0.5 0.22 250 / 0.4)',
              }}
            >
              <CheckCircle className="w-5 h-5 ml-2" />
              أزرق [B]
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={passWrong}
              variant="outline"
              className="w-full h-14 bg-secondary/50 hover:bg-secondary border-border font-bold text-base rounded-xl"
            >
              <XCircle className="w-5 h-5 ml-2" />
              خطأ [X]
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={awardRed}
              className="w-full h-14 font-bold text-base rounded-xl text-foreground"
              style={{
                backgroundColor: 'oklch(0.6 0.25 25)',
                boxShadow: '0 0 20px oklch(0.45 0.25 25 / 0.4)',
              }}
            >
              <CheckCircle className="w-5 h-5 ml-2" />
              أحمر [R]
            </Button>
          </motion.div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            الذاكرة: {usedQuestionIds.length} سؤال مستخدم
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={resetSessionMemory}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            تصفير الذاكرة
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function HostDashboard() {
  const { gameState, gridSize, selectHex, changeGridSize, playAgain, shuffleQuestions, selectedHex, changeTimerDuration } = useGame();

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-50">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(oklch(0.5 0.1 250 / 0.2) 1px, transparent 1px),
              linear-gradient(90deg, oklch(0.5 0.1 250 / 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-primary/20 px-3 py-1.5 rounded-full">
              <Monitor className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary">لوحة التحكم</span>
            </div>

            {/* Grid Size Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-secondary/80 border-border/50 gap-2"
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span className="font-bold">{gridSize}x{gridSize}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-card/95 backdrop-blur-xl border-border/50">
                {GRID_SIZES.map((size) => (
                  <DropdownMenuItem
                    key={size}
                    onClick={() => changeGridSize(size)}
                    className={`cursor-pointer ${size === gridSize ? 'bg-primary/20 text-primary' : ''}`}
                  >
                    <span className="font-bold">{size}x{size}</span>
                    <span className="mr-2 text-muted-foreground text-xs">({size * size} خلية)</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Reset Game */}
            <Button variant="outline" size="sm" onClick={playAgain} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              لعبة جديدة
            </Button>

            {/* Shuffle / New Game with questions */}
            <Button
              variant="outline"
              size="sm"
              onClick={shuffleQuestions}
              className="gap-2"
            >
              <Shuffle className="w-4 h-4" />
              خلط الأسئلة
            </Button>
          </div>

          {/* Scores */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                style={{
                  backgroundColor: 'oklch(0.65 0.22 250)',
                  boxShadow: 'none',
                }}
              >
                {gameState.blueScore}
              </div>
              <span className="text-sm font-bold" style={{ color: 'oklch(0.65 0.22 250)' }}>أزرق</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: 'oklch(0.6 0.25 25)' }}>أحمر</span>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                style={{
                  backgroundColor: 'oklch(0.6 0.25 25)',
                  boxShadow: 'none',
                }}
              >
                {gameState.redScore}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Mini Board */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Grid3X3 className="w-5 h-5" />
              اللوحة
            </h2>

            {/* Mini grid */}
            <div className="flex justify-center">
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                }}
              >
                {gameState.hexagons.map((hex) => (
                  <MiniHexCell
                    key={hex.id}
                    letter={hex.letter}
                    owner={hex.owner}
                    isSelected={selectedHex.hex?.id === hex.id}
                    isWinningPath={hex.isWinningPath}
                    onClick={() => selectHex(hex)}
                  />
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'oklch(0.65 0.22 250)' }} />
                <span className="text-muted-foreground">أزرق (أعلى ↔ أسفل)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'oklch(0.6 0.25 25)' }} />
                <span className="text-muted-foreground">أحمر (يسار ↔ يمين)</span>
              </div>
            </div>
          </div>

          {/* Right: Control Panel */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              لوحة التحكم
            </h2>

            <AnimatePresence mode="wait">
              <HostControlPanel key={selectedHex.hex?.id || 'empty'} />
            </AnimatePresence>

            {/* Timer Settings */}
            <div className="mt-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
              <h3 className="text-md font-bold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                إعدادات المؤقت
              </h3>
              <div className="flex items-center justify-between bg-secondary/30 rounded-xl p-4 border border-border/30">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-foreground w-12 text-center">
                    {gameState.timerDuration}
                  </div>
                  <span className="text-muted-foreground">ثانية</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => changeTimerDuration(Math.max(5, gameState.timerDuration - 5))}
                    className="w-12 h-12 rounded-xl bg-secondary hover:bg-secondary/80 border-border/50"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => changeTimerDuration(Math.min(300, gameState.timerDuration + 5))}
                    className="w-12 h-12 rounded-xl bg-secondary hover:bg-secondary/80 border-border/50"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Keyboard shortcuts */}
            <div className="mt-4 bg-secondary/30 rounded-xl p-4 border border-border/30">
              <p className="text-sm text-muted-foreground mb-2">اختصارات لوحة المفاتيح:</p>
              <div className="flex flex-wrap gap-2">
                <kbd className="px-2 py-1 bg-background rounded text-xs font-mono">B / 1</kbd>
                <span className="text-xs text-muted-foreground">أزرق صحيح</span>
                <kbd className="px-2 py-1 bg-background rounded text-xs font-mono mr-4">X / 2</kbd>
                <span className="text-xs text-muted-foreground">خطأ</span>
                <kbd className="px-2 py-1 bg-background rounded text-xs font-mono mr-4">R / 3</kbd>
                <span className="text-xs text-muted-foreground">أحمر صحيح</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Win Celebration */}
      <WinCelebration
        winner={gameState.winner}
        onPlayAgain={playAgain}
      />
    </div>
  );
}
