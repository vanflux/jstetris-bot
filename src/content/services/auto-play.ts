import EventEmitter from "events";
import { BasicBoardFitness, Board, BoardMoveCalculator, BoardStatistics, Bot, pieces, sleep } from "tetris-bot";
import { compareArrays, comparePositions, normalizePositions, posesMinX } from "../functions";
import { CustomDepthCalculator } from "./depth-calculators/custom-depth-calculator";
import { GameCanvas, GameCanvasFallingPiece } from "./game-canvas";
import { NextPiecesCanvas } from "./next-pieces-canvas";
import { PlayerList } from "./player-list";

export class AutoPlay {
  private static running = false;
  private static runId = 0;
  private static lastNextPieceTypes: string[] = [];
  private static eventEmitter = new EventEmitter();
  
  public static moveDelay = 60;
  public static rotationDelay = 120;
  public static piecesDelay = 100;

  public static start() {
    console.log('Auto play start request');
    if (this.running) return;
    this.runId++;
    this.running = true;
    this.loop();
  }

  public static stop() {
    console.log('Auto play stop request');
    if (!this.running) return;
    this.runId++;
    this.running = false;
  }

  public static getEventEmitter() {
    return this.eventEmitter;
  }

  public static isRunning() {
    return this.running;
  }

  private static async loop() {
    console.log('Auto play loop started ');
    const thisRunId = this.runId;
    while(this.runId === thisRunId) {
      await this.tick();
      await sleep(50);
    }
    console.log('Auto play loop stopped');
  }

  private static async tick() {
    const playerList = PlayerList.capture();
    if (playerList.length > 1) {
      alert('Sorry, only practice mode or games with 1 player are allowed to use auto-play module!');
      this.stop();
      return;
    }

    const { success: gameCaptureSuccess, board: boardMatriz, fallingPiece, empty } = GameCanvas.capture();
    if (!gameCaptureSuccess) {
      await sleep(500);
      return;
    }
    
    if (empty) {
      console.log('Bot reseted state');
      this.lastNextPieceTypes = [];
    }

    this.eventEmitter.emit('board_matriz_changed', boardMatriz);
    this.eventEmitter.emit('falling_piece_changed', fallingPiece);

    const { success: nextPiecesCaptureSuccess, nextPieceTypes } = NextPiecesCanvas.capture();
    if (!nextPiecesCaptureSuccess) {
      await sleep(500);
      return;
    }

    this.eventEmitter.emit('next_pieces_types_changed', nextPieceTypes);

    const nextPiecesChanged = !compareArrays(this.lastNextPieceTypes, nextPieceTypes);
    if (nextPiecesChanged) {
      const fallingType = this.lastNextPieceTypes.shift();
      this.eventEmitter.emit('falling_type_changed', fallingType);
      const fallingX = 3;
      if (fallingType !== undefined) {
        console.log('A', fallingType, 'started falling now');
        console.log('Next pieces types:', nextPieceTypes);
        
        const pieceTypesBuffer = [fallingType, ...nextPieceTypes];
        const pieceBuffer = pieceTypesBuffer.map(type => pieces.find(piece => piece.type === type)!);

        console.log('Piece Types Buffer', pieceTypesBuffer);
        const board = new Board(10, 20, Math.random);
        board.setNextPieces(pieceBuffer);
        board.data = new Uint8Array(boardMatriz.flat());
    
        const bot = new Bot(
          new BoardStatistics(),
          new BasicBoardFitness(),
          new BoardMoveCalculator(),
          new CustomDepthCalculator(),
        );
        const result = bot.next(board);

        console.log('Calculation score', result.score);

        const fallingPieceInfo = pieces.find(piece => piece.type === fallingType)!;

        // Calculate rotation delta (amount of times to rotate the falling piece)
        const expectedPositions = normalizePositions(fallingPieceInfo.rotations[result.rotation].positions);
        let rotationDelta = 0;
        for (; rotationDelta < 4; rotationDelta++) {
          const rotationPositions = normalizePositions(fallingPieceInfo.rotations[rotationDelta].positions);
          if (comparePositions(expectedPositions, rotationPositions)) break;
        }
        const rotationXDelta = posesMinX(fallingPieceInfo.rotations[result.rotation].positions) - posesMinX(fallingPieceInfo.rotations[rotationDelta].positions);
        console.log('Result rotation', result.rotation, 'rotation delta', rotationDelta, 'rotation X delta', rotationXDelta);

        // Calculate X delta (amount of times that the falling piece needs to go to left or right)
        const xDelta = result.x - fallingX + rotationXDelta;
        console.log('Result X', result.x, 'x delta', xDelta);

        await sleep(10);
        for (let i = 0; i < rotationDelta; i++) {GameCanvas.rotate(); await sleep(this.rotationDelay)}
        if (xDelta > 0) {
          for (let i = 0; i < xDelta; i++) {GameCanvas.moveRight(); await sleep(this.moveDelay)}
        } else {
          for (let i = 0; i < -xDelta; i++) {GameCanvas.moveLeft(); await sleep(this.moveDelay)}
        }
        await sleep(this.moveDelay);
        GameCanvas.moveDown();
        await sleep(this.piecesDelay);
      }
    }
    this.lastNextPieceTypes = nextPieceTypes!;
  }
}