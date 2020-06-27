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
