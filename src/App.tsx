import axios from "axios";
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
  page: number;
  isLoading: boolean;
  isError: boolean;
};

type StoriesFetchInitAction = {
  type: "STORIES_FETCH_INIT";
};

type StoriesFetchSuccessAction = {
  type: "STORIES_FETCH_SUCCESS";
  payload: { list: Stories; page: number };
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
const API_BASE = "https://hn.algolia.com/api/v1";
const API_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";

const getUrl = (searchTerm: string, page: number) =>
  `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

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
        data:
          action.payload.page === 0
            ? action.payload.list
            : state.data.concat(action.payload.list),
        page: action.payload.page,
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

function extractSearchTerm(urlString: string) {
  const url = new URL(urlString);
  return url.searchParams.get("query");
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

function App() {
  const [searchTerm, setSearchTerm] = useStorageState("search", "React");
  const [urls, setUrls] = useState<string[]>([getUrl(searchTerm, 0)]);
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    page: 0,
    isLoading: false,
    isError: false,
  });

  const handleLastSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm, 0);
  };

  const handleMore = () => {
    const lastUrl = urls.at(-1) || "";
    const searchTerm = extractSearchTerm(lastUrl) || "";
    handleSearch(searchTerm, stories.page + 1);
  };

  const lastSearches = getLastSearches(urls);

  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: STORIES_FETCH_INIT });

    try {
      const url = urls[urls.length - 1];
      const result = await axios.get(url);

      dispatchStories({
        type: STORIES_FETCH_SUCCESS,
        payload: {
          list: result.data.hits,
          page: result.data.page,
        },
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

  const handleSearch = (searchTerm: string, page: number) => {
    const url = getUrl(searchTerm, page);
    setUrls(urls.concat(url));
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch(searchTerm, 0);
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

      <List list={stories.data} onRemoveItem={handleRemoveStory} />
      {stories.isLoading ? (
        <div>Loading...</div>
      ) : (
        <button type="button" onClick={handleMore}>
          More
        </button>
      )}
    </div>
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
