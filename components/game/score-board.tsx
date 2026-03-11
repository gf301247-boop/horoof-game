'use client';

import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

interface ScoreBoardProps {
  blueScore: number;
  redScore: number;
}

export function ScoreBoard({ blueScore, redScore }: ScoreBoardProps) {
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Blue Team */}
          <motion.div 
            className="flex items-center gap-4 px-6 py-3 rounded-2xl transition-all duration-500 bg-secondary/50"
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-team-blue flex items-center justify-center">
                <Users className="w-5 h-5 text-foreground" />
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">الفريق</p>
                <p className="font-bold text-team-blue">الأزرق</p>
              </div>
            </div>
            <motion.div 
              className="text-4xl font-bold text-team-blue tabular-nums"
              key={blueScore}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {blueScore}
            </motion.div>
          </motion.div>

          {/* Logo / Title */}
          <div className="text-center">
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-team-blue via-foreground to-team-red bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ['0%', '100%', '0%'] 
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: '200%' }}
            >
              حروف مع عماد
            </motion.h1>
            <p className="text-xs text-muted-foreground mt-1">اربط الحروف للفوز</p>
          </div>

          {/* Red Team */}
          <motion.div 
            className="flex items-center gap-4 px-6 py-3 rounded-2xl transition-all duration-500 bg-secondary/50"
          >
            <motion.div 
              className="text-4xl font-bold text-team-red tabular-nums"
              key={redScore}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {redScore}
            </motion.div>
            <div className="flex items-center gap-2">
              <div className="text-left">
                <p className="text-xs text-muted-foreground">الفريق</p>
                <p className="font-bold text-team-red">الأحمر</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-team-red flex items-center justify-center">
                <Users className="w-5 h-5 text-foreground" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
