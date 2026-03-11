'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { HexGrid } from './hex-grid';
import { ScoreBoard } from './score-board';
import { WinCelebration } from './win-celebration';
import { useGame } from '@/lib/game-context';

// Public Question Display - No answers, no controls
function PublicQuestionDisplay() {
  const { selectedHex, gameState } = useGame();
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const resetTimer = useCallback(() => {
    setTimeLeft(30);
    setIsTimerRunning(true);
  }, []);

  useEffect(() => {
    if (selectedHex.isOpen) {
      resetTimer();
    } else {
      setIsTimerRunning(false);
    }
  }, [selectedHex.isOpen, resetTimer]);

  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const getTimerColor = () => {
    if (timeLeft > 20) return 'text-green-400';
    if (timeLeft > 10) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTimerRingColor = () => {
    if (timeLeft > 20) return 'stroke-green-400';
    if (timeLeft > 10) return 'stroke-yellow-400';
    return 'stroke-red-400';
  };

  if (!selectedHex.hex || !selectedHex.isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-3xl bg-card/90 backdrop-blur-2xl rounded-3xl border border-border/50 overflow-hidden"
          style={{
            boxShadow: `
              0 0 100px oklch(0.5 0.2 250 / 0.2),
              0 0 50px oklch(0.45 0.25 25 / 0.15),
              inset 0 1px 0 oklch(1 0 0 / 0.1)
            `,
          }}
          initial={{ scale: 0.8, y: 50, rotateX: -15 }}
          animate={{ scale: 1, y: 0, rotateX: 0 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          {/* Header with Letter - Large Display */}
          <div className="relative px-12 pt-12 pb-8">
            <div className="flex items-center justify-center gap-12">
              {/* Timer - Large */}
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-secondary"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className={getTimerRingColor()}
                    strokeDasharray={283}
                    animate={{ strokeDashoffset: 283 - (283 * timeLeft) / 30 }}
                    transition={{ duration: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span 
                    className={`text-4xl font-bold ${getTimerColor()}`}
                    key={timeLeft}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                  >
                    {timeLeft}
                  </motion.span>
                </div>
              </div>

              {/* Letter Display - Extra Large */}
              <motion.div
                className="relative"
                initial={{ rotateY: 180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              >
                <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-border/50">
                  <span 
                    className="text-8xl font-bold text-foreground"
                    style={{ textShadow: '0 0 40px oklch(0.6 0.2 250 / 0.6)' }}
                  >
                    {selectedHex.hex.letter}
                  </span>
                </div>
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  animate={{
                    boxShadow: [
                      '0 0 30px oklch(0.5 0.2 250 / 0.4)',
                      '0 0 60px oklch(0.45 0.25 25 / 0.4)',
                      '0 0 30px oklch(0.5 0.2 250 / 0.4)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              {/* (Turn indicator removed) */}
            </div>
          </div>

          {/* Question Area - Clean Display (No Answer Shown) */}
          <div className="px-12 pb-12">
            {(() => {
              const questionData = selectedHex.question;
              return (
                <div className="bg-secondary/30 rounded-2xl p-8 border border-border/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span className="text-lg text-muted-foreground">السؤال</span>
                  </div>
                  <p className="text-2xl text-foreground leading-relaxed text-center">
                    {questionData?.question || (
                      <>
                        أذكر كلمة تبدأ بحرف{' '}
                        <span 
                          className="font-bold text-3xl"
                          style={{ color: 'oklch(0.65 0.22 250)' }}
                        >
                          {selectedHex.hex.letter}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              );
            })()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function PublicView() {
  const { gameState, gridSize, selectHex, playAgain } = useGame();

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: 'oklch(0.65 0.22 250 / 0.1)' }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: 'oklch(0.6 0.25 25 / 0.1)' }}
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(oklch(0.5 0.1 250 / 0.3) 1px, transparent 1px),
              linear-gradient(90deg, oklch(0.5 0.1 250 / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Public View Badge */}
      <div className="fixed top-4 left-4 z-50">
        <div className="bg-secondary/80 backdrop-blur-sm border border-border/50 px-4 py-2 rounded-full">
          <span className="text-sm font-bold text-muted-foreground">شاشة العرض</span>
        </div>
      </div>

      {/* Score Board */}
      <ScoreBoard
        blueScore={gameState.blueScore}
        redScore={gameState.redScore}
      />

      {/* Main Game Area */}
      <main className="relative pt-28 pb-12 px-4 min-h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={gridSize}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <HexGrid
              hexagons={gameState.hexagons}
              gridSize={gridSize}
              onHexClick={selectHex}
              disabled={true}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Public Question Display */}
      <PublicQuestionDisplay />

      {/* Win Celebration */}
      <WinCelebration
        winner={gameState.winner}
        onPlayAgain={playAgain}
      />
    </div>
  );
}
