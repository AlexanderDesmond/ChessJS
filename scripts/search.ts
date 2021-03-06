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
    score: number = -Infinity,
    bestScore: number = -Infinity,
    line: string = "",
    pvNum: number = 0,
    currentDepth: number = 1;

  clearForSearch();

  // Iterative deepening depth-first search
  for (
    currentDepth = 1;
    currentDepth <= searchController.depth;
    currentDepth++
  ) {
    // Alpha Beta search algorithm here
    score = alphaBeta(-Infinity, Infinity, currentDepth);

    // If the time has run out, stop searching.
    if (searchController.timeStopped) {
      break;
    }

    bestScore = score;
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
    if (currentDepth !== 1) {
      line +=
        " Ordering: " +
        (
          (searchController.failHighFirst / searchController.failHigh) *
          100
        ).toFixed(2) +
        "%";
    }

    console.log(line);
  }

  searchController.best = bestMove;
  searchController.isThinking = false;

  // Update engine output on GUI
  updateEngineOutput(bestScore, currentDepth);
}

// Alpha Beta pruning algorithm
function alphaBeta(alpha: number, beta: number, depth: number): number {
  // If already at the lowest depth, evaluate the current position with quiescence search.
  if (depth <= 0) {
    return quiescenceSearch(alpha, beta);
  }

  // After every 2048 nodes are searched, check if the time limit has elapsed.
  if ((searchController.nodes & 2047) === 0) {
    checkTime();
  }

  searchController.nodes++;

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
  let inCheck = isSquareUnderAttack(
    chessBoard.pieceList[getPieceIndex(KINGS[chessBoard.side], 0)],
    chessBoard.side ^ 1
  );
  if (inCheck) {
    depth++;
  }

  let score = -Infinity;

  generateMoves(false);

  let moveNum: number = 0,
    legalMoveCount: number = 0,
    prevAlpha: number = alpha,
    bestMove: number = NO_MOVE,
    move: number = NO_MOVE;

  // Search PV Table
  let pvMove: number = searchPVTable();
  // Prioritise best line from previous search.
  if (pvMove !== NO_MOVE) {
    for (
      moveNum = chessBoard.moveListStart[chessBoard.plyCount];
      moveNum < chessBoard.moveListStart[chessBoard.plyCount + 1];
      ++moveNum
    ) {
      if (chessBoard.moveList[moveNum] === pvMove) {
        chessBoard.moveScores[moveNum] = 2000000;
        break;
      }
    }
  }

  // Loop through generated moves.
  for (
    moveNum = chessBoard.moveListStart[chessBoard.plyCount];
    moveNum < chessBoard.moveListStart[chessBoard.plyCount + 1];
    ++moveNum
  ) {
    // Get the next best move.
    getNextBestMove(moveNum);

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
        if (legalMoveCount === 1) {
          searchController.failHighFirst++;
        }
        searchController.failHigh++;

        // If the move was not a capture.
        if ((move & CAPTURED_FLAG) === 0) {
          // First killer move assigned as second killer move.
          chessBoard.searchKillers[MAX_DEPTH + chessBoard.plyCount] =
            chessBoard.searchKillers[chessBoard.plyCount];
          // First move is now the latest non-capturing move which is better than beta.
          chessBoard.searchKillers[chessBoard.plyCount] = move;
        }

        return beta;
      }

      // If the move was not a capture.
      if ((move & CAPTURED_FLAG) === 0) {
        chessBoard.searchHistory[
          chessBoard.pieces[getOriginSquare(move)] * NUM_OF_SQUARES +
            getDestinationSquare(move)
        ] += depth * depth;
      }

      alpha = score;
      bestMove = move;

      // updateHistoryTable();
    }
  }

  // If there are no legal moves available, it's either checkmate or stalemate.
  if (legalMoveCount === 0) {
    // If in check, return distance to checkmate from root node. Otherwise, return 0.
    if (inCheck) {
      return -CHECKMATE + chessBoard.plyCount;
    } else {
      return 0;
    }
  }

  if (alpha !== prevAlpha) {
    // Store best move in PV Table.
    storePVMove(bestMove);
  }

  return alpha;
}

// Quiescence search algorithm - Extends search in volatile positions (when captures can occur) to find quiet positions.
function quiescenceSearch(alpha: number, beta: number): number {
  // After every 2048 nodes are searched, check if the time limit has elapsed.
  if ((searchController.nodes & 2047) === 0) {
    checkTime();
  }

  searchController.nodes++;

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

  // Get score for current position.
  let score = evaluatePosition();

  // If the score is still better than beta, beta can be safely returned.
  if (score >= beta) {
    return beta;
  }

  // If the score is greater than alpha, increase alpha to score.
  if (score > alpha) {
    alpha = score;
  }

  generateMoves(true); // need to change this and the function

  let moveNum: number = 0,
    legalMoveCount: number = 0,
    prevAlpha: number = alpha,
    bestMove: number = NO_MOVE,
    move: number = NO_MOVE;

  // Loop through generated moves.
  for (
    moveNum = chessBoard.moveListStart[chessBoard.plyCount];
    moveNum < chessBoard.moveListStart[chessBoard.plyCount + 1];
    ++moveNum
  ) {
    // Get the next best move.
    getNextBestMove(moveNum);

    move = chessBoard.moveList[moveNum];

    // If the move was illegal, skip to next iteration of loop.
    if (!makeMove(move)) {
      continue;
    }
    // Increment legal move count.
    legalMoveCount++;
    // Set move score.
    score = -quiescenceSearch(-beta, -alpha);
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

        return beta;
      }
      alpha = score;
      bestMove = move;
    }
  }

  if (alpha !== prevAlpha) {
    // Store best move in PV Table.
    storePVMove(bestMove);
  }

  return alpha;
}

// Find the best next move.
function getNextBestMove(moveIndex: number): void {
  let bestScore: number = -1,
    bestIndex: number = moveIndex;

  // Loop through all current possible moves from current move index.
  for (
    let i = moveIndex;
    i < chessBoard.moveListStart[chessBoard.plyCount + 1];
    i++
  ) {
    // If the score in moveScores is better than the bestScore
    if (chessBoard.moveScores[i] > bestScore) {
      // bestScore equals the score in moveScores.
      bestScore = chessBoard.moveScores[i];
      // bestIndex equals the current index.
      bestIndex = i;
    }
  }

  if (bestIndex !== moveIndex) {
    // Swap scores at moveIndex and bestIndex indices in moveScores.
    let temp: number = 0;
    temp = chessBoard.moveScores[moveIndex];
    chessBoard.moveScores[moveIndex] = chessBoard.moveScores[bestIndex];
    chessBoard.moveScores[bestIndex] = temp;

    // Swap scores at moveIndex and bestIndex indices in moveList.
    temp = chessBoard.moveList[moveIndex];
    chessBoard.moveList[moveIndex] = chessBoard.moveList[bestIndex];
    chessBoard.moveList[bestIndex] = temp;
  }
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

// Update engine output info on GUI
function updateEngineOutput(score: number, depth: number): void {
  let scoreTxt: string = "Score: " + (score / 100).toFixed(2);

  // For Checkmate
  if (Math.abs(score) > CHECKMATE - MAX_DEPTH) {
    scoreTxt =
      "Score: Checkmate in " + (CHECKMATE - Math.abs(score) - 1) + " moves";
  }

  document.getElementsByClassName("ordering-spn")[0].textContent =
    "Ordering: " +
    (
      (searchController.failHighFirst / searchController.failHigh) *
      100
    ).toFixed(2) +
    "%";
  document.getElementsByClassName("depth-spn")[0].textContent =
    "Depth: " + depth;
  document.getElementsByClassName("score-spn")[0].textContent = scoreTxt;
  document.getElementsByClassName("nodes-spn")[0].textContent =
    "Nodes: " + searchController.nodes;
  document.getElementsByClassName("time-spn")[0].textContent =
    "Time: " +
    ((Date.now() - searchController.startTime) / 1000).toFixed(1) +
    "s";
  document.getElementsByClassName("best-move-spn")[0].textContent =
    "Best Move: " + moveToString(searchController.best);
}
