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

import InputWithLabel from "./InputWithLabel";
import LastSearch from "./LastSearch";
import { List } from "./List";
import SearchForm from "./SearchForm";

export type Story = {
  objectID: number;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};

export type Stories = Story[];

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

export type StoriesAction =
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
  return stories.data.reduce((acc, story) => acc + story.num_comments || 0, 0);
}

function extractSearchTerm(url: string) {
  return url.replace(API_ENDPOINT, "");
}

function getLastSearches(urls: string[]) {
  return urls
    .reduce((acc: string[], current: string) => {
      if (acc.at(-1) !== current) {
        acc.push(current);
      }
      console.log(current);
      return acc;
    }, [])
    .slice(-6)
    .slice(0, -1)
    .map((url) => extractSearchTerm(url));
}

function getUrl(searchTerm: string) {
  return `${API_ENDPOINT}${searchTerm}`;
}

function App() {
  const [searchTerm, setSearchTerm] = useStorageState("search", "React");
  const [urls, setUrls] = useState<string[]>([getUrl(searchTerm)]);
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleLastSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm);
  };

  const lastSearches = getLastSearches(urls);

  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: STORIES_FETCH_INIT });

    try {
      const url = urls[urls.length - 1];
      const result = await axios.get(url);

      dispatchStories({
        type: STORIES_FETCH_SUCCESS,
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: STORIES_FETCH_FAILURE });
    }
  }, [urls]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item: Story) => {
    dispatchStories({
      type: REMOVE_STORY,
      payload: item,
    });
  };

  const handleSearch = (searchTerm: string) => {
    const url = getUrl(searchTerm);
    setUrls(urls.concat(url));
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch(searchTerm);
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

      <LastSearch lastSearches={lastSearches} onLastSearch={handleLastSearch} />

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

export default App;
export { storiesReducer, SearchForm };
