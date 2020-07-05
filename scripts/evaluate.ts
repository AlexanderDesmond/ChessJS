// Piece Tables:
const pawnTable = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  10,
  10,
  0,
  -10,
  -10,
  0,
  10,
  10,
  5,
  0,
  0,
  5,
  5,
  0,
  0,
  5,
  0,
  0,
  10,
  20,
  20,
  10,
  0,
  0,
  5,
  5,
  5,
  10,
  10,
  5,
  5,
  5,
  10,
  10,
  10,
  20,
  20,
  10,
  10,
  10,
  20,
  20,
  20,
  30,
  30,
  20,
  20,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
];

// Evaluate the current position then return the score.
function evaluatePosition(): number {
  // Score is the value of white pieces in play minus the value of black pieces in play.
  const score =
    chessBoard.material[COLOURS.WHITE] - chessBoard.material[COLOURS.BLACK];

  // Return the score for White or Black.
  if (chessBoard.side === COLOURS.WHITE) {
    return score;
  } else {
    return -score;
  }
}
