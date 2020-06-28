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

  let pieceType, sq;

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
      sq = chessBoard.pieceList[getPieceIndex(pieceType, pieceNum)];

      // If the square in front of the pawn is empty.
      if (chessBoard.pieces[sq + 10] === PIECES.EMPTY) {
        // Add pawn move.

        // If the pawn is on the second rank and square two ranks in front is empty.
        if (
          ranks[sq] === RANKS.RANK_2 &&
          chessBoard.pieces[sq + 20] === PIECES.EMPTY
        ) {
          // Add quiet move
        }
      }

      // Pawn capture moves.
      if (pieceColour[chessBoard.pieces[sq + 9]] === COLOURS.BLACK) {
        // Add pawn capture move.
      }
      if (pieceColour[chessBoard.pieces[sq + 11]] === COLOURS.BLACK) {
        // Add pawn capture move.
      }

      // En Passant captures.
      if (chessBoard.enPassant !== SQUARES.NO_SQUARE) {
        if (sq + 9 === chessBoard.enPassant) {
          // Add En Passant move.
        }
        if (sq + 11 === chessBoard.enPassant) {
          // Add En Passant move.
        }
      }
    }

    pieceType = PIECES.wN;
  } else if (chessBoard.side === COLOURS.BLACK) {
    pieceType = PIECES.bP;

    // Go through all black pawns on the board.
    for (
      let pieceNum = 0;
      pieceNum < chessBoard.pieceNumber[pieceType];
      pieceType++
    ) {
      sq = chessBoard.pieceList[getPieceIndex(pieceType, pieceNum)];

      // If the square in front of the pawn is empty.
      if (chessBoard.pieces[sq - 10] === PIECES.EMPTY) {
        // Add pawn move.

        // If the pawn is on the seventh rank and square two ranks in front is empty.
        if (
          ranks[sq] === RANKS.RANK_7 &&
          chessBoard.pieces[sq - 20] === PIECES.EMPTY
        ) {
          // Add quiet move
        }
      }

      // Pawn capture moves.
      if (pieceColour[chessBoard.pieces[sq - 9]] === COLOURS.WHITE) {
        // Add pawn capture move.
      }
      if (pieceColour[chessBoard.pieces[sq - 11]] === COLOURS.WHITE) {
        // Add pawn capture move.
      }

      // En Passant captures.
      if (chessBoard.enPassant !== SQUARES.NO_SQUARE) {
        if (sq - 9 === chessBoard.enPassant) {
          // Add En Passant move.
        }
        if (sq - 11 === chessBoard.enPassant) {
          // Add En Passant move.
        }
      }
    }

    pieceType = PIECES.bN;
  }
}
