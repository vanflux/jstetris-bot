import { PieceInfo, pieces, Position } from "tetris-bot";
import { posesMinX, posesMinY } from "../functions";
import { PieceDetector } from "./piece-detector";

export interface GameCanvasFallingPiece {
  piece: PieceInfo;
  x: number;
  y: number;
  rotation: number;
  positions: Position[];
}

export type GameCanvasState = {
  success: false;
  board?: undefined;
  fallingPiece?: undefined;
  empty?: undefined;
} | {
  success: true;
  board: number[][];
  fallingPiece?: GameCanvasFallingPiece;
  empty: boolean;
}

export class GameCanvas {
  public static capture(): GameCanvasState {
    const board = this.captureBoard();
    if (!board) return { success: false };
    return this.processBlocks(board);
  }

  public static moveLeft() {
    this.sendKeyClick(37);
  }

  public static moveRight() {
    this.sendKeyClick(39);
  }

  public static moveDown() {
    this.sendKeyClick(32);
  }

  public static rotate() {
    this.sendKeyClick(38);
  }

  private static sendKeyEvent(type: string, keyCode: number) {        
    const keyboardEvent = document.createEvent('KeyboardEvent');
    const initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? 'initKeyboardEvent' : 'initKeyEvent';
    // @ts-ignore
    keyboardEvent[initMethod](type, true, true, window, false, false, false, false, 0, 0);
    Object.defineProperty(keyboardEvent, "keyCode", { get: () => keyCode });
    document.dispatchEvent(keyboardEvent);
  }
  
  private static sendKeyClick(keyCode: number) {
    this.sendKeyEvent('keydown', keyCode);
    this.sendKeyEvent('keyup', keyCode);
  }

  private static processBlocks(board: number[][]): GameCanvasState {
    const width = board[0]?.length || 0;
    const height = board.length;
    const already = new Set();
    let empty = true;

    const hashPos = (x: number, y: number) => {
      return y * width + x;
    }

    const floodFill = (x: number, y: number, positions: {x: number, y: number}[]=[]) => {
      if (y < 0 || x < 0 || y >= height || x >= width) return positions;
      const hash = hashPos(x, y);
      if (already.has(hash)) return positions;
      already.add(hash);
      if (board[y][x] === 0) return positions;
      empty = false;
      positions.push({x, y});
      floodFill(x, y + 1, positions);
      floodFill(x, y - 1, positions);
      floodFill(x + 1, y, positions);
      floodFill(x - 1, y, positions);
      return positions;
    };

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const positions = floodFill(x, y);
        if (positions.length > 0 && positions.length <= 4) {
          for (const position of positions) {
            board[position.y][position.x] = 0;
          }
          const { success, type, rotation } = PieceDetector.detect(positions);
          if (!success) continue;
          const piece = pieces.find(piece => piece.type === type);
          if (!piece) continue;
          const minX = posesMinX(positions);
          const minY = posesMinY(positions);
          return {
            success: true,
            board,
            fallingPiece: { piece, x: minX, y: minY, rotation, positions },
            empty,
          }
        }
      }
    }

    return {
      success: true,
      fallingPiece: undefined,
      board,
      empty,
    };
  }

  private static captureBoard() {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const {width: canvasWidth, height: canvasHeight} = canvas;
    const boardWidth = 10, boardHeight = 20;
    const blockSizeX = canvasWidth / boardWidth;
    const blockSizeY = canvasHeight / boardHeight;
    const {data} = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const board = new Array(boardHeight).fill(undefined).map(_ => new Array(boardWidth).fill(0));
    for (let y = 0; y < boardHeight; y++) {
      for (let x = 0; x < boardWidth; x++) {
        const yOffset = Math.floor((y + 0.5) * boardWidth * blockSizeX * blockSizeY) * 4;
        const xOffset = Math.floor((x + 0.5) * blockSizeY) * 4;
        const index = yOffset + xOffset;
        const [r, g, b, a] = data.slice(index, index + 4);
        if (a === 255 && (r > 0 || g > 0 || b > 0)) {
          board[y][x] = 1;
        }
      }
    }
    return board;
  }
}
