import styles from "./styles.module.css"
import React, { useState } from "react";
import { Menu } from "../menu";
import Draggable from "react-draggable";

export function App() {
  return <div className={styles.container}>
    <Draggable>
      <div>
        <Menu></Menu>
      </div>
    </Draggable>
    
  </div>
}
