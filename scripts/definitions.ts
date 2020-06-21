// Pieces
const PIECES = {
  EMPTY: 0,
  wP: 1,
  wN: 2,
  wB: 3,
  wR: 4,
  wQ: 5,
  wK: 6,
  bP: 7,
  bN: 8,
  bB: 9,
  bR: 10,
  bQ: 11,
  bK: 12,
};

// Files and Ranks
const FILES = {
  FILE_A: 0,
  FILE_B: 1,
  FILE_C: 2,
  FILE_D: 3,
  FILE_E: 4,
  FILE_F: 5,
  FILE_G: 6,
  FILE_H: 7,
  FILE_NONE: 8,
};
const RANKS = {
  RANK_1: 0,
  RANK_2: 1,
  RANK_3: 2,
  RANK_4: 3,
  RANK_5: 4,
  RANK_6: 5,
  RANK_7: 6,
  RANK_8: 7,
  RANK_NONE: 8,
};

// Key squares
const SQUARES = {
  A1: 21,
  B1: 22,
  C1: 23,
  D1: 24,
  E1: 25,
  F1: 26,
  G1: 27,
  H1: 28,
  A8: 91,
  B8: 92,
  C8: 93,
  D8: 94,
  E8: 95,
  F8: 96,
  G8: 97,
  H8: 98,
  NO_SQUARE: 99,
  OFFBOARD: 100,
};

// Number of squares in the virtual board.
const NUM_OF_SQUARES: number = 120;

// Colours
const COLOURS = { WHITE: 0, BLACK: 1, BOTH: 2 };

// Castling permissions
const CASTLE_BIT = { WKCA: 1, WQCA: 2, BKCA: 4, BQCA: 8 };

// Arrays for files and ranks of board.
const files: number[] = [];
const ranks: number[] = [];

// Not a piece, Pawn, Knight, Bishop, Rook, Queen, King, Pawn, Knight, Bishop, Rook, Queen, King
const notPawn = [
  false,
  false,
  true,
  true,
  true,
  true,
  true,
  false,
  true,
  true,
  true,
  true,
  true,
];
const isMajor = [
  false,
  false,
  false,
  false,
  true,
  true,
  true,
  false,
  false,
  false,
  true,
  true,
  true,
];
const isMinor = [
  false,
  false,
  true,
  true,
  false,
  false,
  false,
  false,
  true,
  true,
  false,
  false,
  false,
];
const pieceValue = [
  0,
  100,
  325,
  325,
  550,
  1000,
  50000,
  100,
  325,
  325,
  550,
  1000,
  50000,
];
const pieceColour = [
  COLOURS.BOTH,
  COLOURS.WHITE,
  COLOURS.WHITE,
  COLOURS.WHITE,
  COLOURS.WHITE,
  COLOURS.WHITE,
  COLOURS.WHITE,
  COLOURS.BLACK,
  COLOURS.BLACK,
  COLOURS.BLACK,
  COLOURS.BLACK,
  COLOURS.BLACK,
  COLOURS.BLACK,
];
const isPawn = [
  false,
  true,
  false,
  false,
  false,
  false,
  false,
  true,
  false,
  false,
  false,
  false,
  false,
];
const isKnight = [
  false,
  false,
  true,
  false,
  false,
  false,
  false,
  false,
  true,
  false,
  false,
  false,
  false,
];
const isKing = [
  false,
  false,
  false,
  false,
  false,
  false,
  true,
  false,
  false,
  false,
  false,
  false,
  true,
];
const isRookOrQueen = [
  false,
  false,
  false,
  false,
  true,
  true,
  false,
  false,
  false,
  false,
  true,
  true,
  false,
];
const isBishopOrQueen = [
  false,
  false,
  false,
  true,
  false,
  true,
  false,
  false,
  false,
  true,
  false,
  true,
  false,
];
const doesSlide = [
  false,
  false,
  false,
  true,
  true,
  true,
  false,
  false,
  false,
  true,
  true,
  true,
  false,
];

// Parts of boardState uid
const pieceKeys: number[] = [];
const sideKey: number = generateRandomNumber();
const castlingKeys: number[] = [];

// Arrays for conversions between 120 and 64 square grids
const _120To64: number[] = [];
const _64To120: number[] = [];

// Get specific square.
function getSquare(f: number, r: number): number {
  return 21 + f + r * 10;
}

// Generate a random number
function generateRandomNumber(): number {
  // Generate random number, then left shift it and inclusive OR it with the next.
  return (
    ((Math.floor(Math.random() * 255) + 1) << 24) |
    ((Math.floor(Math.random() * 255) + 1) << 16) |
    ((Math.floor(Math.random() * 255) + 1) << 8) |
    (Math.floor(Math.random() * 255) + 1)
  );
}

// Return equivalent square from 64 square grid.
function to64(index: number): number {
  return _120To64[index];
}

// Return equivalent square from 120 square grid.
function to120(index: number): number {
  return _64To120[index];
}
