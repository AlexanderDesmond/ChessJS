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
  }
}

function newGame(fen: string): void {
  // Parse FEN
  parseFen(fen);
  printBoard();

  setupPieces();
}

// Select a square.
function selectSquare(x: number, y: number): void {
  console.log("Clicked! At: " + x + ", " + y);
}

// Make sure the DOM is loaded first.
document.addEventListener("DOMContentLoaded", () => {
  // Handle square click.
  let elements = document.getElementsByClassName("square");
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", (e: Event) => {
      console.log("Square clicked!");
      const mouseEvent = <MouseEvent>e;
      selectSquare(mouseEvent.pageX, mouseEvent.pageY);
    });
  }

  // Handle piece click.
  elements = document.getElementsByClassName("piece");
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", (e: Event) => {
      console.log("Piece clicked!");
      const mouseEvent = <MouseEvent>e;
      selectSquare(mouseEvent.pageX, mouseEvent.pageY);
    });
  }
});
