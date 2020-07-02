// Performances Testing
let nodes: number;

// Performance Test
function perfTest(depth: number): void {
  if (depth === 0) {
    nodes++;
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

// Start Performance Test
function startPerfTest(depth: number): void {
  printBoard();
  console.log("Starting Test to Depth: ", depth);
  nodes = 0;

  let move: number,
    moveNum: number = 0;

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

    moveNum++;
    let nodesSum = nodes;
    perfTest(depth - 1);
    revertMove();
    let oldNodes = nodes - nodesSum;

    console.log("Move: " + moveNum + " " + moveToString(move) + " " + oldNodes);
  }

  console.log("Test Complete: " + nodes + " leaf nodes visited.");

  return;
}
