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

// Move piece
function movePiece(origin: number, destination: number): void {
  // Get piece from its origin square.
  let piece = chessBoard.pieces[origin];

  // Hash piece out of its origin square.
  hashPiece(piece, origin);

  // Set the origin square to have no piece.
  chessBoard.pieces[origin] = PIECES.EMPTY;

  // Hash the piece in its destination square.
  hashPiece(piece, destination);

  // Set the destination square to hold the piece.
  chessBoard.pieces[destination] = piece;

  // Update pieceList array.
  for (let i = 0; i < chessBoard.pieceNumber[piece]; i++) {
    if (chessBoard.pieceList[getPieceIndex(piece, i)] === origin) {
      chessBoard.pieceList[getPieceIndex(piece, i)] = destination;
      break;
    }
  }
}

// Make move
function makeMove(move: number): void {
  // Get origin and destination squares and side to move.
  let origin = getOriginSquare(move);
  let destination = getDestinationSquare(move);
  let side = chessBoard.side;

  // Record the current board state in the history array.
  chessBoard.history[chessBoard.plyHistory].boardState = chessBoard.boardState;

  // Check if the move is an En Passant capture
  if ((move & EP_FLAG) !== 0) {
    if (side === COLOURS.WHITE) {
      clearPiece(destination - 10);
    } else if (side === COLOURS.BLACK) {
      clearPiece(destination + 10);
    }
  }
  // Check if the move is Castling
  else if ((move & CASTLE_FLAG) !== 0) {
    switch (destination) {
      case SQUARES.C1:
        movePiece(SQUARES.A1, SQUARES.D1);
        break;
      case SQUARES.C8:
        movePiece(SQUARES.A8, SQUARES.D8);
        break;
      case SQUARES.G1:
        movePiece(SQUARES.H1, SQUARES.F1);
        break;
      case SQUARES.G8:
        movePiece(SQUARES.H8, SQUARES.F8);
        break;
      default:
        break;
    }
  }
}
