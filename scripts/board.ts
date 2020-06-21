// Chess board
let chessBoard = <any>{};

// Array for storing piece status on board.
chessBoard.pieces = [];
// Array for storing number of each piece in play.
chessBoard.pieceNumber = [];
//
chessBoard.pieceList = [];
// Side whose turn it is.
chessBoard.side = COLOURS.WHITE;
// Colour of chess pieces.
chessBoard.material = [];
// Fifty-move rule
chessBoard.fiftyMoveRule = 0;
// Count of every move made in the game.
chessBoard.moveCount = 0;
// Count of moves in the Search Tree - relevant to undoing and redoing moves
chessBoard.moves = 0;
/* 
    Castling
    --------------------
    0001 (1) - White can castle king-side
    0010 (2) - White can castle queen-side
    0100 (4) - Black can castle king-side
    1000 (8) - Black can castle queen-side
*/
chessBoard.castling = 0;
// En passant
chessBoard.enPassant = 0;
// Unique identifier to represent board state.
chessBoard.boardState = 0;

// Return piece index.
function getPieceIndex(piece: number, pieceNum: number): number {
  return piece * 10 + pieceNum;
}

// Generate boardState UID.
function generateBoardState(): number {
  let piece: number = PIECES.EMPTY;
  let key: number = 0;

  // For every square on the board.
  for (let square = 0; square < NUM_OF_SQUARES; square++) {
    piece = chessBoard.pieces[square];

    // If the square has a piece on it and the square is on the chess board.
    if (piece !== PIECES.EMPTY && piece !== SQUARES.OFFBOARD) {
      // XOR the key with the piece key.
      key ^= pieceKeys[piece * 120 + square];
    }
  }

  // If it is White's turn
  if (chessBoard.side === COLOURS.WHITE) {
    // XOR key with the sideKey
    key ^= sideKey;
  }

  // If it is an en passant square.
  if (chessBoard.enPassant !== SQUARES.NO_SQUARE) {
    // XOR key with the piece key.
    key ^= pieceKeys[chessBoard.enPassant];
  }

  // XOR key with the castling key.
  key ^= castlingKeys[chessBoard.castling];

  return key;
}
