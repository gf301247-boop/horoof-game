'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { HexCell } from './hex-cell';
import { HexCell as HexCellType, GridSize } from '@/lib/game-types';

interface HexGridProps {
  hexagons: HexCellType[];
  gridSize: GridSize;
  onHexClick: (hex: HexCellType) => void;
  disabled: boolean;
}

export function HexGrid({ hexagons, gridSize, onHexClick, disabled }: HexGridProps) {
  // Scale hex size based on grid size for optimal display
  const { hexWidth, hexHeight, horizontalSpacing, verticalSpacing, rowOffset, gridWidth, gridHeight } = useMemo(() => {
    // Larger hexes for smaller grids, smaller hexes for larger grids
    const baseHexWidth = gridSize === 5 ? 100 : 90;
    const baseHexHeight = gridSize === 5 ? 110 : 100;
    const hSpacing = baseHexWidth * 0.78;
    const vSpacing = baseHexHeight * 0.75;
    const rOffset = baseHexWidth * 0.39;
    
    return {
      hexWidth: baseHexWidth,
      hexHeight: baseHexHeight,
      horizontalSpacing: hSpacing,
      verticalSpacing: vSpacing,
      rowOffset: rOffset,
      gridWidth: (gridSize - 1) * hSpacing + baseHexWidth + rOffset,
      gridHeight: (gridSize - 1) * vSpacing + baseHexHeight,
    };
  }, [gridSize]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-gradient-radial from-team-blue/5 via-transparent to-team-red/5 blur-3xl" />
      
      {/* Edge indicators */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2">
        <motion.div 
          className="px-4 py-1 bg-team-blue/20 border border-team-blue/50 rounded-full text-team-blue text-sm font-bold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          أزرق يبدأ
        </motion.div>
      </div>
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
        <motion.div 
          className="px-4 py-1 bg-team-blue/20 border border-team-blue/50 rounded-full text-team-blue text-sm font-bold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          أزرق ينتهي
        </motion.div>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 -left-20">
        <motion.div 
          className="px-3 py-2 bg-team-red/20 border border-team-red/50 rounded-full text-team-red text-sm font-bold writing-mode-vertical"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        >
          أحمر يبدأ
        </motion.div>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 -right-20">
        <motion.div 
          className="px-3 py-2 bg-team-red/20 border border-team-red/50 rounded-full text-team-red text-sm font-bold"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        >
          أحمر ينتهي
        </motion.div>
      </div>

      {/* Hex Grid */}
      <motion.div
        className="relative"
        style={{ width: gridWidth, height: gridHeight }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {hexagons.map((hex, index) => {
          const x = hex.col * horizontalSpacing + (hex.row % 2 === 1 ? rowOffset : 0);
          const y = hex.row * verticalSpacing;

          return (
            <motion.div
              key={hex.id}
              className="absolute"
              style={{ left: x, top: y }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02, duration: 0.4 }}
            >
              <HexCell
                hex={hex}
                onClick={() => onHexClick(hex)}
                disabled={disabled || hex.owner !== null}
                width={hexWidth}
                height={hexHeight}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
