// Search the pvTable and return the move which matches the current board state.
function searchPVTable(): number {
  const index = chessBoard.boardState % PV_ENTRIES;

  if (chessBoard.pvTable[index].boardState === chessBoard.boardState) {
    return chessBoard.pvTable[index].move;
  }

  return NO_MOVE;
}

// Store the current board state and given move in the pvTable.
function storePVMove(move: number): void {
  const index = chessBoard.boardState % PV_ENTRIES;

  chessBoard.pvTable[index].boardState = chessBoard.boardState;
  chessBoard.pvTable[index].move = move;
}
