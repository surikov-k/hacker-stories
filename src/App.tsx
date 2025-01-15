import axios from "axios";
import clsx from "clsx";
import {
  ButtonHTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import styles from "./App.module.css";
import Check from "./assets/check.svg?react";

type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};

type Stories = Story[];

type StoriesState = {
  data: Stories;
  isLoading: boolean;
  isError: boolean;
};

type StoriesFetchInitAction = {
  type: "STORIES_FETCH_INIT";
};

type StoriesFetchSuccessAction = {
  type: "STORIES_FETCH_SUCCESS";
  payload: Stories;
};

type StoriesFetchFailureAction = {
  type: "STORIES_FETCH_FAILURE";
};

type StoriesRemoveAction = {
  type: "REMOVE_STORY";
  payload: Story;
};

type StoriesAction =
  | StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailureAction
  | StoriesRemoveAction;

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const STORIES_FETCH_INIT = "STORIES_FETCH_INIT";
const STORIES_FETCH_SUCCESS = "STORIES_FETCH_SUCCESS";
const STORIES_FETCH_FAILURE = "STORIES_FETCH_FAILURE";
const REMOVE_STORY = "REMOVE_STORY";

const storiesReducer = (state: StoriesState, action: StoriesAction) => {
  switch (action.type) {
    case STORIES_FETCH_INIT:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case STORIES_FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case STORIES_FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case REMOVE_STORY:
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

function getSumComments(stories: { data: Stories }) {
  console.log("getSumComments");
  return stories.data.reduce((acc, story) => acc + story.num_comments, 0);
}

function App() {
  const [searchTerm, setSearchTerm] = useStorageState("search", "React");
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: STORIES_FETCH_INIT });

    try {
      const result = await axios.get(url);

      dispatchStories({
        type: STORIES_FETCH_SUCCESS,
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: STORIES_FETCH_FAILURE });
    }
  }, [url]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item: Story) => {
    dispatchStories({
      type: REMOVE_STORY,
      payload: item,
    });
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const sumComments = useMemo(() => getSumComments(stories), [stories]);

  return (
    <div className={styles.container}>
      <h1 className={styles["headline-primary"]}>
        My Hacker Stories with {sumComments} comments.
      </h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      {stories.isError && <p>Something went wrong</p>}

      {stories.isLoading ? (
        <div>Loading...</div>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
      <Button onClick={() => console.log("Clicked button One!")}>
        Click Button One!
      </Button>
      <Button type="submit" onClick={() => console.log("Clicked button Two!")}>
        Click Button Two!
      </Button>
    </div>
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

function Button({ type = "button", onClick, children, ...rest }: ButtonProps) {
  return (
    <button type={type} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}

type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
};

function List({ list, onRemoveItem }: ListProps): JSX.Element {
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

function Item({ item, onRemoveItem }: ItemProps): JSX.Element {
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

type InputWithLabelProps = {
  id: string;
  value: string;
  type?: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isFocused?: boolean;
  children: React.ReactNode;
};

function InputWithLabel({
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

function useStorageState(
  key: string,
  initialState: string
): [string, (newValue: string) => void] {
  const isMounted = useRef(false);
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    console.log("A");
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
}

type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};
function SearchForm({
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

export default App;
