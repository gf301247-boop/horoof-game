import { HexCell, Team, ARABIC_LETTERS, GridSize, DEFAULT_GRID_SIZE } from './game-types';

// Generate initial hexagon grid with dynamic size
export function generateHexGrid(gridSize: GridSize = DEFAULT_GRID_SIZE): HexCell[] {
  const hexagons: HexCell[] = [];
  const shuffledLetters = [...ARABIC_LETTERS].sort(() => Math.random() - 0.5);
  let letterIndex = 0;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      hexagons.push({
        id: `${row}-${col}`,
        row,
        col,
        letter: shuffledLetters[letterIndex % shuffledLetters.length],
        owner: null,
        isWinningPath: false,
      });
      letterIndex++;
    }
  }
  return hexagons;
}

// Get hex neighbors (for hexagonal grid with offset coordinates)
function getNeighbors(row: number, col: number): [number, number][] {
  // For a hex grid with offset coordinates (odd-r offset)
  const isOddRow = row % 2 === 1;
  
  if (isOddRow) {
    return [
      [row - 1, col],     // top-left
      [row - 1, col + 1], // top-right
      [row, col - 1],     // left
      [row, col + 1],     // right
      [row + 1, col],     // bottom-left
      [row + 1, col + 1], // bottom-right
    ];
  } else {
    return [
      [row - 1, col - 1], // top-left
      [row - 1, col],     // top-right
      [row, col - 1],     // left
      [row, col + 1],     // right
      [row + 1, col - 1], // bottom-left
      [row + 1, col],     // bottom-right
    ];
  }
}

// BFS to check if a team has won (dynamically adapts to grid size)
export function checkWin(hexagons: HexCell[], team: Team, gridSize: GridSize): string[] | null {
  if (!team) return null;

  const hexMap = new Map<string, HexCell>();
  hexagons.forEach(hex => hexMap.set(hex.id, hex));

  // Blue wins: connect TOP to BOTTOM (row 0 to row gridSize-1)
  // Red wins: connect LEFT to RIGHT (col 0 to col gridSize-1)
  
  const startingHexes: HexCell[] = [];
  const targetCheck = (hex: HexCell): boolean => {
    if (team === 'blue') {
      return hex.row === gridSize - 1; // Bottom row
    } else {
      return hex.col === gridSize - 1; // Right column
    }
  };

  // Find starting hexes based on team's starting edge
  hexagons.forEach(hex => {
    if (hex.owner === team) {
      if (team === 'blue' && hex.row === 0) {
        startingHexes.push(hex); // Top row for blue
      } else if (team === 'red' && hex.col === 0) {
        startingHexes.push(hex); // Left column for red
      }
    }
  });

  // BFS from each starting hex to find path to opposite edge
  for (const startHex of startingHexes) {
    const visited = new Set<string>();
    const queue: { hex: HexCell; path: string[] }[] = [{ hex: startHex, path: [startHex.id] }];
    visited.add(startHex.id);

    while (queue.length > 0) {
      const { hex: current, path } = queue.shift()!;

      if (targetCheck(current)) {
        return path; // Found winning path
      }

      const neighbors = getNeighbors(current.row, current.col);
      for (const [nRow, nCol] of neighbors) {
        // Validate neighbors against dynamic grid size
        if (nRow < 0 || nRow >= gridSize || nCol < 0 || nCol >= gridSize) continue;
        
        const neighborId = `${nRow}-${nCol}`;
        const neighbor = hexMap.get(neighborId);
        
        if (neighbor && neighbor.owner === team && !visited.has(neighborId)) {
          visited.add(neighborId);
          queue.push({ hex: neighbor, path: [...path, neighborId] });
        }
      }
    }
  }

  return null;
}

// Calculate score (number of owned hexes)
export function calculateScore(hexagons: HexCell[], team: Team): number {
  return hexagons.filter(hex => hex.owner === team).length;
}
