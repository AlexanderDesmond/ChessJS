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

/*
const MAX_GAME_MOVES: number = 2048;
const MAX_POSITION_MOVES: number = 256;
const MAX_DEPTH: number = 64;
*/

// Arrays for files and ranks of board.
const files: number[] = [];
const ranks: number[] = [];

// Starting position FEN
const START_FEN: string =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const pieceChar = ".PNBRQKpnbrqk";
const sideChar = "wb-";
const rankChar = "12345678";
const fileChar = "abcdefgh";

// Not a piece, Pawn, Knight, Bishop, Rook, Queen, King, Pawn, Knight, Bishop, Rook, Queen, King
const notPawn: boolean[] = [
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
const isMajor: boolean[] = [
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
const isMinor: boolean[] = [
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
const pieceValue: number[] = [
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
const pieceColour: number[] = [
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
const isPawn: boolean[] = [
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
const isKnight: boolean[] = [
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
const isKing: boolean[] = [
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
const isRookOrQueen: boolean[] = [
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
const isBishopOrQueen: boolean[] = [
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
const doesSlide: boolean[] = [
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

// Piece directions
const knightDirections = [-8, -19, -21, -12, 8, 19, 21, 12];
const rookAndQueenDirections = [-1, -10, 1, 10];
const bishopAndQueenDirections = [-9, -11, 11, 9];
const kingDirections = [-1, -10, 1, 10, -9, -11, 11, 9];

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

// Return piece index.
function getPieceIndex(piece: number, pieceNum: number): number {
  return piece * 10 + pieceNum;
}
