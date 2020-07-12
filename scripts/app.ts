init();

parseFen(START_FEN);
printBoard();

function init(): void {
  rankAndFilesInit();
  boardStateInit();
  gridConversionInit();
  boardVariablesInit();
  mvvLvaInit();
  boardSquaresInit();
}

function rankAndFilesInit(): void {
  let index = 0;
  //let file = FILES.FILE_A;
  //let rank = RANKS.RANK_1;
  let sq = SQUARES.A1;
  let sq64 = 0;

  // Clear the entire board by setting all 120 squars as 'OFFBOARD.
  for (let i = index; i < NUM_OF_SQUARES; i++) {
    files[i] = SQUARES.OFFBOARD;
    ranks[i] = SQUARES.OFFBOARD;
  }

  // Set up the 64 square chess board.
  for (let rank = RANKS.RANK_1; rank <= RANKS.RANK_8; rank++) {
    for (let file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
      sq = getSquare(file, rank);
      files[sq] = file;
      ranks[sq] = rank;
    }
  }

  //console.log("Files:" + files + ", " + "Ranks: " + ranks);
}

// Generate constituent parts of boardState UID.
function boardStateInit(): void {
  // Generate keys for pieces.
  for (let i = 0; i < 14 * 120; i++) {
    pieceKeys[i] = generateRandomNumber();
  }

  // Key for side already generated in definitions.ts.

  // Generate keys for castling states.
  for (let i = 0; i < 16; i++) {
    castlingKeys[i] = generateRandomNumber();
  }
}

function gridConversionInit(): void {
  //let file = FILES.FILE_A;
  //let rank = RANKS.RANK_1
  let sq = SQUARES.A1;
  let sq64 = 0;

  // Reset values in arrays to invalid values.
  for (let i = 0; i < NUM_OF_SQUARES; i++) {
    _120To64[i] = 65;
  }
  for (let i = 0; i < 64; i++) {
    _64To120[i] = 120;
  }

  // Fill arrays with correct values for converting between 64 and 120 grids.
  for (let rank = RANKS.RANK_1; rank <= RANKS.RANK_8; rank++) {
    for (let file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
      sq = getSquare(file, rank);
      _64To120[sq64] = sq;
      _120To64[sq] = sq64;
      sq64++;
    }
  }
}

// Initialise board variables.
function boardVariablesInit(): void {
  // Initialise history
  for (let i = 0; i < MAX_GAME_MOVES; i++) {
    chessBoard.history.push({
      move: NO_MOVE,
      castling: 0,
      enPassant: 0,
      fiftyMoveRule: 0,
      boardState: 0,
    });
  }

  // Initialise PV table
  for (let i = 0; i < PV_ENTRIES; i++) {
    chessBoard.pvTable.push({
      move: NO_MOVE,
      boardState: 0,
    });
  }
}

// Initialise board squares.
function boardSquaresInit(): void {
  let isLight: boolean = false;
  let rankName: string, fileName: string, lightStr: string;

  for (let rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
    // Flip isLight value
    isLight = !isLight;

    // Set up rankName
    rankName = "rank" + "-" + (rank + 1);
    for (let file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
      // Set up fileName
      fileName = "file" + "-" + (file + 1);

      // Set lightString value
      if (isLight) lightStr = "light";
      else lightStr = "dark";

      // Flip isLight value
      isLight = !isLight;

      // Create new div node.
      let node = document.createElement("div");
      // Add classes to new div node.
      node.classList.add("square", rankName, fileName, lightStr);
      // Add new div node to board div.
      document.getElementsByClassName("board")[0].appendChild(node);
    }
  }
}
