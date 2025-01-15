import { useState } from "react";
import { Stories, Story } from "./App";
import styles from "./App.module.css";
import Check from "./assets/check.svg?react";
import { sortBy } from "lodash";

type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
};

const Sorts = {
  NONE: (list: Stories) => list,
  TITLE: (list: Stories) => sortBy(list, "title"),
  AUTHOR: (list: Stories) => sortBy(list, "author"),
  COMMENT: (list: Stories) => sortBy(list, "num_comments").reverse(),
  POINT: (list: Stories) => sortBy(list, "points").reverse(),
};

export function List({ list, onRemoveItem }: ListProps): JSX.Element {
  const [sort, setSort] = useState("NONE");

  const handleSort = (sortKey: string) => {
    setSort(sortKey);
  };

  const sortFunction = Sorts[sort];
  const sortedList = sortFunction(list);

  return (
    <ul>
      <li style={{ display: "flex" }}>
        <span style={{ width: "40%" }}>
          {" "}
          <button type="button" onClick={() => handleSort("TITLE")}>
            Title
          </button>
        </span>
        <span style={{ width: "30%" }}>
          <button type="button" onClick={() => handleSort("AUTHOR")}>
            Author
          </button>
        </span>
        <span style={{ width: "10%" }}>
          <button type="button" onClick={() => handleSort("COMMENT")}>
            Comments
          </button>
        </span>
        <span style={{ width: "10%" }}>
          <button type="button" onClick={() => handleSort("POINT")}>
            Points
          </button>
        </span>
        <span style={{ width: "10%" }}>Actions</span>
      </li>

      {sortedList.map((item: Story) => {
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
