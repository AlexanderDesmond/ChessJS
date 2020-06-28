// Generate move data.
function generateMove(
  origin: number,
  destination: number,
  captured: number,
  promoted: number,
  flag: number
): number {
  return (
    origin | (destination << 7) | (captured << 14) | (promoted << 20) | flag
  );
}
