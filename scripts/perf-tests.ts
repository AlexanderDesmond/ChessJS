// Performances Testing
let leafNodes: number;

// Performance Test
function perfTest(depth: number): void {
  if (depth === 0) {
    leafNodes++;
    return;
  }

  // Generate Moves
  generateMoves();
  let move;

  // Loop through generated moves.
  for (
    let i = chessBoard.moveListStart[chessBoard.plyCount];
    i < chessBoard.moveListStart[chessBoard.plyCount + 1];
    i++
  ) {
    move = chessBoard.moveList[i];

    // If the move was illegal, skip to next iteration of loop.
    if (!makeMove(move)) {
      continue;
    }

    // Use recursion to go through the tree, then revert the move.
    perfTest(depth - 1);
    revertMove();
  }

  return;
}
