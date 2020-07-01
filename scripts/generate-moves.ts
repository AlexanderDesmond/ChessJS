// Generate move data.
function toMoveData(
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
  let piece, sq, dir, index;

  // Pawn move generation.
  if (chessBoard.side === COLOURS.WHITE) {
    // Set piece type as white pawn.
    pieceType = PIECES.wP;

    // Go through all white pawns on the board.
    for (
      let pieceNum = 0;
      pieceNum < chessBoard.pieceNumber[pieceType];
      pieceNum++
    ) {
      square = chessBoard.pieceList[getPieceIndex(pieceType, pieceNum)];

      // If the square in front of the pawn is empty.
      if (chessBoard.pieces[square + 10] === PIECES.EMPTY) {
        whitePawnQuietMove(square, square + 10);

        // If the pawn is on the second rank and square two ranks in front is empty.
        if (
          ranks[square] === RANKS.RANK_2 &&
          chessBoard.pieces[square + 20] === PIECES.EMPTY
        ) {
          // Take double move.
          quietMove(
            toMoveData(
              square,
              square + 20,
              PIECES.EMPTY,
              PIECES.EMPTY,
              START_FLAG
            )
          );
        }
      }

      // Pawn capture moves.
      if (
        !isSquareOffBoard(square + 9) &&
        pieceColour[chessBoard.pieces[square + 9]] === COLOURS.BLACK
      ) {
        whitePawnCaptureMove(square, square + 9, chessBoard.pieces[square + 9]);
      }
      if (
        !isSquareOffBoard(square + 11) &&
        pieceColour[chessBoard.pieces[square + 11]] === COLOURS.BLACK
      ) {
        whitePawnCaptureMove(
          square,
          square + 11,
          chessBoard.pieces[square + 11]
        );
      }

      // En Passant captures.
      if (chessBoard.enPassant !== SQUARES.NO_SQUARE) {
        if (square + 9 === chessBoard.enPassant) {
          // Take En Passant move.
          enPassantMove(
            toMoveData(square, square + 9, PIECES.EMPTY, PIECES.EMPTY, EP_FLAG)
          );
        }
        if (square + 11 === chessBoard.enPassant) {
          // Take En Passant move.
          enPassantMove(
            toMoveData(square, square + 11, PIECES.EMPTY, PIECES.EMPTY, EP_FLAG)
          );
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
          // Take quiet move.
          quietMove(
            toMoveData(
              SQUARES.E1,
              SQUARES.G1,
              PIECES.EMPTY,
              PIECES.EMPTY,
              CASTLE_FLAG
            )
          );
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
          // Take quiet move.
          quietMove(
            toMoveData(
              SQUARES.E1,
              SQUARES.C1,
              PIECES.EMPTY,
              PIECES.EMPTY,
              CASTLE_FLAG
            )
          );
        }
      }
    }
  } else if (chessBoard.side === COLOURS.BLACK) {
    pieceType = PIECES.bP;

    // Go through all black pawns on the board.
    for (
      let pieceNum = 0;
      pieceNum < chessBoard.pieceNumber[pieceType];
      pieceNum++
    ) {
      square = chessBoard.pieceList[getPieceIndex(pieceType, pieceNum)];

      // If the square in front of the pawn is empty.
      if (chessBoard.pieces[square - 10] === PIECES.EMPTY) {
        blackPawnQuietMove(square, square - 10);

        // If the pawn is on the seventh rank and square two ranks in front is empty.
        if (
          ranks[square] === RANKS.RANK_7 &&
          chessBoard.pieces[square - 20] === PIECES.EMPTY
        ) {
          // Take double move.
          quietMove(
            toMoveData(
              square,
              square - 20,
              PIECES.EMPTY,
              PIECES.EMPTY,
              START_FLAG
            )
          );
        }
      }

      // Pawn capture moves.
      if (
        !isSquareOffBoard(square - 9) &&
        pieceColour[chessBoard.pieces[square - 9]] === COLOURS.WHITE
      ) {
        blackPawnCaptureMove(square, square - 9, chessBoard.pieces[square - 9]);
      }
      if (
        !isSquareOffBoard(square - 11) &&
        pieceColour[chessBoard.pieces[square - 11]] === COLOURS.WHITE
      ) {
        blackPawnCaptureMove(
          square,
          square - 11,
          chessBoard.pieces[square - 11]
        );
      }

      // En Passant captures.
      if (chessBoard.enPassant !== SQUARES.NO_SQUARE) {
        if (square - 9 === chessBoard.enPassant) {
          // Take En Passant move.
          enPassantMove(
            toMoveData(square, square - 9, PIECES.EMPTY, PIECES.EMPTY, EP_FLAG)
          );
        }
        if (square - 11 === chessBoard.enPassant) {
          // Take En Passant move.
          enPassantMove(
            toMoveData(square, square - 11, PIECES.EMPTY, PIECES.EMPTY, EP_FLAG)
          );
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
          // Take quiet move.
          quietMove(
            toMoveData(
              SQUARES.E8,
              SQUARES.G8,
              PIECES.EMPTY,
              PIECES.EMPTY,
              CASTLE_FLAG
            )
          );
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
          // Take quiet move.
          quietMove(
            toMoveData(
              SQUARES.E8,
              SQUARES.C8,
              PIECES.EMPTY,
              PIECES.EMPTY,
              CASTLE_FLAG
            )
          );
        }
      }
    }
  }

  // Non-sliding piece moves.
  index = nonSlidingPiecesIndices[chessBoard.side];
  piece = nonSlidingPieces[index++];

  while (piece !== 0) {
    for (
      let pieceNum = 0;
      pieceNum < chessBoard.pieceNumber[piece];
      pieceNum++
    ) {
      // Get the square that the piece is currently on.
      square = chessBoard.pieceList[getPieceIndex(piece, pieceNum)];

      // Go through all possible movement directions.
      for (let i = 0; i < directionNumbers[piece]; i++) {
        dir = pieceDirections[piece][i];

        // Target square = square + direction
        sq = square + dir;

        if (isSquareOffBoard(sq)) {
          continue;
        }

        if (chessBoard.pieces[sq] !== PIECES.EMPTY) {
          if (pieceColour[chessBoard.pieces[sq]] !== chessBoard.side) {
            // Take capture move.
            captureMove(
              toMoveData(square, sq, chessBoard.pieces[sq], PIECES.EMPTY, 0)
            );
          }
        } else {
          // Take quiet move.
          quietMove(toMoveData(square, sq, PIECES.EMPTY, PIECES.EMPTY, 0));
        }
      }
    }

    // Get next piece.
    piece = nonSlidingPieces[index++];
  }

  // Sliding piece moves.
  index = slidingPiecesIndices[chessBoard.side];
  piece = slidingPieces[index++];

  while (piece !== 0) {
    for (
      let pieceNum = 0;
      pieceNum < chessBoard.pieceNumber[piece];
      pieceNum++
    ) {
      // Get the square that the piece is currently on.
      square = chessBoard.pieceList[getPieceIndex(piece, pieceNum)];

      // Go through all possible movement directions.
      for (let i = 0; i < directionNumbers[piece]; i++) {
        dir = pieceDirections[piece][i];

        // Target square = square + direction
        sq = square + dir;

        while (!isSquareOffBoard(sq)) {
          if (chessBoard.pieces[sq] !== PIECES.EMPTY) {
            if (pieceColour[chessBoard.pieces[sq]] !== chessBoard.side) {
              // Take capture move.
              captureMove(
                toMoveData(square, sq, chessBoard.pieces[sq], PIECES.EMPTY, 0)
              );
            }
            break;
          }
          // Take quiet move.
          quietMove(toMoveData(square, sq, PIECES.EMPTY, PIECES.EMPTY, 0));

          sq += dir;
        }
      }
    }

    // Get next piece.
    piece = slidingPieces[index++];
  }
}

// Handle capture moves.
function captureMove(move: number): void {
  chessBoard.moveList[chessBoard.moveListStart[chessBoard.plyCount + 1]] = move;
  chessBoard.moveScores[
    chessBoard.moveListStart[chessBoard.plyCount + 1]++
  ] = 0;
}

// Handles 'quiet' (non-threatening, non-checking, and non-capturing) moves.
function quietMove(move: number): void {
  chessBoard.moveList[chessBoard.moveListStart[chessBoard.plyCount + 1]] = move;
  chessBoard.moveScores[
    chessBoard.moveListStart[chessBoard.plyCount + 1]++
  ] = 0;
}

// Handles En Passant moves.
function enPassantMove(move: number): void {
  chessBoard.moveList[chessBoard.moveListStart[chessBoard.plyCount + 1]] = move;
  chessBoard.moveScores[
    chessBoard.moveListStart[chessBoard.plyCount + 1]++
  ] = 0;
}

// Handles white pawn capture moves.
function whitePawnCaptureMove(
  origin: number,
  destination: number,
  captured: number
): void {
  // If on the seventh rank, promote the pawn on next move forward.
  if (ranks[origin] === RANKS.RANK_7) {
    captureMove(toMoveData(origin, destination, captured, PIECES.wQ, 0));
    captureMove(toMoveData(origin, destination, captured, PIECES.wR, 0));
    captureMove(toMoveData(origin, destination, captured, PIECES.wB, 0));
    captureMove(toMoveData(origin, destination, captured, PIECES.wN, 0));
  } else {
    captureMove(toMoveData(origin, destination, captured, PIECES.EMPTY, 0));
  }
}

// Handles black pawn capture moves.
function blackPawnCaptureMove(
  origin: number,
  destination: number,
  captured: number
): void {
  // If on the seventh rank, promote the pawn on next move forward.
  if (ranks[origin] === RANKS.RANK_2) {
    captureMove(toMoveData(origin, destination, captured, PIECES.bQ, 0));
    captureMove(toMoveData(origin, destination, captured, PIECES.bR, 0));
    captureMove(toMoveData(origin, destination, captured, PIECES.bB, 0));
    captureMove(toMoveData(origin, destination, captured, PIECES.bN, 0));
  } else {
    captureMove(toMoveData(origin, destination, captured, PIECES.EMPTY, 0));
  }
}

// Handles white pawn quiet moves.
function whitePawnQuietMove(origin: number, destination: number): void {
  if (ranks[origin] === RANKS.RANK_7) {
    quietMove(toMoveData(origin, destination, PIECES.EMPTY, PIECES.wQ, 0));
    quietMove(toMoveData(origin, destination, PIECES.EMPTY, PIECES.wR, 0));
    quietMove(toMoveData(origin, destination, PIECES.EMPTY, PIECES.wB, 0));
    quietMove(toMoveData(origin, destination, PIECES.EMPTY, PIECES.wN, 0));
  } else {
    quietMove(toMoveData(origin, destination, PIECES.EMPTY, PIECES.EMPTY, 0));
  }
}

// Handles white pawn quiet moves.
function blackPawnQuietMove(origin: number, destination: number): void {
  if (ranks[origin] === RANKS.RANK_2) {
    quietMove(toMoveData(origin, destination, PIECES.EMPTY, PIECES.bQ, 0));
    quietMove(toMoveData(origin, destination, PIECES.EMPTY, PIECES.bR, 0));
    quietMove(toMoveData(origin, destination, PIECES.EMPTY, PIECES.bB, 0));
    quietMove(toMoveData(origin, destination, PIECES.EMPTY, PIECES.bN, 0));
  } else {
    quietMove(toMoveData(origin, destination, PIECES.EMPTY, PIECES.EMPTY, 0));
  }
}