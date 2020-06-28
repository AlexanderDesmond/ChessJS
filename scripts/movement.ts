// Generate move data.
function move(
  origin: number,
  destination: number,
  captured: number,
  promoted: number,
  flag: number
): number {
  return (
    origin | (destination << 7) | (captured << 14) | (promoted << 20) | flag
  );
}

// Generate moves.
function generateMoves(): void {
  chessBoard.moveListStart[chessBoard.plyCount + 1] =
    chessBoard.moveListStart[chessBoard.plyCount];

  let pieceType, square;
  let piece, sq, index;

  // Pawn move generation.
  if (chessBoard.side === COLOURS.WHITE) {
    // Set piece type as white pawn.
    pieceType = PIECES.wP;

    // Go through all white pawns on the board.
    for (
      let pieceNum = 0;
      pieceNum < chessBoard.pieceNumber[pieceType];
      pieceType++
    ) {
      square = chessBoard.pieceList[getPieceIndex(pieceType, pieceNum)];

      // If the square in front of the pawn is empty.
      if (chessBoard.pieces[square + 10] === PIECES.EMPTY) {
        // Add pawn move.

        // If the pawn is on the second rank and square two ranks in front is empty.
        if (
          ranks[square] === RANKS.RANK_2 &&
          chessBoard.pieces[square + 20] === PIECES.EMPTY
        ) {
          // Add quiet move
        }
      }

      // Pawn capture moves.
      if (
        !isSquareOffBoard(square + 9) &&
        pieceColour[chessBoard.pieces[square + 9]] === COLOURS.BLACK
      ) {
        // Add pawn capture move.
      }
      if (
        !isSquareOffBoard(square + 11) &&
        pieceColour[chessBoard.pieces[square + 11]] === COLOURS.BLACK
      ) {
        // Add pawn capture move.
      }

      // En Passant captures.
      if (chessBoard.enPassant !== SQUARES.NO_SQUARE) {
        if (square + 9 === chessBoard.enPassant) {
          // Add En Passant move.
        }
        if (square + 11 === chessBoard.enPassant) {
          // Add En Passant move.
        }
      }
    }

    // Handle castling moves.
    // Handle kingside castling.
    if (chessBoard.castling & CASTLE_BIT.WKCA) {
      // If F1 and G1 are empty.
      if (
        chessBoard.pieces[SQUARES.F1] === PIECES.EMPTY &&
        chessBoard.pieces[SQUARES.G1] === PIECES.EMPTY
      ) {
        if (
          !isSquareUnderAttack(SQUARES.F1, COLOURS.BLACK) &&
          isSquareUnderAttack(SQUARES.E1, COLOURS.BLACK)
        ) {
          // Add quiet move.
        }
      }
    }
    // Handle queenside castling.
    if (chessBoard.castling & CASTLE_BIT.WQCA) {
      // If F1 and G1 are empty.
      if (
        chessBoard.pieces[SQUARES.D1] === PIECES.EMPTY &&
        chessBoard.pieces[SQUARES.C1] === PIECES.EMPTY &&
        chessBoard.pieces[SQUARES.B1] === PIECES.EMPTY
      ) {
        if (
          !isSquareUnderAttack(SQUARES.D1, COLOURS.BLACK) &&
          isSquareUnderAttack(SQUARES.E1, COLOURS.BLACK)
        ) {
          // Add quiet move.
        }
      }
    }
  } else if (chessBoard.side === COLOURS.BLACK) {
    pieceType = PIECES.bP;

    // Go through all black pawns on the board.
    for (
      let pieceNum = 0;
      pieceNum < chessBoard.pieceNumber[pieceType];
      pieceType++
    ) {
      square = chessBoard.pieceList[getPieceIndex(pieceType, pieceNum)];

      // If the square in front of the pawn is empty.
      if (chessBoard.pieces[square - 10] === PIECES.EMPTY) {
        // Add pawn move.

        // If the pawn is on the seventh rank and square two ranks in front is empty.
        if (
          ranks[square] === RANKS.RANK_7 &&
          chessBoard.pieces[square - 20] === PIECES.EMPTY
        ) {
          // Add quiet move
        }
      }

      // Pawn capture moves.
      if (
        !isSquareOffBoard(square - 9) &&
        pieceColour[chessBoard.pieces[square - 9]] === COLOURS.WHITE
      ) {
        // Add pawn capture move.
      }
      if (
        !isSquareOffBoard(square - 11) &&
        pieceColour[chessBoard.pieces[square - 11]] === COLOURS.WHITE
      ) {
        // Add pawn capture move.
      }

      // En Passant captures.
      if (chessBoard.enPassant !== SQUARES.NO_SQUARE) {
        if (square - 9 === chessBoard.enPassant) {
          // Add En Passant move.
        }
        if (square - 11 === chessBoard.enPassant) {
          // Add En Passant move.
        }
      }
    }

    // Handle castling moves.
    // Handle kingside castling.
    if (chessBoard.castling & CASTLE_BIT.BKCA) {
      // If F1 and G1 are empty.
      if (
        chessBoard.pieces[SQUARES.F8] === PIECES.EMPTY &&
        chessBoard.pieces[SQUARES.G8] === PIECES.EMPTY
      ) {
        if (
          !isSquareUnderAttack(SQUARES.F8, COLOURS.WHITE) &&
          isSquareUnderAttack(SQUARES.E8, COLOURS.WHITE)
        ) {
          // Add quiet move.
        }
      }
    }
    // Handle queenside castling.
    if (chessBoard.castling & CASTLE_BIT.BQCA) {
      // If F1 and G1 are empty.
      if (
        chessBoard.pieces[SQUARES.D8] === PIECES.EMPTY &&
        chessBoard.pieces[SQUARES.C8] === PIECES.EMPTY &&
        chessBoard.pieces[SQUARES.B8] === PIECES.EMPTY
      ) {
        if (
          !isSquareUnderAttack(SQUARES.D8, COLOURS.WHITE) &&
          isSquareUnderAttack(SQUARES.E8, COLOURS.WHITE)
        ) {
          // Add quiet move.
        }
      }
    }
  }
}
