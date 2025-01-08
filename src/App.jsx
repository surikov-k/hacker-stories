import { useEffect, useState } from "react";


function App() {
  const stories = [
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

  const [searchTerm, setSearchTerm] = useStorageState("search", "");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel id="search"
                      OnInputChange={ handleSearch }
                      value={ searchTerm }>
        <strong>Search: </strong>
      </InputWithLabel>

      <hr/>
      <List list={ stories }
            searchTerm={ searchTerm }/>
      <Button onClick={ () => console.log("Clicked button One!") }>Click Button One!</Button>
      <Button type="submit"
              onClick={ () => console.log("Clicked button Two!") }>Click Button Two!</Button>
    </div>
  );
}


function Button({ type = "button", onClick, children, ...rest }) {
  return (
    <button type={ type }
            onClick={ onClick }  { ...rest }>
      { children }
    </button>
  );
}

function List({ list, searchTerm }) {
  console.log("List renders");
  const filteredList = list.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
  return (
    <ul>
      { filteredList.map(({ objectID, ...item }) => {
        return <Item key={ objectID }
                     { ...item }/>;
      }) }
    </ul>
  );
}

function Item({ url, title, author, num_comments, points }) {
  console.log("Item renders");
  return (
    <li>
              <span>
                <a href={ url }>{ title }</a>
              </span>
      <span>{ author }</span>
      <span>{ num_comments }</span>
      <span>{ points }</span>
    </li>
  );
}

function InputWithLabel({
                          id, type = "text",
                          value, onInputChange, children
                        }) {

  console.log("InputWithLabel renders");

  return (
    <>
      <label htmlFor={ id }>{ children }</label>
      <input id={ id }
             value={ value }
             onChange={ onInputChange }
             type={ type }
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
