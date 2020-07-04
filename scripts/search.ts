const searchController = <any>{};

// Number of nodes visited during the search.
searchController.nodes;
// For Alpha-Beta pruning.
searchController.failHigh;
searchController.failHighFirst;
// Depth to search to.
searchController.depth;
// Time to search for.
searchController.time;
// Time the engine started searching.
searchController.startTime;
// Has searching been stopped or not.
searchController.timeStopped;
// The best move.
searchController.best;
// If the engine is thinking or not.
searchController.isThinking;

// Get the best move for the current position.
function searchPosition(): void {
  let bestMove: number = NO_MOVE;
  let bestScore: number = -Infinity;

  // Iterative deepening depth-first search
  for (
    let currentDepth = 1;
    currentDepth <= searchController.depth;
    currentDepth++
  ) {
    // Alpha Beta search algorithm here

    // If the time has run out, stop searching.
    if (searchController.timeStopped) {
      break;
    }
  }

  searchController.best = bestMove;
  searchController.isThinking = false;
}

// Alpha Beta pruning algorithm
function alphaBeta(alpha: number, beta: number, depth: number): number {
  // If already at the lowest depth, evaluate the current position.
  if (depth <= 0) {
    // return evaluate();
  }

  // checkTime();

  searchController.nodes++;

  // checkRepetition(); checkFiftyMoves();

  // If the maximum depth has been reached, evaluate the current position.
  if (chessBoard.plyCount > MAX_DEPTH - 1) {
    // return evaluate();
  }

  let score: number = -Infinity;

  generateMoves();

  let moveNum: number = 0;
  let legalMoveCount: number = 0;
  let prevAlpha: number = alpha;
  let bestMove: number = NO_MOVE;
  let move: number = NO_MOVE;

  // Get Principal Variation move
  // Order Principal Variation move

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

    // Increment legal move count.
    legalMoveCount++;
    // Set move score.
    score = -alphaBeta(-alpha, -beta, depth - 1);

    // Revert move.
    revertMove();

    // If search time has run out, return 0.
    if (searchController.timeStopped) {
      return 0;
    }

    // Check if alpha has been improved.
    if (score > alpha) {
      // Check for beta cut-off
      if (score >= beta) {
        if (legalMoveCount === 1) {
          searchController.failHighFirst++;
        }
        searchController.failHigh++;
        // updateKillerMoves();

        return beta;
      }

      alpha = score;
      bestMove = move;

      // updateHistoryTable();
    }
  }

  // checkCheckmate();

  if (alpha !== prevAlpha) {
    // Store Principal Variation move
  }

  return alpha;
}
