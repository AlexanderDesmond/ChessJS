function clearPiece(square: number): void {
  let piece = chessBoard.pieces[square];
  let colour = pieceColour[piece];

  // Hash the piece out the key.
  hashPiece(piece, square);

  // Remove the piece from the pieces array.
  chessBoard.pieces[square] = PIECES.EMPTY;
  // Remove the piece from the material array.
  chessBoard.material[colour] -= pieceValue[piece];

  // Remove the piece from the pieceList array.
  let temp = -1;

  for (let i = 0; i < chessBoard.pieceNumber[piece]; i++) {
    if (chessBoard.pieceList[getPieceIndex(piece, i)] === square) {
      temp = i;
      break;
    }
  }

  chessBoard.pieceNumber[piece]--;
  chessBoard.pieceList[getPieceIndex(piece, temp)] =
    chessBoard.pieceList[getPieceIndex(piece, chessBoard.pieceNumber[piece])];
}
