import { useEffect, useReducer, useRef, useState } from "react";

const SET_STORIES = "SET_STORIES";
const REMOVE_STORIES = "REMOVE_STORIES";

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
  if (Math.random() > 0.5) {
    return Promise.reject();
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: { stories: initialStories } }), 2000);
  });
}

const storiesReducer = (state, action) => {
  switch (action.type) {
    case SET_STORIES:
      return action.payload;
    case REMOVE_STORIES:
      return state.filter((story) => action.payload !== story.objectID);
    default:
      throw new Error();
  }
};

function App() {
  const [searchTerm, setSearchTerm] = useStorageState("search", "");
  // const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [stories, dispatchStories] = useReducer(storiesReducer, []);

  useEffect(() => {
    setIsLoading(true);
    getStories()
      .then((result) => {
        dispatchStories({
          type: "SET_STORIES",
          payload: result.data.stories,
        });
        setIsLoading(false);
      })
      .catch(() => setIsError(true));
  }, []);

  const handleRemoveStory = (id) => {
    dispatchStories({
      type: "SET_STORIES",
      payload: id,
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel
        id="search"
        OnInputChange={handleSearch}
        value={searchTerm}
        isFocused
      >
        <strong>Search: </strong>
      </InputWithLabel>

      <hr />
      {isError && <p>Something went wrong</p>}

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <List
          list={stories}
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
          <Item key={item.objectID} onRemoveItem={onRemoveItem} {...item} />
        );
      })}
    </ul>
  );
}

function Item({
  objectID,
  url,
  title,
  author,
  num_comments,
  points,
  onRemoveItem,
}) {
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
  console.log("InputWithLabel renders");

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
        // autoFocus={ isFocused }
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
