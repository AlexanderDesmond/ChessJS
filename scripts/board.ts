// Chess board
let chessBoard = <any>{};

// Array for holding piece status on board.
chessBoard.pieces = new Array(NUM_OF_SQUARES);
// Side whose turn it is.
chessBoard.side = COLOURS.WHITE;
// Fifty-move rule
chessBoard.fiftyMoveRule = 0;
// Count of every move made in the game.
chessBoard.moveCount = 0;
// Count of moves in the Search Tree - relevant to undoing and redoing moves
chessBoard.moves = 0;
/* 
    Castling permissions

    0001 (1) - White can castle king-side
    0010 (2) - White can castle queen-side
    0100 (4) - Black can castle king-side
    1000 (8) - Black can castle queen-side
*/
chessBoard.castlingPermissions = 0;
