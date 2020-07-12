function submitFen(): void {
  let fenStr = (<HTMLInputElement>document.getElementById("fen-text")).value;
  console.log(fenStr);
  parseFen(fenStr);
  printBoard();

  searchPosition();
  //startPerfTest(5);
}

// Set board pieces.
function setupPieces(): void {
  let sq120: number, piece: number, file: number, rank: number;

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
      let fileName: string = "file" + (file + 1);
      let rankName: string = "rank" + (rank + 1);

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
