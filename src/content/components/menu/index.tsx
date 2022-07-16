import styles from "./styles.module.css"
import React, { useEffect, useRef, useState } from "react";
import { GameCanvas, GameCanvasFallingPiece, GameCanvasState } from "../../services/game-canvas";
import { Board, BoardFitness1, BoardMoveCalculator, BoardStatistics, Bot, FallingPiece, pieces, sleep } from "tetris-bot";
import { PieceDetector } from "../../services/piece-detector";
import { compareArrays, comparePositions, normalizePositions, posesMinX } from "../../functions";
import { NextPiecesCanvas } from "../../services/next-pieces-canvas";
import { BoardView } from "../board-view";

export function Menu() {
  const [board, setBoard] = useState<number[][]>();
  const [fallingPiece, setFallingPiece] = useState<GameCanvasFallingPiece>();

  useEffect(() => {
    let running = true;
    let lastNextPieceTypes: string[] = [];
    new Promise(async () => {
      console.log('Bot loop started');
      while(running) {
        const { success: gameCaptureSuccess, board, fallingPiece, empty } = GameCanvas.capture();
        if (!gameCaptureSuccess) {
          await sleep(500);
          continue;
        }
        
        if (empty) {
          console.log('Bot reseted state');
          lastNextPieceTypes = [];
        }

        setBoard(board);
        setFallingPiece(fallingPiece);

        const { success: nextPiecesCaptureSuccess, nextPieceTypes } = NextPiecesCanvas.capture();
        if (!nextPiecesCaptureSuccess) {
          await sleep(500);
          continue;
        }

        const nextPiecesChanged = !compareArrays(lastNextPieceTypes, nextPieceTypes);
        if (nextPiecesChanged) {
          const fallingType = lastNextPieceTypes.shift();
          const fallingX = 3;
          if (fallingType !== undefined) {
            console.log('A', fallingType, 'started falling now');
            console.log('Next pieces types:', nextPieceTypes);
            
            const pieceTypesBuffer = [fallingType, ...nextPieceTypes];
            const pieceBuffer = pieceTypesBuffer.map(type => pieces.find(piece => piece.type === type)!);

            console.log('Piece Types Buffer', pieceTypesBuffer);
            console.log('Board flat', board);
            const boardObj = new Board(10, 20, Math.random);
            boardObj.setNextPieces(pieceBuffer);
            boardObj.data = new Uint8Array(board.flat());
        
            const bot = new Bot(
              new BoardStatistics(),
              new BoardFitness1(),
              new BoardMoveCalculator(),
            );
            const result = bot.next(boardObj);

            console.log('Calculation score', result.score);

            const fallingPieceInfo = pieces.find(piece => piece.type === fallingType)!;

            // Calculate rotation delta (amount of times to rotate the falling piece)
            const expectedPositions = normalizePositions(fallingPieceInfo.rotations[result.rotation].positions);
            let rotationDelta = 0;
            for (; rotationDelta < 4; rotationDelta++) {
              const rotationPositions = normalizePositions(fallingPieceInfo.rotations[rotationDelta].positions);
              if (comparePositions(expectedPositions, rotationPositions)) break;
            }
            console.log('Result rotation', result.rotation, 'rotation delta', rotationDelta);

            // Calculate X delta (amount of times that the falling piece needs to go to left or right)
            //const targetXOffset = posesMinX(fallingPieceInfo.rotations[rotationDelta].positions);
            const xDelta = result.x - fallingX;
            console.log('Result X', result.x, 'x delta', xDelta); // TODO: Arrumar o calculo, a peça I quando rotacionada com delta 1 e quer ser colocada no X -1 não funciona, ele acaba deslocando 4 para esquerda e cai na posição 1 ao invés de 0
            
            for (let i = 0; i < rotationDelta; i++) {GameCanvas.rotate(); await sleep(10)}
            if (xDelta > 0) {
              for (let i = 0; i < xDelta; i++) {GameCanvas.moveRight(); await sleep(10)}
            } else {
              for (let i = 0; i < -xDelta; i++) {GameCanvas.moveLeft(); await sleep(10)}
            }
            await sleep(10);
            GameCanvas.moveDown();
          }
        }
        lastNextPieceTypes = nextPieceTypes!;
        await sleep(100);
      }
      console.log('Bot loop ended');
    });
    return () => {
      running = false;
    };
  }, []);

  return <div className={styles.container}>
    <div className={styles.content}>
      <p>JsTetris Bot</p>
      <BoardView board={board} fallingPiece={fallingPiece}></BoardView>
    </div>
  </div>
}
