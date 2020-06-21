init();

function init(): void {
  rankAndFilesInit();
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

  console.log("Files:" + files + ", " + "Ranks: " + ranks);
}

// Generate constituent parts of boardState UID.
function boardStateInit(): void {
  // Generate keys for pieces.
  for (let i = 0; i < 14 * 120; i++) {
    pieceKey[i] = generateRandomNumber();
  }

  // Key for side already generated in definitions.ts.

  // Generate keys for castling states.
  for (let i = 0; i < 16; i++) {
    castlingKey[i] = generateRandomNumber();
  }
}
