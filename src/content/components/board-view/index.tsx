import React, { useEffect, useRef } from "react";
import { GameCanvasFallingPiece } from "../../services/game-canvas";

export interface BoardViewProps {
  board?: number[][];
  fallingPiece?: GameCanvasFallingPiece,
}

export function BoardView({board, fallingPiece}: BoardViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!board) return;

    const blockSize = 20;
    const width = (board[0]?.length || 0) * blockSize;
    const height = board.length * blockSize;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
  
    // Render blocks
    ctx.fillStyle = '#ffffff';
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        if (board[y][x] === 1) {
          ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        }
      }
    }
  
    // Render falling piece
    ctx.fillStyle = '#ff0000';
    const positions = fallingPiece?.positions || [];
    for (const position of positions) {
      ctx.fillRect(position.x * blockSize, position.y * blockSize, blockSize, blockSize);
    }
  }, [canvasRef, board, fallingPiece]);

  return <canvas style={{width: 75, height: 150, border: '1px solid #ffffff88'}} ref={canvasRef}></canvas>
}
