// Search the pvTable and return the move which matches the current board state.
function searchPVTable(): number {
  const index = Math.abs(chessBoard.boardState % PV_ENTRIES);

  if (chessBoard.pvTable[index].boardState === chessBoard.boardState) {
    return chessBoard.pvTable[index].move;
  }

  return NO_MOVE;
}

// Store the current board state and given move in the pvTable.
function storePVMove(move: number): void {
  const index = Math.abs(chessBoard.boardState % PV_ENTRIES);

  chessBoard.pvTable[index].boardState = chessBoard.boardState;
  chessBoard.pvTable[index].move = move;
}

// Get line of moves from PV Table
function getPVLine(depth: number): number {
  let move: number = searchPVTable(),
    count: number = 0;

  while (move !== NO_MOVE && count < depth) {
    if (moveExists(move)) {
      // Make the move and add it to the pvArray.
      makeMove(move);
      chessBoard.pvArray[count++] = move;
    } else {
      break;
    }
    // Get the next move from the PV Table.
    move = searchPVTable();
  }

  // Revert moves.
  while (chessBoard.plyCount > 0) {
    revertMove();
  }

  return count;
}
