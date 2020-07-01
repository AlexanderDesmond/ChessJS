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
function makeMove(move: number): boolean {
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
        console.log("ERROR: Error with Castling!");
        break;
    }
  }

  // Hash out En Passant square.
  if (chessBoard.enPassant !== SQUARES.NO_SQUARE) hashEnPassant();
  // Hash out Castling permission.
  hashCastling();

  // Set up values for history.
  chessBoard.history[chessBoard.plyHistory].move = move;
  chessBoard.history[chessBoard.plyHistory].fiftyMoveRule =
    chessBoard.fiftyMoveRule;
  chessBoard.history[chessBoard.plyHistory].enPassant = chessBoard.enPassant;
  chessBoard.history[chessBoard.plyHistory].castling = chessBoard.castling;

  // Update Castling permissions.
  chessBoard.castling &= CASTLING_PERMISSIONS[origin];
  chessBoard.castling &= CASTLING_PERMISSIONS[destination];
  chessBoard.enPassant = SQUARES.NO_SQUARE;
  // Hash in castling permissions.
  hashCastling();

  // Get captured piece.
  let captured = getCapturedPiece(move);
  chessBoard.fiftyMoveRule++;

  // If you captured a piece, remove it from the board.
  if (captured !== PIECES.EMPTY) {
    clearPiece(destination);
    chessBoard.fiftyMoveRule = 0;
  }

  // Increment ply count and ply history.
  chessBoard.plyCount++;
  chessBoard.plyHistory++;

  // Handle Pawn move.
  if (isPawn[chessBoard.pieces[origin]]) {
    chessBoard.fiftyMoveRule = 0;

    // If it's an En Passant move.
    if ((move & EP_FLAG) !== 0) {
      if (side === COLOURS.WHITE) {
        chessBoard.enPassant = origin + 10;
      } else if (side === COLOURS.BLACK) {
        chessBoard.enPassant = origin - 10;
      }
      hashEnPassant();
    }
  }

  // Move the piece.
  movePiece(origin, destination);

  // Handle Pawn promotion
  let promoted = getPromotedPiece(move);
  if (promoted !== PIECES.EMPTY) {
    clearPiece(destination);
    addPiece(destination, promoted);
  }

  // After turn, switch the side.
  chessBoard.side ^= 1;
  hashSide();

  // Ensure the move does not leave the King in check.
  if (
    isSquareUnderAttack(
      chessBoard.pieceList[getPieceIndex(KINGS[side], 0)],
      chessBoard.side
    )
  ) {
    revertMove();

    return false;
  }

  // If all is fine return true.
  return true;
}

// Revert move.
function revertMove(): void {
  // Decrement the ply count and ply history.
  chessBoard.plyCount--;
  chessBoard.plyHistory--;

  // Get the move, and origin and destination squares
  let move = chessBoard.history[chessBoard.plyHistory].move;
  let origin = getOriginSquare(move);
  let destination = getDestinationSquare(move);

  // Hash out En Passant square.
  if (chessBoard.enPassant !== SQUARES.NO_SQUARE) hashEnPassant();
  // Hash out Castling permission.
  hashCastling();

  // Reset Castling permissions, En Passant squares, and the Fifty Move Rule.
  chessBoard.castling = chessBoard.history[chessBoard.plyHistory].castling;
  chessBoard.enPassant = chessBoard.history[chessBoard.plyHistory].enPassant;
  chessBoard.fiftyMoveRule =
    chessBoard.history[chessBoard.plyHistory].fiftyMoveRule;
}
