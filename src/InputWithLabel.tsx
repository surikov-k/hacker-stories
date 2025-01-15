import { useEffect, useRef } from "react";
import styles from "./App.module.css";

type InputWithLabelProps = {
  id: string;
  value: string;
  type?: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isFocused?: boolean;
  children: React.ReactNode;
};

export default function InputWithLabel({
  id,
  type = "text",
  value,
  onInputChange,
  children,
  isFocused,
}: InputWithLabelProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label className={styles.label} htmlFor={id}>
        {children}
      </label>
      <input
        className={styles.input}
        id={id}
        ref={inputRef}
        value={value}
        onChange={onInputChange}
        type={type}
      />
    </>
  );
}
