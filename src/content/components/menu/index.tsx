import styles from "./styles.module.css"
import React, { useEffect, useReducer, useState } from "react";
import { GameCanvasFallingPiece } from "../../services/game-canvas";
import { BoardView } from "../board-view";
import { AutoPlay } from "../../services/auto-play";
import { NumberInput } from "../number-input";

export function Menu() {
  const [board, setBoard] = useState<number[][]>();
  const [fallingPiece, setFallingPiece] = useState<GameCanvasFallingPiece>();
  const [nextPiecesTypes, setNextPiecesTypes] = useState<string[]>([]);
  const [fallingType, setFallingType] = useState<string>();
  
  const [num, setNum] = useState(0);
  const forceRender = () => setNum(num + 1);

  const moveDelay = AutoPlay.moveDelay;
  const setMoveDelay = (delay: number) => (AutoPlay.moveDelay = delay, forceRender());
  const rotationDelay = AutoPlay.rotationDelay;
  const setRotationDelay = (delay: number) => (AutoPlay.rotationDelay = delay, forceRender());
  const piecesDelay = AutoPlay.piecesDelay;
  const setPiecesDelay = (delay: number) => (AutoPlay.piecesDelay = delay, forceRender());

  const autoPlaying = AutoPlay.isRunning();
  const toggleAutoPlay = () => {
    autoPlaying ? AutoPlay.stop() : AutoPlay.start();
    forceRender();
  };

  useEffect(() => {
    AutoPlay.getEventEmitter().on('board_matriz_changed', setBoard);
    AutoPlay.getEventEmitter().on('falling_piece_changed', setFallingPiece);
    AutoPlay.getEventEmitter().on('next_pieces_types_changed', setNextPiecesTypes);
    AutoPlay.getEventEmitter().on('falling_type_changed', setFallingType);
    return () => {
      AutoPlay.stop();
      AutoPlay.getEventEmitter().off('board_matriz_changed', setBoard);
      AutoPlay.getEventEmitter().off('falling_piece_changed', setFallingPiece);
      AutoPlay.getEventEmitter().off('next_pieces_types_changed', setNextPiecesTypes);
      AutoPlay.getEventEmitter().off('falling_type_changed', setFallingType);
    };
  }, []);

  return <div className={styles.container}>
    <div className={styles.header}>
      <p onClick={() => window.open('https://github.com/vanflux/jstetris-bot')}>Jstris Bot</p>
    </div>
    <div className={styles.content}>
      <NumberInput
        label='Move delay:'
        value={moveDelay}
        min={10}
        step={10}
        onChange={setMoveDelay}
      ></NumberInput>
      <NumberInput
        label='Rotation delay:'
        value={rotationDelay}
        min={10}
        step={10}
        onChange={setRotationDelay}
      ></NumberInput>
      <NumberInput
        label='Pieces delay:'
        value={piecesDelay}
        min={10}
        step={10}
        onChange={setPiecesDelay}
      ></NumberInput>
      <button className={styles.toggleAutoPlay} onClick={toggleAutoPlay}>{autoPlaying ? 'Stop Auto Play' : 'Start Auto Play'}</button>
      <p className={styles.paragraph}>Game view:</p>
      <div style={{alignSelf: 'center'}}>
        <BoardView board={board} fallingPiece={fallingPiece}></BoardView>
        <p className={styles.paragraph}>Falling Type: {fallingType}</p>
        <p className={styles.paragraph}>Next Pieces: {nextPiecesTypes?.join(', ')}</p>
      </div>
    </div>
  </div>
}
