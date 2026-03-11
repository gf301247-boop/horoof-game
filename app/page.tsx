'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Monitor, Tv, Hexagon, Users } from 'lucide-react';

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: 'oklch(0.65 0.22 250 / 0.15)' }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: 'oklch(0.6 0.25 25 / 0.15)' }}
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

      <motion.div
        className="relative z-10 text-center max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo/Title */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Hexagon className="w-16 h-16" style={{ color: 'oklch(0.65 0.22 250)' }} />
            <h1 
              className="text-6xl font-bold"
              style={{ 
                background: 'linear-gradient(135deg, oklch(0.65 0.22 250), oklch(0.6 0.25 25))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
             حروف مع عماد
            </h1>
            <Hexagon className="w-16 h-16" style={{ color: 'oklch(0.6 0.25 25)' }} />
          </div>
          <p className="text-xl text-muted-foreground">لعبة الحروف </p>
        </motion.div>
        
        {/* Description */}
        <motion.p
          className="text-lg text-muted-foreground mb-12 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          اربط الحروف من الأعلى إلى الأسفل (الفريق الأزرق) أو من اليسار إلى اليمين (الفريق الأحمر) للفوز!
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {/* Host Dashboard */}
          <Link href="/host">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8 cursor-pointer transition-colors hover:border-primary/50"
              style={{
                boxShadow: '0 0 40px oklch(0.5 0.2 250 / 0.1)',
              }}
            >
              <Monitor className="w-12 h-12 mx-auto mb-4" style={{ color: 'oklch(0.65 0.22 250)' }} />
              <h2 className="text-2xl font-bold text-foreground mb-2">لوحة التحكم</h2>
              <p className="text-sm text-muted-foreground">للمقدم - تحكم كامل بالأسئلة والنتائج</p>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>Host Dashboard</span>
              </div>
            </motion.div>
          </Link>

          {/* Public View */}
          <Link href="/public">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8 cursor-pointer transition-colors hover:border-primary/50"
              style={{
                boxShadow: '0 0 40px oklch(0.45 0.25 25 / 0.1)',
              }}
            >
              <Tv className="w-12 h-12 mx-auto mb-4" style={{ color: 'oklch(0.6 0.25 25)' }} />
              <h2 className="text-2xl font-bold text-foreground mb-2">شاشة العرض</h2>
              <p className="text-sm text-muted-foreground">للجمهور - عرض اللوحة والأسئلة فقط</p>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Tv className="w-4 h-4" />
                <span>Public View</span>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Instructions */}
        <motion.div
          className="mt-12 bg-secondary/30 rounded-xl p-6 border border-border/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="font-bold text-foreground mb-3">كيفية الاستخدام:</h3>
          <ol className="text-sm text-muted-foreground space-y-2 text-right list-decimal list-inside">
            <li>افتح <strong>لوحة التحكم</strong> في نافذة على جهاز المقدم</li>
            <li>افتح <strong>شاشة العرض</strong> في نافذة منفصلة للجمهور</li>
            <li>اختر الخلايا وأجب على الأسئلة من لوحة التحكم</li>
            <li>ستتزامن شاشة العرض تلقائياً مع لوحة التحكم</li>
          </ol>
        </motion.div>
      </motion.div>
    </div>
  );
}
