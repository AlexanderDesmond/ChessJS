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
  let bestMove: number = NO_MOVE,
    bestScore: number = -Infinity,
    line: string = "",
    pvNum: number = 0;

  clearForSearch();

  // Iterative deepening depth-first search
  for (
    let currentDepth = 1;
    currentDepth <= 5 /* searchController.depth */;
    currentDepth++
  ) {
    // Alpha Beta search algorithm here
    bestScore = alphaBeta(-Infinity, Infinity, currentDepth);

    // If the time has run out, stop searching.
    if (searchController.timeStopped) {
      break;
    }

    bestMove = searchPVTable();
    line =
      "Depth: " +
      currentDepth +
      ", Best Move: " +
      moveToString(bestMove) +
      ", Score: " +
      bestScore +
      ", Nodes: " +
      searchController.nodes;

    pvNum = getPVLine(currentDepth);
    line += " PV:";
    for (let i = 0; i < pvNum; i++) {
      line += " " + moveToString(chessBoard.pvArray[i]);
    }

    console.log(line);
  }

  searchController.best = bestMove;
  searchController.isThinking = false;
}

// Alpha Beta pruning algorithm
function alphaBeta(alpha: number, beta: number, depth: number): number {
  searchController.nodes++; // moved for now

  // If already at the lowest depth, evaluate the current position.
  if (depth <= 0) {
    return evaluatePosition();
  }

  // After every 2048 nodes are searched, check if the time limit has elapsed.
  if ((searchController.nodes & 2047) === 0) {
    checkTime();
  }

  //searchController.nodes++;

  // If the current position has already occurred,
  // or if no Pawn moves or captures have occurred in the last fifty moves, return 0.
  if (
    (checkForRepetition() || chessBoard.fiftyMoveRule >= 100) &&
    chessBoard.plyCount !== 0
  ) {
    return 0;
  }

  // If the maximum depth has been reached, evaluate the current position.
  if (chessBoard.plyCount > MAX_DEPTH - 1) {
    return evaluatePosition();
  }

  // If in check, look for a way to avoid checkmate.
  let InCheck = isSquareUnderAttack(
    chessBoard.pieceList[getPieceIndex(KINGS[chessBoard.side], 0)],
    chessBoard.side ^ 1
  );
  if (InCheck) {
    depth++;
  }

  let score = -Infinity;

  generateMoves();

  let moveNum: number = 0,
    legalMoveCount: number = 0,
    prevAlpha: number = alpha,
    bestMove: number = NO_MOVE,
    move: number = NO_MOVE;

  // Get Principal Variation move
  // Order Principal Variation move

  // Loop through generated moves.
  for (
    moveNum = chessBoard.moveListStart[chessBoard.plyCount];
    moveNum < chessBoard.moveListStart[chessBoard.plyCount + 1];
    ++moveNum
  ) {
    // getNextBestMove();

    move = chessBoard.moveList[moveNum];

    // If the move was illegal, skip to next iteration of loop.
    if (!makeMove(move)) {
      continue;
    }
    // Increment legal move count.
    legalMoveCount++;
    // Set move score.
    score = -alphaBeta(-beta, -alpha, depth - 1);
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
        if (legalMoveCount == 1) {
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

  // If there are no legal moves available, it's either checkmate or stalemate.
  if (legalMoveCount == 0) {
    // If in check, return distance to checkmate from root node. Otherwise, return 0.
    if (InCheck) {
      return -CHECKMATE + chessBoard.plyCount;
    } else {
      return 0;
    }
  }

  if (alpha != prevAlpha) {
    // Store best move in PV Table.
    storePVMove(bestMove);
  }

  return alpha;
}

// Checks if the allocated time has elapsed.
function checkTime(): void {
  if (Date.now() - searchController.startTime > searchController.time) {
    searchController.timeStopped = true;
  }
}

// Return true if the current position has occurred before, otherwise return false.
function checkForRepetition(): boolean {
  // Check for repetition after the most recent Pawn move or piece capture.
  for (
    let i = chessBoard.plyHistory - chessBoard.fiftyMoveRule;
    i < chessBoard.plyHistory - 1;
    i++
  ) {
    // If this position has already occurred.
    if (chessBoard.boardState === chessBoard.history[i].boardState) {
      return true;
    }
  }

  return false;
}

// Clear in preparation for search.
function clearForSearch(): void {
  // Clear searchHistory array.
  for (let i = 0; i < 14 * NUM_OF_SQUARES; i++) {
    chessBoard.searchHistory[i] = 0;
  }

  // Clear searchKillers array.
  for (let i = 0; i < 3 * MAX_DEPTH; i++) {
    chessBoard.searchKillers[i] = 0;
  }

  clearPVTable();

  // Reset plyCount to 0.
  chessBoard.plyCount = 0;
  // Reset nodes, failHigh, and failHighFirst to 0.
  searchController.nodes = 0;
  searchController.failHigh = 0;
  searchController.failHighFirst = 0;
  // Reset time properties.
  searchController.startTime = Date.now();
  searchController.timeStopped = false;
}

// Clear PV Table.
function clearPVTable(): void {
  for (let i = 0; i < PV_ENTRIES; i++) {
    chessBoard.pvTable[i].move = NO_MOVE;
    chessBoard.pvTable[i].boardState = 0;
  }
}
