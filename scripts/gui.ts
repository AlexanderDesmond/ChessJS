function submitFen(): void {
  let fenStr = (<HTMLInputElement>document.getElementById("fen-text")).value;
  console.log(fenStr);
  parseFen(fenStr);
  printBoard();

  searchPosition();
  //startPerfTest(5);
}
