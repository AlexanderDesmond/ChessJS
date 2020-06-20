// Chess board
let chessBoard = <any>{};

// Array for storing piece status on board.
chessBoard.pieces = new Array(NUM_OF_SQUARES);
// Array for storing number of each piece in play.
chessBoard.pieceNumber = new Array(13);
//
chessBoard.pieceList = new Array(14 * 10);
// Side whose turn it is.
chessBoard.side = COLOURS.WHITE;
// Colour of chess pieces.
chessBoard.material = new Array(2);
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
