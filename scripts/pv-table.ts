// Search the pvTable and return the move which matches the current board state.
function searchPVTable(): number {
  let index = chessBoard.boardState % PV_ENTRIES;

  if (chessBoard.pvTable[index].boardState === chessBoard.boardState) {
    return chessBoard.pvTable[index].move;
  }

  return NO_MOVE;
}
