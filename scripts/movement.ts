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

// Flags for En Passant, Pawn starting move, and castling
const EP_FLAG = 0x40000;
const START_FLAG = 0x80000;
const CASTLE_FLAG = 0x1000000;

// Flags for captured and promoted pieces.
const CAPTURED_FLAG = 0x7c000;
const PROMOTION_FLAG = 0xf00000;
