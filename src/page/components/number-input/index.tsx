import styles from "./styles.module.css"
import React, { ChangeEvent } from "react";
import { safeParseInt } from "../../functions";

export interface NumberInputProps {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  invalidValueDefault?: number;
  onChange?: (value: number) => any;
}

export function NumberInput({label, min = -Infinity, max = Infinity, step = 1, value = 0, invalidValueDefault = 0, onChange}: NumberInputProps) {
  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue = safeParseInt(invalidValueDefault)(e.target.value);
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    onChange?.(newValue);
  };

  return <div className={styles.container}>
    <p>{label}</p>
    <div>
      <button onClick={() => {value > min && onChange?.(value - step)}}>-</button>
      <input value={value} onChange={changeHandler}></input>
      <button onClick={() => {value < max && onChange?.(value + step)}}>+</button>
    </div>
  </div>
}
