'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { GameState, HexCell, GridSize, DEFAULT_GRID_SIZE, Team, QuestionData } from './game-types';
import { generateHexGrid, checkWin, calculateScore } from './game-logic';
import { QUESTIONS_DATA } from './questionsData';
import { useBroadcastChannel, BroadcastAction } from '@/hooks/use-broadcast-channel';

interface SelectedHexState {
  hex: HexCell | null;
  isOpen: boolean;
  question: QuestionData | null;
}

interface GameContextType {
  gameState: GameState;
  selectedHex: SelectedHexState;
  gridSize: GridSize;
  isHost: boolean;
  usedQuestionIds: number[];
  // Host actions
  selectHex: (hex: HexCell) => void;
  deselectHex: () => void;
  awardBlue: () => void;
  awardRed: () => void;
  passWrong: () => void;
  changeGridSize: (size: GridSize) => void;
  playAgain: () => void;
  shuffleQuestions: () => void;
  resetSessionMemory: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

interface GameProviderProps {
  children: ReactNode;
  isHost: boolean;
}

export function GameProvider({ children, isHost }: GameProviderProps) {
  const [gridSize, setGridSize] = useState<GridSize>(DEFAULT_GRID_SIZE);
  const [gameState, setGameState] = useState<GameState>(() => ({
    hexagons: generateHexGrid(DEFAULT_GRID_SIZE),
    blueScore: 0,
    redScore: 0,
    winner: null,
    winningPath: [],
    gridSize: DEFAULT_GRID_SIZE,
  }));
  const [selectedHex, setSelectedHex] = useState<SelectedHexState>({
    hex: null,
    isOpen: false,
    question: null,
  });
  const [usedQuestionIds, setUsedQuestionIds] = useState<number[]>([]);

  const normalizeLetter = useCallback((letter: string) => {
    // Handle "ه" vs "هـ" normalization across data sets / board letters
    return letter === 'ه' ? 'هـ' : letter;
  }, []);

  const handleMessage = useCallback((action: BroadcastAction) => {
    switch (action.type) {
      case 'SYNC_STATE':
        setGameState(action.payload);
        setGridSize(action.payload.gridSize);
        break;
      case 'HEX_SELECTED':
        setSelectedHex({ hex: action.payload.hex, isOpen: action.payload.isOpen, question: action.payload.question });
        break;
      case 'HEX_DESELECTED':
        setSelectedHex({ hex: null, isOpen: false, question: null });
        break;
      case 'REQUEST_SYNC':
        if (isHost) {
          broadcast({ type: 'SYNC_STATE', payload: gameState });
          if (selectedHex.hex) {
            broadcast({
              type: 'HEX_SELECTED',
              payload: { hex: selectedHex.hex, isOpen: selectedHex.isOpen, question: selectedHex.question },
            });
          }
        }
        break;
    }
  }, [isHost, gameState, selectedHex]);

  const { broadcast } = useBroadcastChannel(handleMessage);

  // Request sync on mount for public view
  useEffect(() => {
    if (!isHost) {
      broadcast({ type: 'REQUEST_SYNC' });
    }
  }, [isHost, broadcast]);

  const updateHexOwner = useCallback((team: Team) => {
    if (!selectedHex.hex) return;

    setGameState((prev) => {
      const newHexagons = prev.hexagons.map((hex) =>
        hex.id === selectedHex.hex!.id ? { ...hex, owner: team } : hex
      );

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

      const finalHexagons = newHexagons.map((hex) => ({
        ...hex,
        isWinningPath: winningPath.includes(hex.id),
      }));

      const newState: GameState = {
        ...prev,
        hexagons: finalHexagons,
        blueScore: calculateScore(finalHexagons, 'blue'),
        redScore: calculateScore(finalHexagons, 'red'),
        winner,
        winningPath,
      };

      broadcast({ type: 'SYNC_STATE', payload: newState });
      return newState;
    });

    setSelectedHex({ hex: null, isOpen: false, question: null });
    broadcast({ type: 'HEX_DESELECTED' });
  }, [selectedHex.hex, broadcast]);

  const selectHex = useCallback((hex: HexCell) => {
    if (hex.owner !== null || gameState.winner) return;

    const normalized = normalizeLetter(hex.letter);
    const allForLetter = QUESTIONS_DATA.filter((q) => normalizeLetter(q.letter) === normalized);

    let available = allForLetter.filter((q) => !usedQuestionIds.includes(q.id));
    let nextUsedIds = usedQuestionIds;

    // If exhausted for this letter, reset memory for ONLY this letter
    if (allForLetter.length > 0 && available.length === 0) {
      const letterIds = new Set(allForLetter.map((q) => q.id));
      nextUsedIds = usedQuestionIds.filter((id) => !letterIds.has(id));
      available = allForLetter;
    }

    const selectedQuestion =
      available.length > 0
        ? available[Math.floor(Math.random() * available.length)]
        : null;

    if (selectedQuestion) {
      const newUsedIds = nextUsedIds.includes(selectedQuestion.id)
        ? nextUsedIds
        : [...nextUsedIds, selectedQuestion.id];
      setUsedQuestionIds(newUsedIds);
    }

    setSelectedHex({ hex, isOpen: true, question: selectedQuestion });
    broadcast({ type: 'HEX_SELECTED', payload: { hex, isOpen: true, question: selectedQuestion } });
  }, [gameState.winner, broadcast, usedQuestionIds, normalizeLetter]);

  const deselectHex = useCallback(() => {
    setSelectedHex({ hex: null, isOpen: false, question: null });
    broadcast({ type: 'HEX_DESELECTED' });
  }, [broadcast]);

  const awardBlue = useCallback(() => {
    updateHexOwner('blue');
  }, [updateHexOwner]);

  const awardRed = useCallback(() => {
    updateHexOwner('red');
  }, [updateHexOwner]);

  const passWrong = useCallback(() => {
    setSelectedHex({ hex: null, isOpen: false, question: null });
    broadcast({ type: 'HEX_DESELECTED' });
    
    setGameState((prev) => {
      broadcast({ type: 'SYNC_STATE', payload: prev });
      return prev;
    });
  }, [broadcast]);

  const shuffleQuestions = useCallback(() => {
    const totalCells = gridSize * gridSize;

    const shuffleArray = <T,>(array: T[]): T[] => {
      const result = [...array];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    };

    // For 5x5 ensure no duplicate letters by picking a subset of unique letters
    let lettersPool: string[] = [];
    if (gridSize === 5) {
      const uniqueLetters = Array.from(
        new Set(QUESTIONS_DATA.map((q) => q.letter))
      );
      const shuffledLetters = shuffleArray(uniqueLetters);
      lettersPool = shuffledLetters.slice(0, totalCells);
    } else {
      const allLetters = QUESTIONS_DATA.map((q) => q.letter);
      const repeated = Array(Math.ceil(totalCells / allLetters.length))
        .fill(allLetters)
        .flat();
      lettersPool = shuffleArray(repeated).slice(0, totalCells);
    }

    const newHexagons: HexCell[] = [];
    let index = 0;
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        newHexagons.push({
          id: `${row}-${col}`,
          row,
          col,
          letter: lettersPool[index],
          owner: null,
          isWinningPath: false,
        });
        index++;
      }
    }

    const newState: GameState = {
      hexagons: newHexagons,
      blueScore: 0,
      redScore: 0,
      winner: null,
      winningPath: [],
      gridSize,
    };

    setGameState(newState);
    setSelectedHex({ hex: null, isOpen: false, question: null });
    broadcast({ type: 'SYNC_STATE', payload: newState });
    broadcast({ type: 'HEX_DESELECTED' });
  }, [gridSize, broadcast]);

  const changeGridSize = useCallback((newSize: GridSize) => {
    setGridSize(newSize);
    const newState: GameState = {
      hexagons: generateHexGrid(newSize),
      blueScore: 0,
      redScore: 0,
      winner: null,
      winningPath: [],
      gridSize: newSize,
    };
    setGameState(newState);
    setSelectedHex({ hex: null, isOpen: false, question: null });
    broadcast({ type: 'SYNC_STATE', payload: newState });
    broadcast({ type: 'HEX_DESELECTED' });
  }, [broadcast]);

  const playAgain = useCallback(() => {
    const newState: GameState = {
      hexagons: generateHexGrid(gridSize),
      blueScore: 0,
      redScore: 0,
      winner: null,
      winningPath: [],
      gridSize,
    };
    setGameState(newState);
    setSelectedHex({ hex: null, isOpen: false, question: null });
    broadcast({ type: 'SYNC_STATE', payload: newState });
    broadcast({ type: 'HEX_DESELECTED' });
  }, [gridSize, broadcast]);

  const resetSessionMemory = useCallback(() => {
    setUsedQuestionIds([]);
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameState,
        selectedHex,
        gridSize,
        isHost,
        usedQuestionIds,
        selectHex,
        deselectHex,
        awardBlue,
        awardRed,
        passWrong,
        changeGridSize,
        playAgain,
        shuffleQuestions,
        resetSessionMemory,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
