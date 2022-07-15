import styles from "./styles.module.css"
import React, { useEffect, useRef, useState } from "react";
import { GameCanvas, GameCanvasState } from "../../services/game-canvas";

export function Menu() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const updateState = () => {
    const state = GameCanvas.capture();
    drawState(state);
  };

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
    for (const position of fallingPiece || []) {
      ctx.fillRect(position.x * blockSize, position.y * blockSize, blockSize, blockSize);
    }
  }

  useEffect(() => {
    const timer = setInterval(updateState, 100);
    return () => clearInterval(timer);
  }, []);

  return <div className={styles.container}>
    <div className={styles.content}>
      <p>JsTetris Bot</p>
      <canvas ref={canvasRef}></canvas>
    </div>
  </div>
}
