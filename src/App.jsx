import { useEffect, useReducer, useRef, useState } from "react";

const STORIES_FETCH_INIT = "STORIES_FETCH_INIT";
const STORIES_FETCH_SUCCESS = "STORIES_FETCH_SUCCESS";
const STORIES_FETCH_FAILURE = "STORIES_FETCH_FAILURE";
const REMOVE_STORY = "REMOVE_STORY";

const initialStories = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

function getStories() {
  if (Math.random() > 1) {
    return Promise.reject();
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: { stories: initialStories } }), 2000);
  });
}

const storiesReducer = (state, action) => {
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
        data: state.data.filter((story) => action.payload !== story.objectID),
      };
    default:
      throw new Error();
  }
};

function App() {
  const [searchTerm, setSearchTerm] = useStorageState("search", "");

  // const [isLoading, setIsLoading] = useState(false);
  // const [isError, setIsError] = useState(false);
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  useEffect(() => {
    dispatchStories({ type: STORIES_FETCH_INIT });

    getStories()
      .then((result) => {
        dispatchStories({
          type: STORIES_FETCH_SUCCESS,
          payload: result.data.stories,
        });
      })
      .catch(() => dispatchStories({ type: STORIES_FETCH_FAILURE }));
  }, []);

  const handleRemoveStory = (id) => {
    dispatchStories({
      type: REMOVE_STORY,
      payload: id,
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.data.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel
        id="search"
        onInputChange={handleSearch}
        value={searchTerm}
        isFocused
      >
        <strong>Search: </strong>
      </InputWithLabel>

      <hr />
      {stories.isError && <p>Something went wrong</p>}

      {stories.isLoading ? (
        <div>Loading...</div>
      ) : (
        <List
          list={searchedStories}
          searchTerm={searchTerm}
          onRemoveItem={handleRemoveStory}
        />
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

function Button({ type = "button", onClick, children, ...rest }) {
  return (
    <button type={type} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}

function List({ list, searchTerm, onRemoveItem }) {
  const filteredList = list.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <ul>
      {filteredList.map((item) => {
        return (
          <Item key={item.objectID} onRemoveItem={onRemoveItem} item={item} />
        );
      })}
    </ul>
  );
}

function Item({ objectID, item, onRemoveItem }) {
  const { url, title, author, num_comments, points } = item;
  return (
    <li>
      <span>
        <a href={url}>{title}</a>
      </span>
      <span>{author}</span>
      <span>{num_comments}</span>
      <span>{points}</span>
      <button type="button" onClick={onRemoveItem.bind(null, objectID)}>
        Dismiss
      </button>
    </li>
  );
}

function InputWithLabel({
  id,
  type = "text",
  value,
  onInputChange,
  children,
  isFocused,
}) {
  const inputRef = useRef();

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input
        id={id}
        ref={inputRef}
        value={value}
        onChange={onInputChange}
        type={type}
      />
    </>
  );
}

function useStorageState(key, initialState) {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
}

export default App;
