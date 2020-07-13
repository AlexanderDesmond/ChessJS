// Parse move
function parseMove(origin: number, destination: number): number {
  // Generate moves.
  generateMoves(false);

  let move: number = NO_MOVE,
    promoted: number = PIECES.EMPTY,
    found: boolean = false;
  // Go through all legal moves in current position.
  for (
    let i = chessBoard.moveListStart[chessBoard.plyCount];
    i < chessBoard.moveListStart[chessBoard.plyCount + 1];
    i++
  ) {
    move = chessBoard.moveList[i];

    // Has the user made this move.
    if (
      getOriginSquare(move) === origin &&
      getDestinationSquare(move) === destination
    ) {
      promoted = getPromotedPiece(move);
      // If the move was a promotion.
      if (promoted !== PIECES.EMPTY) {
        // If it was a promotion to a Queen.
        if (
          (promoted === PIECES.wQ && chessBoard.side === COLOURS.WHITE) ||
          (promoted === PIECES.bQ && chessBoard.side === COLOURS.BLACK)
        ) {
          found = true;
          break;
        }
        continue;
      }

      found = true;
      break;
    }
  }

  // If a move was round.
  if (found !== false) {
    // If the move was illegal.
    if (makeMove(move) === false) {
      return NO_MOVE;
    }
    // Revert move.
    revertMove();
    return move;
  }

  return NO_MOVE;
}

function printMoveList(): void {
  let move;
  console.log("Move List:");

  for (
    let i = chessBoard.moveListStart[chessBoard.plyCount];
    i < chessBoard.moveListStart[chessBoard.plyCount + 1];
    i++
  ) {
    move = chessBoard.moveList[i];
    console.log(moveToString(move));
  }
}

function squareToString(square: number): string {
  return fileChar[files[square]] + rankChar[ranks[square]];
}

function moveToString(move: number): string {
  let s;

  let fileOrigin = files[getOriginSquare(move)];
  let rankOrigin = ranks[getOriginSquare(move)];
  let fileDestination = files[getDestinationSquare(move)];
  let rankDestination = ranks[getDestinationSquare(move)];

  s =
    fileChar[fileOrigin] +
    rankChar[rankOrigin] +
    fileChar[fileDestination] +
    rankChar[rankDestination];

  let promoted = getPromotedPiece(move);
  if (promoted !== PIECES.EMPTY) {
    let c = "q";

    if (isKnight[promoted]) {
      c = "n";
    } else if (isBishopOrQueen[promoted] && !isRookOrQueen[promoted]) {
      c = "b";
    } else if (isRookOrQueen[promoted] && !isBishopOrQueen[promoted]) {
      c = "r";
    }

    s += c;
  }

  return s;
}
