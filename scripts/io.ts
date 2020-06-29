function squareToString(square: number): string {
  return fileChar[files[square]] + rankChar[ranks[square]];
}

function printMove(move: number): void {
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
}
