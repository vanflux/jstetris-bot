import { pieces } from "tetris-bot";
import { comparePositions, normalizePositions } from "../functions";

export class PieceDetector {
  public static detect(positions: { x: number; y: number }[]) {
    if (positions.length !== 4) return;
    const normalizedPos = normalizePositions(positions);
    for (const piece of pieces) {
      for (let rotation = 0; rotation < piece.rotations.length; rotation++) {
        const pieceNormalizedPos = normalizePositions(
          piece.rotations[rotation].positions
        );
        if (comparePositions(normalizedPos, pieceNormalizedPos)) {
          return { type: piece.type, rotation };
        }
      }
    }
    return;
  }
}
