import { pieces, Position } from "tetris-bot";
import { comparePositions, normalizePositions } from "../functions";

export type PieceDetectorResult = {
  success: false;
  type?: undefined;
  rotation?: undefined;
} | {
  success: true;
  type: string;
  rotation: number;
}

export class PieceDetector {
  public static detect(positions: Position[]): PieceDetectorResult {
    if (positions.length !== 4) return { success: false };
    const normalizedPos = normalizePositions(positions);
    for (const piece of pieces) {
      for (let rotation = 0; rotation < piece.rotations.length; rotation++) {
        const pieceNormalizedPos = normalizePositions(
          piece.rotations[rotation].positions
        );
        if (comparePositions(normalizedPos, pieceNormalizedPos)) {
          return { success: true, type: piece.type, rotation };
        }
      }
    }
    return { success: false };
  }
}
