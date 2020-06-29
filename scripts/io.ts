function squareToString(square: number): string {
  return fileChar[files[square]] + rankChar[ranks[square]];
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
