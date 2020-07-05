// Piece Tables:
const pawnTable = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  10,
  10,
  0,
  -10,
  -10,
  0,
  10,
  10,
  5,
  0,
  0,
  5,
  5,
  0,
  0,
  5,
  0,
  0,
  10,
  20,
  20,
  10,
  0,
  0,
  5,
  5,
  5,
  10,
  10,
  5,
  5,
  5,
  10,
  10,
  10,
  20,
  20,
  10,
  10,
  10,
  20,
  20,
  20,
  30,
  30,
  20,
  20,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
];
const knightTable = [
  0,
  -10,
  0,
  0,
  0,
  0,
  -10,
  0,
  0,
  0,
  0,
  5,
  5,
  0,
  0,
  0,
  0,
  0,
  10,
  10,
  10,
  10,
  0,
  0,
  0,
  0,
  10,
  20,
  20,
  10,
  5,
  0,
  5,
  10,
  15,
  20,
  20,
  15,
  10,
  5,
  5,
  10,
  10,
  20,
  20,
  10,
  10,
  5,
  0,
  0,
  5,
  10,
  10,
  5,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
];
const bishopTable = [
  0,
  0,
  -10,
  0,
  0,
  -10,
  0,
  0,
  0,
  0,
  0,
  10,
  10,
  0,
  0,
  0,
  0,
  0,
  10,
  15,
  15,
  10,
  0,
  0,
  0,
  10,
  15,
  20,
  20,
  15,
  10,
  0,
  0,
  10,
  15,
  20,
  20,
  15,
  10,
  0,
  0,
  0,
  10,
  15,
  15,
  10,
  0,
  0,
  0,
  0,
  0,
  10,
  10,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
];
const rookTable = [
  0,
  0,
  5,
  10,
  10,
  5,
  0,
  0,
  0,
  0,
  5,
  10,
  10,
  5,
  0,
  0,
  0,
  0,
  5,
  10,
  10,
  5,
  0,
  0,
  0,
  0,
  5,
  10,
  10,
  5,
  0,
  0,
  0,
  0,
  5,
  10,
  10,
  5,
  0,
  0,
  0,
  0,
  5,
  10,
  10,
  5,
  0,
  0,
  25,
  25,
  25,
  25,
  25,
  25,
  25,
  25,
  0,
  0,
  5,
  10,
  10,
  5,
  0,
  0,
];

// Evaluate the current position then return the score.
function evaluatePosition(): number {
  // Score is the value of white pieces in play minus the value of black pieces in play.
  let score =
    chessBoard.material[COLOURS.WHITE] - chessBoard.material[COLOURS.BLACK];

  let piece: number, square: number;

  // White Pawn
  piece = PIECES.wP;
  for (let pieceNum = 0; pieceNum < chessBoard.pieceNumber[piece]; pieceNum++) {
    square = chessBoard.pieceList[getPieceIndex(piece, pieceNum)];
    score += pawnTable[to64(square)];
  }

  // Black Pawn
  piece = PIECES.bP;
  for (let pieceNum = 0; pieceNum < chessBoard.pieceNumber[piece]; pieceNum++) {
    square = chessBoard.pieceList[getPieceIndex(piece, pieceNum)];
    score -= pawnTable[getMirror64(to64(square))];
  }

  // White Knight
  piece = PIECES.wK;
  for (let pieceNum = 0; pieceNum < chessBoard.pieceNumber[piece]; pieceNum++) {
    square = chessBoard.pieceList[getPieceIndex(piece, pieceNum)];
    score += knightTable[to64(square)];
  }

  // Black Knight
  piece = PIECES.bK;
  for (let pieceNum = 0; pieceNum < chessBoard.pieceNumber[piece]; pieceNum++) {
    square = chessBoard.pieceList[getPieceIndex(piece, pieceNum)];
    score -= knightTable[getMirror64(to64(square))];
  }

  // White Bishop
  piece = PIECES.wB;
  for (let pieceNum = 0; pieceNum < chessBoard.pieceNumber[piece]; pieceNum++) {
    square = chessBoard.pieceList[getPieceIndex(piece, pieceNum)];
    score += bishopTable[to64(square)];
  }

  // Black Bishop
  piece = PIECES.bB;
  for (let pieceNum = 0; pieceNum < chessBoard.pieceNumber[piece]; pieceNum++) {
    square = chessBoard.pieceList[getPieceIndex(piece, pieceNum)];
    score -= bishopTable[getMirror64(to64(square))];
  }

  // White Rook
  piece = PIECES.wR;
  for (let pieceNum = 0; pieceNum < chessBoard.pieceNumber[piece]; pieceNum++) {
    square = chessBoard.pieceList[getPieceIndex(piece, pieceNum)];
    score += rookTable[to64(square)];
  }

  // Black Rook
  piece = PIECES.bR;
  for (let pieceNum = 0; pieceNum < chessBoard.pieceNumber[piece]; pieceNum++) {
    square = chessBoard.pieceList[getPieceIndex(piece, pieceNum)];
    score -= rookTable[getMirror64(to64(square))];
  }

  // White Queen
  piece = PIECES.wQ;
  for (let pieceNum = 0; pieceNum < chessBoard.pieceNumber[piece]; pieceNum++) {
    square = chessBoard.pieceList[getPieceIndex(piece, pieceNum)];
    score += rookTable[to64(square)] / 2;
  }

  // Black Queen
  piece = PIECES.bQ;
  for (let pieceNum = 0; pieceNum < chessBoard.pieceNumber[piece]; pieceNum++) {
    square = chessBoard.pieceList[getPieceIndex(piece, pieceNum)];
    score -= rookTable[getMirror64(to64(square))] / 2;
  }

  // Return the score for White or Black.
  if (chessBoard.side === COLOURS.WHITE) {
    return score;
  } else {
    return -score;
  }
}
