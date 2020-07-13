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

// Make sure the DOM is loaded first.
document.addEventListener("DOMContentLoaded", () => {
  // Handle square click.
  let elements = document.getElementsByClassName("square");
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", (e: Event) => {
      console.log("Square clicked!");
      const mouseEvent = <MouseEvent>e;

      if (userMove.origin !== SQUARES.NO_SQUARE) {
        userMove.destination = selectSquare(mouseEvent.pageX, mouseEvent.pageY);
        makeUserMove();
      }

      //selectSquare(mouseEvent.pageX, mouseEvent.pageY);
    });
  }

  // Handle piece click.
  elements = document.getElementsByClassName("piece");
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

      //selectSquare(mouseEvent.pageX, mouseEvent.pageY);
    });
  }
});
