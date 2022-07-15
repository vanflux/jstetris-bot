import { posesMinX, posesMinY } from "../functions";
import { PieceDetector } from "./piece-detector";

export interface GameCanvasState {
  width: number;
  height: number;
  blocks: number[][];
  fallingPiece?: {positions: {x: number, y: number}[], type: string, rotation: number, x: number, y: number};
}

export class GameCanvas {
  public static capture(): GameCanvasState | undefined {
    const { blocks, width, height } = this.captureBlocks();
    if (!blocks) return;
    const processed = this.processBlocks(blocks);
    return {
      width,
      height,
      blocks: processed.blocks,
      fallingPiece: processed.fallingPiece,
    };
  }

  private static processBlocks(blocks: number[][]) {
    const width = blocks[0]?.length || 0;
    const height = blocks.length;
    const already = new Set();

    const hashPos = (x: number, y: number) => {
      return y * width + x;
    }

    const floodFill = (x: number, y: number, positions: {x: number, y: number}[]=[]) => {
      if (y < 0 || x < 0 || y >= height || x >= width) return positions;
      const hash = hashPos(x, y);
      if (already.has(hash)) return positions;
      already.add(hash);
      if (blocks[y][x] === 0) return positions;
      positions.push({x, y});
      floodFill(x, y + 1, positions);
      floodFill(x, y - 1, positions);
      floodFill(x + 1, y, positions);
      floodFill(x - 1, y, positions);
      return positions;
    };

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const found = floodFill(x, y);
        if (found.length == 4) {
          for (const position of found) {
            blocks[position.y][position.x] = 0;
          }
          const piece = PieceDetector.detect(found);
          if (!piece) continue;
          const minX = posesMinX(found);
          const minY = posesMinY(found);
          return {
            fallingPiece: { positions: found, x: minX, y: minY, ...piece },
            blocks,
          }
        }
      }
    }

    return {
      fallingPiece: undefined,
      blocks,
    };
  }

  private static captureBlocks() {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return {};
    const {width: canvasWidth, height: canvasHeight} = canvas;
    const boardWidth = 10, boardHeight = 20;
    const blockSizeX = canvasWidth / boardWidth;
    const blockSizeY = canvasHeight / boardHeight;
    const {data} = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const blocks = new Array(boardHeight).fill(undefined).map(_ => new Array(boardWidth).fill(0));
    for (let y = 0; y < boardHeight; y++) {
      for (let x = 0; x < boardWidth; x++) {
        const yOffset = Math.floor((y + 0.5) * boardWidth * blockSizeX * blockSizeY) * 4;
        const xOffset = Math.floor((x + 0.5) * blockSizeY) * 4;
        const index = yOffset + xOffset;
        const [r, g, b, a] = data.slice(index, index + 4);
        if (a === 255 && (r > 0 || g > 0 || b > 0)) {
          blocks[y][x] = 1;
        }
      }
    }
    return { blocks, width: boardWidth, height: boardHeight };
  }
}
