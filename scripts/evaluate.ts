// Evaluate the current position then return the score.
function evaluatePosition(): number {
  // Score is the value of white pieces in play minus the value of black pieces in play.
  let score =
    chessBoard.material[COLOURS.WHITE] - chessBoard.material[COLOURS.BLACK];

  // Return the score for White or Black.
  if (chessBoard.side === COLOURS.WHITE) {
    return score;
  } else {
    return -score;
  }
}
