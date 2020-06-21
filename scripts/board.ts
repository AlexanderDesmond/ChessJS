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
// Count of every half-move made in the game.
chessBoard.plyCount = 0;
// Count of half-moves in the Search Tree - relevant to undoing and redoing moves
chessBoard.plyHistory = 0;
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

// List of moves in the game
chessBoard.moveList = []; // Length: 64 * 256
// List of scores for each move
chessBoard.moveScores = []; // Length: 64 * 256
// Where the moveList will start
chessBoard.moveListStart = []; // Length: 64

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

// Handle the parsing of the FEN code.
function parseFen(fen: string) {
  resetBoard();

  let rank = RANKS.RANK_8;
  let file = FILES.FILE_A;
  let fenIndex = 0;
  let count = 0;
  let piece = 0;
  let square = 0;

  while (rank >= RANKS.RANK_1 && fenIndex < fen.length) {
    count = 1;

    switch (fen[fenIndex]) {
      // Handle pieces.
      case "p":
        piece = PIECES.bP;
        break;
      case "r":
        piece = PIECES.bR;
        break;
      case "n":
        piece = PIECES.bN;
        break;
      case "b":
        piece = PIECES.bB;
        break;
      case "k":
        piece = PIECES.bK;
        break;
      case "q":
        piece = PIECES.bQ;
        break;
      case "P":
        piece = PIECES.wP;
        break;
      case "R":
        piece = PIECES.wR;
        break;
      case "N":
        piece = PIECES.wN;
        break;
      case "B":
        piece = PIECES.wB;
        break;
      case "K":
        piece = PIECES.wK;
        break;
      case "Q":
        piece = PIECES.wQ;
        break;
      // Handle empty squares.
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
        piece = PIECES.EMPTY;
        count = Number(fen[fenIndex]);
        break;
      // Go to next row/rank.
      case "/":
      case " ":
        rank--;
        file = FILES.FILE_A;
        fenIndex++;
        continue;

      default:
        console.log("Error with FEN");
        return;
    }

    // Go through columns/files and set pieces.
    for (let i = 0; i < count; i++) {
      square = getSquare(file, rank);
      chessBoard.pieces[square] = piece;
      file++;
    }
    fenIndex++;
  }
}

// Reset the board.
function resetBoard(): void {
  // Clear entire board.
  for (let i = 0; i < NUM_OF_SQUARES; i++) {
    chessBoard.pieces[i] = SQUARES.OFFBOARD;
  }

  // Set the squares of the 64 grid actual chess board as empty.
  for (let i = 0; i < 64; i++) {
    chessBoard.pieces[to120(i)] = PIECES.EMPTY;
  }

  // Set the pieces in the pieceList to EMPTY.
  for (let i = 0; i < 14 * 10; i++) {
    chessBoard.pieceList[i] = PIECES.EMPTY;
  }

  // Set the material of the pieces to 0.
  for (let i = 0; i < 2; i++) {
    chessBoard.material[i] = 0;
  }

  // Set the type of the pieces to 0.
  for (let i = 0; i < 13; i++) {
    chessBoard.pieceNumber[i] = 0;
  }

  // Reset other properties.
  chessBoard.side = COLOURS.BOTH;
  chessBoard.fiftyMoveRule = 0;
  chessBoard.plyCount = 0;
  chessBoard.plyHistory = 0;
  chessBoard.castling = 0;
  chessBoard.enPassant = SQUARES.NO_SQUARE;
  chessBoard.boardState = 0;
  chessBoard.moveListStart[chessBoard.plyCount] = 0;
}
