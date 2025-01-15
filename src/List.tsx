import { Stories, Story } from "./App";
import styles from "./App.module.css";
import Check from "./assets/check.svg?react";

type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
};

export function List({ list, onRemoveItem }: ListProps): JSX.Element {
  return (
    <ul>
      {list.map((item) => {
        return (
          <Item key={item.objectID} onRemoveItem={onRemoveItem} item={item} />
        );
      })}
    </ul>
  );
}
type ItemProps = {
  item: Story;
  onRemoveItem: (item: Story) => void;
};

export function Item({ item, onRemoveItem }: ItemProps): JSX.Element {
  const { url, title, author, num_comments, points } = item;

  return (
    <li className={styles.item}>
      <span style={{ width: "40%" }}>
        <a href={url}>{title}</a>
      </span>
      <span style={{ width: "30%" }}> {author}</span>
      <span style={{ width: "10%" }}> {num_comments}</span>
      <span style={{ width: "10%" }}> {points}</span>
      <span style={{ width: "10%" }}>
        <button
          data-testid="dismiss-button"
          className={`${styles.button} ${styles.button_small}`}
          type="button"
          onClick={onRemoveItem.bind(null, item)}
        >
          <Check height="18px" width="18px" />
        </button>
      </span>
    </li>
  );
}
