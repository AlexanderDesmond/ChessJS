function submitFen(): void {
  let fen = (<HTMLInputElement>document.getElementById("fen-text")).value;
  newGame(fen);
}

// Clear all pieces from board.
function clearPieces(): void {
  let pieces = document.getElementsByClassName("piece");
  while (pieces.length > 0) {
    pieces[0].parentNode?.removeChild(pieces[0]);
  }
}

// Set board pieces.
function setupPieces(): void {
  let sq120: number, piece: number, file: number, rank: number;

  // Clear all pieces.
  clearPieces();

  // Loop through board squares.
  for (let sq = 0; sq < 64; sq++) {
    // Get square converted to 120 grid.
    sq120 = to120(sq);
    // Get piece.
    piece = chessBoard.pieces[sq120];

    if (piece >= PIECES.wP && piece <= PIECES.bK) {
      addBoardPiece(sq120, piece);
    }
    /*
    // Get file and rank.
    file = files[sq120];
    rank = ranks[sq120];

    // For every piece.
    if (piece >= PIECES.wP && piece <= PIECES.bK) {
      // Set up file and rank names.
      let fileName: string = "file" + "-" + (file + 1);
      let rankName: string = "rank" + "-" + (rank + 1);

      // Set up piece file name
      let pieceFileName: string =
        "images/chess-pieces/" +
        sideChar[pieceColour[piece]] +
        pieceChar[piece].toUpperCase() +
        ".png";

      // Create new image node.
      let node = document.createElement("img");
      // Add piece class to new image node.
      node.classList.add("piece", rankName, fileName);
      // Set src attribute of new image node.
      node.setAttribute("src", pieceFileName);
      // Add new image node to board div.
      document.getElementsByClassName("board")[0].appendChild(node);
    }
    */
  }
}

function newGame(fen: string): void {
  // Parse FEN
  parseFen(fen);
  printBoard();

  setupPieces();
  checkGameStatus();
}

// Select a square.
function selectSquare(x: number, y: number): number {
  // Get position of chessboard.
  const board = document.querySelector(".board") as HTMLElement;
  const boardPosition = {
    top: Math.floor(board.offsetTop),
    left: Math.floor(board.offsetLeft),
  };

  // Get File
  const file = Math.floor((Math.floor(x) - boardPosition.left) / 60);
  // Get Rank
  const rank = 7 - Math.floor((Math.floor(y) - boardPosition.top) / 60);

  // Get Square
  const square = getSquare(file, rank);

  // Highlight the selected square.
  highlightSquare(square);

  console.log("Selected Square: ", squareToString(square));

  return square;
}

// Highlight the given square.
function highlightSquare(square: number): void {
  const squares = document.getElementsByClassName("square");
  const squaresArr = Array.from(squares) as HTMLElement[];

  squaresArr.forEach((sq) => {
    if (isSquare(square, sq.offsetTop, sq.offsetLeft)) {
      sq.classList.add("selected");
    }

    /*
    if (
      ranks[square] === 7 - Math.round(sq.offsetTop / 60) &&
      files[square] === Math.round(sq.offsetLeft / 60)
    ) {
      sq.classList.add("selected");
    }
    */
  });
}

// Deselect square.
function deselectSquare(square: number): void {
  const squares = document.getElementsByClassName("square");
  const squaresArr = Array.from(squares) as HTMLElement[];

  squaresArr.forEach((sq) => {
    if (isSquare(square, sq.offsetTop, sq.offsetLeft)) {
      sq.classList.remove("selected");
    }

    /*
    if (
      ranks[square] === 7 - Math.round(sq.offsetTop / 60) &&
      files[square] === Math.round(sq.offsetLeft / 60)
    ) {
      sq.classList.remove("selected");
    }
    */
  });
}

function makeUserMove(): void {
  if (
    userMove.origin !== SQUARES.NO_SQUARE &&
    userMove.destination !== SQUARES.NO_SQUARE
  ) {
    console.log(
      "User Move: " +
        moveToString(userMove.origin) +
        moveToString(userMove.destination)
    );

    let parsedMove: number = parseMove(userMove.origin, userMove.destination);
    if (parsedMove !== NO_MOVE) {
      makeMove(parsedMove);
      printBoard(); // temp print to console.

      moveBoardPiece(parsedMove);
      checkGameStatus();
    }

    // Deselect squares
    deselectSquare(userMove.origin);
    deselectSquare(userMove.destination);

    // Reset userMove properties for next move.
    userMove.origin = SQUARES.NO_SQUARE;
    userMove.destination = SQUARES.NO_SQUARE;
  }
}

// Returns true if a square was clicked, returns false otherwise.
function isSquare(square: number, top: number, left: number): boolean {
  if (
    ranks[square] === 7 - Math.round(top / 60) &&
    files[square] === Math.round(left / 60)
  ) {
    return true;
  }

  return false;
}

// Add piece to board.
function addBoardPiece(square: number, piece: number): void {
  // Set up files and rank names.
  const file: number = files[square],
    rank: number = ranks[square],
    fileName: string = "file" + "-" + (file + 1),
    rankName: string = "rank" + "-" + (rank + 1);

  // Set up piece file name
  const pieceFileName: string =
    "images/chess-pieces/" +
    sideChar[pieceColour[piece]] +
    pieceChar[piece].toUpperCase() +
    ".png";

  // Create new image node.
  let node = document.createElement("img");
  // Add piece class to new image node.
  node.classList.add("piece", rankName, fileName);
  // Set src attribute of new image node.
  node.setAttribute("src", pieceFileName);
  // Add new image node to board div.
  document.getElementsByClassName("board")[0].appendChild(node);

  onSquareClick(); // just here for testing
  onPieceClick();
}

// Remove piece fom board.
function removeBoardPiece(square: number): void {
  const pieces = document.getElementsByClassName("piece");
  const piecesArr = Array.from(pieces) as HTMLElement[];

  piecesArr.forEach((pc) => {
    if (isSquare(square, pc.offsetTop, pc.offsetLeft)) {
      pc.remove();
    }
  });
}

// Move piece on the board.
function moveBoardPiece(move: number): void {
  // Get origin and destination squares for move.
  const origin: number = getOriginSquare(move);
  const destination: number = getDestinationSquare(move);

  // If move is an En Passant capture
  if (move & EP_FLAG) {
    let removeEP: number = PIECES.EMPTY;

    if (chessBoard.side === COLOURS.BLACK) {
      removeEP = destination - 10;
    } else if (chessBoard.side === COLOURS.WHITE) {
      removeEP = destination + 10;
    }

    removeBoardPiece(removeEP);
  }
  // If move is a capture
  else if (getCapturedPiece(move)) {
    removeBoardPiece(destination);
  }

  // Set up files and rank names.
  const file: number = files[destination],
    rank: number = ranks[destination],
    fileName: string = "file" + "-" + (file + 1),
    rankName: string = "rank" + "-" + (rank + 1);

  // Refresh CSS classes
  const pieces = document.getElementsByClassName("piece");
  const piecesArr = Array.from(pieces) as HTMLElement[];
  piecesArr.forEach((pc) => {
    if (isSquare(origin, pc.offsetTop, pc.offsetLeft)) {
      // Remove CSS classes.
      pc.classList.remove(...pc.classList);
      // Add CSS classes
      pc.classList.add("piece", rankName, fileName);
    }
  });

  // Handle Castling moves
  if (move & CASTLE_FLAG) {
    switch (destination) {
      case SQUARES.G1:
        removeBoardPiece(SQUARES.H1);
        addBoardPiece(SQUARES.F1, PIECES.wR);
        break;
      case SQUARES.C1:
        removeBoardPiece(SQUARES.A1);
        addBoardPiece(SQUARES.D1, PIECES.wR);
        break;
      case SQUARES.G8:
        removeBoardPiece(SQUARES.H8);
        addBoardPiece(SQUARES.F8, PIECES.bR);
        break;
      case SQUARES.C8:
        removeBoardPiece(SQUARES.A8);
        addBoardPiece(SQUARES.D8, PIECES.bR);
        break;
      default:
        console.log("ERROR: Error with Castling!");
        break;
    }
  }
  // Handle Promotion moves
  else if (getPromotedPiece(move)) {
    removeBoardPiece(destination);
    addBoardPiece(destination, getPromotedPiece(move));
  }
}

// Return true if there is a draw, return false otherwise.
function isDraw(): boolean {
  // If there are Pawns on the board, no draw.
  if (
    chessBoard.pieceNumber[PIECES.wP] !== 0 ||
    chessBoard.pieceNumber[PIECES.bP] !== 0
  ) {
    return false;
  }
  //If there are Queens or Rooks on the board, no draw,
  if (
    chessBoard.pieceNumber[PIECES.wQ] !== 0 ||
    chessBoard.pieceNumber[PIECES.bQ] !== 0 ||
    chessBoard.pieceNumber[PIECES.wR] !== 0 ||
    chessBoard.pieceNumber[PIECES.bR] !== 0
  ) {
    return false;
  }
  // If a side has more than one Bishop, no draw.
  if (
    chessBoard.pieceNumber[PIECES.wB] > 1 ||
    chessBoard.pieceNumber[PIECES.bB] > 1
  ) {
    return false;
  }
  // If a side has more than one Knight, no draw.
  if (
    chessBoard.pieceNumber[PIECES.wN] > 1 ||
    chessBoard.pieceNumber[PIECES.bN] > 1
  ) {
    return false;
  }
  // If White has a Bishop and a Knight, no draw.
  if (
    chessBoard.pieceNumber[PIECES.wB] !== 0 ||
    chessBoard.pieceNumber[PIECES.wN] !== 0
  ) {
    return false;
  }
  // If Black has a Bishop and a Knight, no draw.
  if (
    chessBoard.pieceNumber[PIECES.bB] !== 0 ||
    chessBoard.pieceNumber[PIECES.bN] !== 0
  ) {
    return false;
  }

  return true;
}

// Return how many times this position has occurred.
function getRepetitions(): number {
  let repetition: number = 0;

  for (let i = 0; i < chessBoard.plyHistory; i++) {
    if (chessBoard.history[i].boardState === chessBoard.boardState) {
      repetition++;
    }
  }

  return repetition;
}

function checkResult(): boolean {
  // Fifty Move Rule
  if (chessBoard.fiftyMoveRule >= 100) {
    document.getElementsByClassName("game-status")[0].innerHTML =
      "GAME DRAWN {Fifty Move Rule}";

    return true;
  }

  // Threefold Repetition
  if (getRepetitions() >= 2) {
    document.getElementsByClassName("game-status")[0].innerHTML =
      "GAME DRAWN {Threefold Repetition}";

    return true;
  }

  // Insufficient Material
  if (isDraw()) {
    document.getElementsByClassName("game-status")[0].innerHTML =
      "GAME DRAWN {Insufficient Material}";

    return true;
  }

  // Search for legal moves.
  generateMoves(false);
  let found: number = 0;
  for (
    let i = chessBoard.moveListStart[chessBoard.plyCount];
    i < chessBoard.moveListStart[chessBoard.plyCount + 1];
    i++
  ) {
    if (!makeMove(chessBoard.moveList[i])) {
      continue;
    }

    found++;
    revertMove();
    break;
  }
  // If there is at least one legal move available, it cannot be a draw.
  if (found !== 0) return false;

  // Search for checkmate and stalemate.
  let inCheck = isSquareUnderAttack(
    chessBoard.pieceList[getPieceIndex(KINGS[chessBoard.side], 0)],
    chessBoard.side ^ 1
  );
  if (inCheck) {
    if (chessBoard.side === COLOURS.WHITE) {
      document.getElementsByClassName("game-status")[0].innerHTML =
        "GAME OVER {Black Checkmates}";

      return true;
    } else if (chessBoard.side === COLOURS.BLACK) {
      document.getElementsByClassName("game-status")[0].innerHTML =
        "GAME OVER {White Checkmates}";

      return true;
    }
  } else {
    document.getElementsByClassName("game-status")[0].innerHTML =
      "GAME DRAWN {Stalemate}";

    return true;
  }

  return false;
}

// Check the status of the game.
function checkGameStatus(): void {
  if (checkResult()) {
    gameController.gameOver = true;
  } else {
    gameController.gameOver = false;

    document.getElementsByClassName("game-status")[0].innerHTML = "";
  }
}

// Make sure the DOM is loaded first.
document.addEventListener("DOMContentLoaded", () => {
  // Make sure all HTML elements are loaded first.

  onSquareClick();
  onPieceClick();
});

// Handle square click.
function onSquareClick(): void {
  const elements = document.getElementsByClassName("square");
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", (e: Event) => {
      console.log("Square clicked!");
      const mouseEvent = <MouseEvent>e;

      if (userMove.origin !== SQUARES.NO_SQUARE) {
        userMove.destination = selectSquare(mouseEvent.pageX, mouseEvent.pageY);
        makeUserMove();
      }
    });
  }
}

// Handle piece click.
function onPieceClick(): void {
  const elements = document.getElementsByClassName("piece");
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", (e: Event) => {
      console.log("Piece clicked!");
      const mouseEvent = <MouseEvent>e;

      if (userMove.origin === SQUARES.NO_SQUARE) {
        userMove.origin = selectSquare(mouseEvent.pageX, mouseEvent.pageY);
      } else {
        userMove.destination = selectSquare(mouseEvent.pageX, mouseEvent.pageY);
      }

      makeUserMove();
    });
  }
}
