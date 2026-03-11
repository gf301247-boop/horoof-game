'use client';

import { motion } from 'framer-motion';
import { HexCell as HexCellType } from '@/lib/game-types';

interface HexCellProps {
  hex: HexCellType;
  onClick: () => void;
  disabled: boolean;
  width?: number;
  height?: number;
}

export function HexCell({ hex, onClick, disabled, width = 90, height = 100 }: HexCellProps) {
  const getHexColor = () => {
    if (hex.isWinningPath) {
      return hex.owner === 'blue'
        ? 'fill-[oklch(0.7_0.25_250)]'
        : 'fill-[oklch(0.7_0.28_25)]';
    }
    if (hex.owner === 'blue') return 'fill-team-blue';
    if (hex.owner === 'red') return 'fill-team-red';
    return 'fill-hex-default';
  };

  const getGlowFilter = () => {
    if (hex.isWinningPath) {
      return hex.owner === 'blue'
        ? 'drop-shadow-[0_0_20px_oklch(0.6_0.25_250)] drop-shadow-[0_0_40px_oklch(0.5_0.2_250)]'
        : 'drop-shadow-[0_0_20px_oklch(0.55_0.28_25)] drop-shadow-[0_0_40px_oklch(0.45_0.25_25)]';
    }
    if (hex.owner === 'blue') {
      return 'drop-shadow-[0_0_12px_oklch(0.5_0.22_250)]';
    }
    if (hex.owner === 'red') {
      return 'drop-shadow-[0_0_12px_oklch(0.45_0.25_25)]';
    }
    return '';
  };

  const hexPoints = "50,0 100,25 100,75 50,100 0,75 0,25";

  return (
    <motion.div
      className="relative cursor-pointer"
      style={{ width, height }}
      whileHover={{ scale: disabled ? 1 : 1.08, zIndex: 10 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={() => !disabled && onClick()}
    >
      <motion.svg
        viewBox="0 0 100 100"
        className={`w-full h-full ${getGlowFilter()} transition-all duration-300`}
        initial={false}
        animate={hex.isWinningPath ? {
          scale: [1, 1.05, 1],
          transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" }
        } : {}}
      >
        {/* Main hexagon */}
        <motion.polygon
          points={hexPoints}
          className={`${getHexColor()} transition-colors duration-300`}
          stroke="url(#hexBorder)"
          strokeWidth="2"
          initial={false}
          animate={hex.owner ? { scale: [0.9, 1] } : {}}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />

        {/* Inner glow effect */}
        <polygon
          points={hexPoints}
          fill="none"
          stroke="url(#innerGlow)"
          strokeWidth="1"
          opacity="0.5"
          transform="scale(0.92) translate(4, 4)"
        />

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="hexBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.5 0.1 250)" />
            <stop offset="50%" stopColor="oklch(0.6 0.15 250)" />
            <stop offset="100%" stopColor="oklch(0.4 0.08 250)" />
          </linearGradient>
          <linearGradient id="innerGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.1 250)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="oklch(0.3 0.05 250)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Arabic Letter */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={false}
        animate={hex.owner ? {
          rotateY: [90, 0],
          opacity: [0, 1]
        } : {}}
        transition={{ duration: 0.4 }}
      >
        <span
          className={`font-bold select-none ${hex.owner
              ? 'text-foreground'
              : 'text-muted-foreground'
            }`}
          style={{
            fontSize: width > 90 ? '1.75rem' : '1.5rem',
            textShadow: hex.owner
              ? '0 0 10px currentColor, 0 2px 4px rgba(0,0,0,0.5)'
              : '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {hex.letter}
        </span>
      </motion.div>
    </motion.div>
  );
}
