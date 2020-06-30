// Clear piece
function clearPiece(square: number): void {
  let piece = chessBoard.pieces[square];
  let colour = pieceColour[piece];

  // Hash the piece out the key.
  hashPiece(piece, square);

  // Remove the piece from the pieces array.
  chessBoard.pieces[square] = PIECES.EMPTY;
  // Remove the piece's colour from the material array.
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

// Add piece
function addPiece(piece: number, square: number): void {
  let colour = pieceColour[piece];

  // Hash the piece into the key.
  hashPiece(piece, square);

  // Add the piece to the pieces array.
  chessBoard.pieces[square] = piece;
  // Add the piece's colour to the material array.
  chessBoard.material[colour] += pieceValue[piece];

  // Add the piece to the pieceList array.
  chessBoard.pieceList[
    getPieceIndex(piece, chessBoard.pieceNumber[piece])
  ] = square;
  chessBoard.pieceNumber[piece]++;
}
