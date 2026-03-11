export type Team = 'blue' | 'red' | null;

export type GridSize = 5 | 6;

export interface HexCell {
  id: string;
  row: number;
  col: number;
  letter: string;
  owner: Team;
  isWinningPath: boolean;
}

export interface GameState {
  hexagons: HexCell[];
  blueScore: number;
  redScore: number;
  winner: Team;
  winningPath: string[];
  gridSize: GridSize;
}

export const ARABIC_LETTERS = [
  'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر',
  'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف',
  'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
];

export const GRID_SIZES: GridSize[] = [5, 6];
export const DEFAULT_GRID_SIZE: GridSize = 5;

// Question data type
export interface QuestionData {
  id: number;
  letter: string;
  question: string;
  correctAnswer: string;
}
