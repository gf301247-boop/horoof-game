'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WinCelebrationProps {
  winner: 'blue' | 'red' | null;
  onPlayAgain: () => void;
}

interface Confetti {
  id: number;
  x: number;
  delay: number;
  color: string;
  size: number;
  rotation: number;
}

export function WinCelebration({ winner, onPlayAgain }: WinCelebrationProps) {
  const [confetti, setConfetti] = useState<Confetti[]>([]);

  useEffect(() => {
    if (winner) {
      const colors = winner === 'blue' 
        ? ['#3b82f6', '#60a5fa', '#93c5fd', '#ffffff']
        : ['#ef4444', '#f87171', '#fca5a5', '#ffffff'];
      
      const newConfetti: Confetti[] = [];
      for (let i = 0; i < 100; i++) {
        newConfetti.push({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 5,
          rotation: Math.random() * 360,
        });
      }
      setConfetti(newConfetti);
    }
  }, [winner]);

  if (!winner) return null;

  const teamName = winner === 'blue' ? 'الأزرق' : 'الأحمر';
  
  const blueColor = 'oklch(0.65 0.22 250)';
  const redColor = 'oklch(0.6 0.25 25)';
  const teamColorValue = winner === 'blue' ? blueColor : redColor;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: winner === 'blue'
              ? 'linear-gradient(to bottom right, oklch(0.65 0.22 250 / 0.3), oklch(0.12 0.02 250), oklch(0.65 0.22 250 / 0.2))'
              : 'linear-gradient(to bottom right, oklch(0.6 0.25 25 / 0.3), oklch(0.12 0.02 250), oklch(0.6 0.25 25 / 0.2))',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        {/* Confetti */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {confetti.map((c) => (
            <motion.div
              key={c.id}
              className="absolute"
              style={{
                left: `${c.x}%`,
                width: c.size,
                height: c.size,
                backgroundColor: c.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '0%',
              }}
              initial={{ y: -50, rotate: 0, opacity: 1 }}
              animate={{
                y: '100vh',
                rotate: c.rotation + 720,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: c.delay,
                ease: 'linear',
                repeat: Infinity,
              }}
            />
          ))}
        </div>

        {/* Radial burst */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{ backgroundColor: teamColorValue }}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
        />

        {/* Winner card */}
        <motion.div
          className="relative z-10 text-center"
          initial={{ scale: 0, rotateY: -180 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.3 }}
        >
          <motion.div
            className="relative bg-card/90 backdrop-blur-2xl rounded-3xl p-12 border border-border/50"
            style={{
              boxShadow: `0 0 100px ${winner === 'blue' ? 'oklch(0.5 0.22 250 / 0.5)' : 'oklch(0.45 0.25 25 / 0.5)'}`,
            }}
          >
            {/* Trophy icon */}
            <motion.div
              className="mx-auto mb-6"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: `${teamColorValue}33` }}
              >
                <Trophy className="w-12 h-12" style={{ color: teamColorValue }} />
              </div>
            </motion.div>

            {/* Sparkles */}
            <motion.div
              className="absolute top-4 left-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8" style={{ color: teamColorValue }} />
            </motion.div>
            <motion.div
              className="absolute top-4 right-4"
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8" style={{ color: teamColorValue }} />
            </motion.div>

            {/* Winner text */}
            <motion.h2
              className="text-2xl font-bold text-muted-foreground mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              الفائز هو
            </motion.h2>
            <motion.h1
              className="text-6xl font-bold mb-4"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
              style={{
                color: teamColorValue,
                textShadow: `0 0 40px ${winner === 'blue' ? 'oklch(0.5 0.22 250 / 0.8)' : 'oklch(0.45 0.25 25 / 0.8)'}`,
              }}
            >
              الفريق {teamName}!
            </motion.h1>
            <motion.p
              className="text-lg text-muted-foreground mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              تهانينا! لقد ربط الفريق الحروف بنجاح
            </motion.p>

            {/* Play again button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Button
                onClick={onPlayAgain}
                size="lg"
                className="text-foreground font-bold text-lg px-8 py-6 rounded-xl"
                style={{
                  backgroundColor: teamColorValue,
                  boxShadow: `0 0 30px ${winner === 'blue' ? 'oklch(0.5 0.22 250 / 0.5)' : 'oklch(0.45 0.25 25 / 0.5)'}`,
                }}
              >
                <RotateCcw className="w-5 h-5 ml-2" />
                العب مرة أخرى
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
