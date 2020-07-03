function submitFen(): void {
  let fenStr = (<HTMLInputElement>document.getElementById("fen-text")).value;
  console.log(fenStr);
  parseFen(fenStr);
  printBoard();

  startPerfTest(5);
}
