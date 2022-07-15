import styles from "./styles.module.css"
import React, { useEffect, useRef, useState } from "react";
import { GameCanvas, GameCanvasState } from "../../services/game-canvas";
import { Board, BoardFitness1, BoardMoveCalculator, BoardStatistics, Bot, pieces } from "tetris-bot";
import { PieceDetector } from "../../services/piece-detector";
import { compareArrays, comparePositions, normalizePositions, posesMinX } from "../../functions";
import { NextPiecesCanvas } from "../../services/next-pieces-canvas";

export function Menu() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const sendKeyEvent = (type: string, keyCode: number) => {        
    const keyboardEvent = document.createEvent('KeyboardEvent');
    const initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? 'initKeyboardEvent' : 'initKeyEvent';
    // @ts-ignore
    keyboardEvent[initMethod](type, true, true, window, false, false, false, false, 0, 0);
    Object.defineProperty(keyboardEvent, "keyCode", { get: () => keyCode });
    document.dispatchEvent(keyboardEvent);
  }

  const sendKeyClick = (keyCode: number) => {
    sendKeyEvent('keydown', keyCode);
    sendKeyEvent('keyup', keyCode);
  }

  const moveLeft = () => sendKeyClick(37);
  const moveRight = () => sendKeyClick(39);
  const moveDown = () => sendKeyClick(32);
  const rotate = () => sendKeyClick(38);

  const drawState = (state: GameCanvasState) => {
    const {blocks, fallingPiece} = state;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const blockSize = 20;
    const width = (blocks[0]?.length || 0) * blockSize;
    const height = blocks.length * blockSize;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (blocks[y][x] === 1) {
          ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        }
      }
    }
    ctx.fillStyle = '#ff0000';
    for (const position of fallingPiece?.positions || []) {
      ctx.fillRect(position.x * blockSize, position.y * blockSize, blockSize, blockSize);
    }
  }

  useEffect(() => {
    let lastNextPiecesTypes: string[];
    const updateState = () => {
      const gameState = GameCanvas.capture();
      if (!gameState) return;
      drawState(gameState);

      const nextPiecesState = NextPiecesCanvas.capture();
      if (!nextPiecesState) return;
      
      let { fallingPiece, blocks } = gameState;
      const { nextPieceTypes } = nextPiecesState;

      console.log(lastNextPiecesTypes?.[0]);
      
      if (!lastNextPiecesTypes || !compareArrays(lastNextPiecesTypes, nextPieceTypes)) {
        lastNextPiecesTypes = nextPieceTypes;
      }

      // TODO: Calculate rotations count and X moves and execute, after -> next piece.

      /*if (!fallingPiece) {
        let x = 3;
        const type = lastNextPiecesTypes[0];
        if (type === 'O') x = 4;
        const rotation = 0;
        const { positions } = pieces.find(piece => piece.type === type)!.rotations[rotation];
        fallingPiece = { x, y: 0, type, positions, rotation: 0};
      };
      
      console.log('fallingPiece', fallingPiece.type);
      
      const pieceInfo = pieces.find(x => x.type === fallingPiece?.type);
      if (!pieceInfo) return;
      
      const nextPieces = [pieceInfo, ...nextPieceTypes.map(type => pieces.find(piece => piece.type === type)!)];
      const board = new Board(10, 20, Math.random);
      board.setNextPieces(nextPieces);
      board.data = new Uint8Array(blocks.flat());
  
      const bot = new Bot(
        new BoardStatistics(),
        new BoardFitness1(),
        new BoardMoveCalculator(),
      );
      const result = bot.next(board);
  
      const targetXOffset = posesMinX(pieceInfo.rotations[result.rotation].positions);
      const xDelta = (result.x + targetXOffset) - fallingPiece.x;
      const needRotate = !comparePositions(normalizePositions(pieceInfo.rotations[result.rotation].positions), normalizePositions(fallingPiece.positions));

      console.log('Result', result, '|', 'needRotate', needRotate, 'xDelta', xDelta);

      if (needRotate) {
        console.log('Rotating');
        rotate();
      } else {
        if (xDelta > 0) {
          console.log('Moving right');
          moveRight();
        } else if (xDelta < 0) {
          console.log('Moving left');
          moveLeft();
        } else {
          console.log('Moving down');
          moveDown();
        }
      }*/
    };
    const timer = setInterval(updateState, 50);
    return () => clearInterval(timer);
  }, []);

  return <div className={styles.container}>
    <div className={styles.content}>
      <p>JsTetris Bot</p>
      <canvas ref={canvasRef}></canvas>
    </div>
  </div>
}
