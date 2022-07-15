import { PieceDetector } from "./piece-detector";

export interface NextPiecesCanvasState {
  nextPieceTypes: string[],
}

export class NextPiecesCanvas {
  public static capture(): NextPiecesCanvasState | undefined {
    const blocks = this.captureBlocks();
    if (!blocks) return;
    return this.processBlocks(blocks);
  }

  private static processBlocks(blocks: number[][]) {
    const width = blocks[0]?.length || 0;
    const height = blocks.length;

    const nextPieceTypes = [];
    for (let i = 0; i < Math.floor(height / 3); i++) {
      const positions = [];
      for (let y = i * 3; y < (i + 1) * 3; y++) {
        for (let x = 0; x < width; x++) {
          if (blocks[y] && blocks[y][x] === 1) {
            positions.push({x, y});
          }
        }
      }
      const piece = PieceDetector.detect(positions);
      if (!piece) continue;
      nextPieceTypes.push(piece.type);
    }

    return { nextPieceTypes };
  }

  private static captureBlocks() {
    const canvas = document.getElementById('queueCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const {width: canvasWidth, height: canvasHeight} = canvas;
    const boardWidth = 4, boardHeight = 15;
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
    return blocks;
  }
}
