'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3X3 } from 'lucide-react';
import { HexGrid } from './hex-grid';
import { ScoreBoard } from './score-board';
import { QuestionModal } from './question-modal';
import { WinCelebration } from './win-celebration';
import { HexCell, Team, GameState, GridSize, GRID_SIZES, DEFAULT_GRID_SIZE, DEFAULT_TIMER_DURATION } from '@/lib/game-types';
import { generateHexGrid, checkWin, calculateScore } from '@/lib/game-logic';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function GameBoard() {
  const [gridSize, setGridSize] = useState<GridSize>(DEFAULT_GRID_SIZE);
  const [gameState, setGameState] = useState<GameState>(() => ({
    hexagons: generateHexGrid(DEFAULT_GRID_SIZE),
    blueScore: 0,
    redScore: 0,
    winner: null,
    winningPath: [],
    gridSize: DEFAULT_GRID_SIZE,
    timerDuration: DEFAULT_TIMER_DURATION,
  }));

  const [selectedHex, setSelectedHex] = useState<HexCell | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleHexClick = useCallback((hex: HexCell) => {
    if (hex.owner !== null || gameState.winner) return;
    setSelectedHex(hex);
    setIsModalOpen(true);
  }, [gameState.winner]);

  const updateHexOwner = useCallback((team: Team) => {
    if (!selectedHex) return;

    setGameState((prev) => {
      const newHexagons = prev.hexagons.map((hex) =>
        hex.id === selectedHex.id ? { ...hex, owner: team } : hex
      );

      // Check for win using current grid size
      const blueWinPath = checkWin(newHexagons, 'blue', prev.gridSize);
      const redWinPath = checkWin(newHexagons, 'red', prev.gridSize);

      let winner: Team = null;
      let winningPath: string[] = [];

      if (blueWinPath) {
        winner = 'blue';
        winningPath = blueWinPath;
      } else if (redWinPath) {
        winner = 'red';
        winningPath = redWinPath;
      }

      // Mark winning path hexagons
      const finalHexagons = newHexagons.map((hex) => ({
        ...hex,
        isWinningPath: winningPath.includes(hex.id),
      }));

      return {
        ...prev,
        hexagons: finalHexagons,
        blueScore: calculateScore(finalHexagons, 'blue'),
        redScore: calculateScore(finalHexagons, 'red'),
        winner,
        winningPath,
        timerDuration: prev.timerDuration,
      };
    });

    setIsModalOpen(false);
    setSelectedHex(null);
  }, [selectedHex]);

  const handleBlueAnswer = useCallback(() => {
    updateHexOwner('blue');
  }, [updateHexOwner]);

  const handleRedAnswer = useCallback(() => {
    updateHexOwner('red');
  }, [updateHexOwner]);

  const handleWrongAnswer = useCallback(() => {
    setIsModalOpen(false);
    setSelectedHex(null);
  }, []);

  const handlePlayAgain = useCallback(() => {
    setGameState({
      hexagons: generateHexGrid(gridSize),
      blueScore: 0,
      redScore: 0,
      winner: null,
      winningPath: [],
      gridSize,
      timerDuration: gameState.timerDuration,
    });
  }, [gridSize, gameState.timerDuration]);

  // Handle grid size change
  const handleGridSizeChange = useCallback((newSize: GridSize) => {
    setGridSize(newSize);
    setGameState({
      hexagons: generateHexGrid(newSize),
      blueScore: 0,
      redScore: 0,
      winner: null,
      winningPath: [],
      gridSize: newSize,
      timerDuration: gameState.timerDuration,
    });
  }, [gameState.timerDuration]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedHex(null);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;

      if (e.key === 'b' || e.key === 'B' || e.key === '1') {
        handleBlueAnswer();
      } else if (e.key === 'r' || e.key === 'R' || e.key === '3') {
        handleRedAnswer();
      } else if (e.key === 'x' || e.key === 'X' || e.key === '2' || e.key === 'Escape') {
        handleWrongAnswer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, handleBlueAnswer, handleRedAnswer, handleWrongAnswer]);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Ambient glow orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-team-blue/10 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-team-red/10 blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Grid pattern overlay */}
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

      {/* Grid Size Selector in Header */}
      <div className="fixed top-4 left-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-secondary/80 backdrop-blur-sm border-border/50 text-foreground hover:bg-secondary gap-2"
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="font-bold">{gridSize}x{gridSize}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-card/95 backdrop-blur-xl border-border/50"
          >
            {GRID_SIZES.map((size) => (
              <DropdownMenuItem
                key={size}
                onClick={() => handleGridSizeChange(size)}
                className={`cursor-pointer ${size === gridSize ? 'bg-primary/20 text-primary' : ''
                  }`}
              >
                <span className="font-bold">{size}x{size}</span>
                <span className="mr-2 text-muted-foreground text-xs">
                  ({size * size} خلية)
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
              onHexClick={handleHexClick}
              disabled={!!gameState.winner}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Question Modal */}
      <QuestionModal
        hex={selectedHex}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onBlueAnswer={handleBlueAnswer}
        onRedAnswer={handleRedAnswer}
        onWrongAnswer={handleWrongAnswer}
        timerDuration={gameState.timerDuration}
      />

      {/* Win Celebration */}
      <WinCelebration
        winner={gameState.winner}
        onPlayAgain={handlePlayAgain}
      />

      {/* Keyboard shortcuts hint */}
      <motion.div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-secondary/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        اختصارات: [B/1] أزرق صحيح • [X/2] خطأ • [R/3] أحمر صحيح
      </motion.div>
    </div>
  );
}
