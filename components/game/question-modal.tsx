'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react';
import { HexCell } from '@/lib/game-types';
import { Button } from '@/components/ui/button';

interface QuestionModalProps {
  hex: HexCell | null;
  isOpen: boolean;
  onClose: () => void;
  onBlueAnswer: () => void;
  onRedAnswer: () => void;
  onWrongAnswer: () => void;
  timerDuration: number;
}

export function QuestionModal({
  hex,
  isOpen,
  onClose,
  onBlueAnswer,
  onRedAnswer,
  onWrongAnswer,
  timerDuration,
}: QuestionModalProps) {
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const resetTimer = useCallback(() => {
    setTimeLeft(timerDuration);
    setIsTimerRunning(true);
  }, [timerDuration]);

  useEffect(() => {
    if (isOpen) {
      resetTimer();
    } else {
      setIsTimerRunning(false);
    }
  }, [isOpen, resetTimer]);

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

  if (!hex) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-2xl bg-card/90 backdrop-blur-2xl rounded-3xl border border-border/50 overflow-hidden"
              style={{
                boxShadow: `
                  0 0 80px oklch(0.5 0.2 250 / 0.15),
                  0 0 40px oklch(0.45 0.25 25 / 0.1),
                  inset 0 1px 0 oklch(1 0 0 / 0.1)
                `,
              }}
              initial={{ scale: 0.8, y: 50, rotateX: -15 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 left-4 p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header with Letter */}
              <div className="relative px-8 pt-8 pb-4">
                <div className="flex items-center justify-center gap-6">
                  {/* Timer */}
                  <div className="relative w-20 h-20">
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
                        animate={{ strokeDashoffset: 283 - (283 * timeLeft) / timerDuration }}
                        transition={{ duration: 0.5 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span
                        className={`text-2xl font-bold ${getTimerColor()}`}
                        key={timeLeft}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                      >
                        {timeLeft}
                      </motion.span>
                    </div>
                  </div>

                  {/* Letter Display */}
                  <motion.div
                    className="relative"
                    initial={{ rotateY: 180, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                  >
                    <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-team-blue/30 to-team-red/30 flex items-center justify-center border border-border/50">
                      <span
                        className="text-6xl font-bold text-foreground"
                        style={{ textShadow: '0 0 30px oklch(0.6 0.2 250 / 0.5)' }}
                      >
                        {hex.letter}
                      </span>
                    </div>
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      animate={{
                        boxShadow: [
                          '0 0 20px oklch(0.5 0.2 250 / 0.3)',
                          '0 0 40px oklch(0.45 0.25 25 / 0.3)',
                          '0 0 20px oklch(0.5 0.2 250 / 0.3)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>

                  {/* Reset Timer Button */}
                  <button
                    onClick={resetTimer}
                    className="w-20 h-20 rounded-full bg-secondary/50 hover:bg-secondary transition-colors flex items-center justify-center group"
                  >
                    <RotateCcw className="w-8 h-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                </div>
              </div>

              {/* Question Area */}
              <div className="px-8 py-6">
                <div className="bg-secondary/30 rounded-2xl p-6 border border-border/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">السؤال</span>
                  </div>
                  <p className="text-lg text-foreground leading-relaxed">
                    أذكر كلمة تبدأ بحرف <span className="font-bold text-team-blue">{hex.letter}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    (يمكن للمقدم طرح أي سؤال يبدأ جوابه بهذا الحرف)
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-8 pb-8">
                <div className="grid grid-cols-3 gap-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={onBlueAnswer}
                      className="w-full h-14 bg-team-blue hover:bg-team-blue/80 text-foreground font-bold text-base rounded-xl"
                      style={{
                        boxShadow: '0 0 20px oklch(0.5 0.22 250 / 0.4)',
                      }}
                    >
                      <CheckCircle className="w-5 h-5 ml-2" />
                      فوز الأزرق
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={onWrongAnswer}
                      variant="outline"
                      className="w-full h-14 bg-secondary/50 hover:bg-secondary border-border font-bold text-base rounded-xl"
                    >
                      <XCircle className="w-5 h-5 ml-2" />
                      خطأ / تخطي
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={onRedAnswer}
                      className="w-full h-14 bg-team-red hover:bg-team-red/80 text-foreground font-bold text-base rounded-xl"
                      style={{
                        boxShadow: '0 0 20px oklch(0.45 0.25 25 / 0.4)',
                      }}
                    >
                      <CheckCircle className="w-5 h-5 ml-2" />
                      فوز الأحمر
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
