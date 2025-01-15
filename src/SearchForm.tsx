import styles from "./App.module.css";
import InputWithLabel from "./InputWithLabel.js";
import clsx from "clsx";

type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};
export default function SearchForm({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}: SearchFormProps) {
  return (
    <form onSubmit={onSearchSubmit} className={styles["search-form"]}>
      <InputWithLabel
        id="search"
        onInputChange={onSearchInput}
        value={searchTerm}
        isFocused
      >
        <strong>Search: </strong>
      </InputWithLabel>
      <button
        className={clsx(styles.button, styles.button_large)}
        type="submit"
        disabled={!searchTerm}
      >
        Submit
      </button>
    </form>
  );
}
