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
