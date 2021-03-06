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

// Constants for move history
const MAX_GAME_MOVES: number = 2048;
const MAX_POSITION_MOVES: number = 256;
const MAX_DEPTH: number = 64;

// Checkmate score
const CHECKMATE: number = 10000;
// Size of Principal Variation table
const PV_ENTRIES: number = 10000;

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
const knightDirections: number[] = [-8, -19, -21, -12, 8, 19, 21, 12];
const rookAndQueenDirections: number[] = [-1, -10, 1, 10];
const bishopAndQueenDirections: number[] = [-9, -11, 11, 9];
const kingDirections: number[] = [-1, -10, 1, 10, -9, -11, 11, 9];
//
const directionNumbers: number[] = [0, 0, 8, 4, 4, 8, 8, 0, 8, 4, 4, 8, 8];
const pieceDirections: number[][] = [
  [0],
  [0],
  knightDirections,
  bishopAndQueenDirections,
  rookAndQueenDirections,
  kingDirections,
  kingDirections,
  [0],
  knightDirections,
  bishopAndQueenDirections,
  rookAndQueenDirections,
  kingDirections,
  kingDirections,
];
const nonSlidingPieces: number[] = [
  PIECES.wN,
  PIECES.wK,
  0,
  PIECES.bN,
  PIECES.bK,
  0,
];
const nonSlidingPiecesIndices: number[] = [0, 3];
const slidingPieces: number[] = [
  PIECES.wB,
  PIECES.wR,
  PIECES.wQ,
  0,
  PIECES.bB,
  PIECES.bR,
  PIECES.bQ,
  0,
];
const slidingPiecesIndices: number[] = [0, 4];

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

// For reversing Piece Tables for Black
const MIRROR_64 = [
  56,
  57,
  58,
  59,
  60,
  61,
  62,
  63,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
];

// Return MIRROR_64
function getMirror64(square: number): number {
  return MIRROR_64[square];
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

const KINGS = [PIECES.wK, PIECES.bK];
const CASTLING_PERMISSIONS = [
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  13,
  15,
  15,
  15,
  12,
  15,
  15,
  14,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  7,
  15,
  15,
  15,
  3,
  15,
  15,
  11,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
  15,
];

// Flags for En Passant, Pawn starting move, and castling
const EP_FLAG: number = 0x40000;
const START_FLAG: number = 0x80000;
const CASTLE_FLAG: number = 0x1000000;
// Flags for captured and promoted pieces.
const CAPTURED_FLAG: number = 0x7c000;
const PROMOTION_FLAG: number = 0xf00000;
// If there was no move.
const NO_MOVE: number = 0;

// Return the origin square of a piece.
function getOriginSquare(move: number): number {
  return move & 0x7f;
}

// Return the destination square of a piece.
function getDestinationSquare(move: number): number {
  return (move >> 7) & 0x7f;
}

// Return the captured piece.
function getCapturedPiece(move: number): number {
  return (move >> 14) & 0xf;
}

// Return the promoted piece.
function getPromotedPiece(move: number): number {
  return (move >> 20) & 0xf;
}

// Returns true if the square is off the board, returns false otherwise.
function isSquareOffBoard(square: number): boolean {
  if (files[square] === SQUARES.OFFBOARD) return true;
  else return false;
}

// Hash the piece out or in.
function hashPiece(piece: number, square: number): void {
  chessBoard.boardState ^= pieceKeys[piece * 120 + square];
}

// Hash the castling key in or out
function hashCastling(): void {
  chessBoard.boardState ^= castlingKeys[chessBoard.castling];
}

// Hash the side permission in or out
function hashSide(): void {
  chessBoard.boardState ^= sideKey;
}

// Hash the en passant key in or out
function hashEnPassant(): void {
  chessBoard.boardState ^= pieceKeys[chessBoard.enPassant];
}

// Properties for controlling the game
const gameController = <any>{};
gameController.engineSide = COLOURS.BOTH;
gameController.playerSide = COLOURS.BOTH;
gameController.gameOver = false;

// Properties for holding data about moves the user makes.
const userMove = <any>{};
userMove.origin = SQUARES.NO_SQUARE;
userMove.destination = SQUARES.NO_SQUARE;
