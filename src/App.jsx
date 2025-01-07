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
  const [favortie, setFavorite] = useState("");
  const [checked, setChecked] = useState(false);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChecked = () => {
    setChecked(!checked);
  };

  console.log("App renders");

  const handleCatChange = () => {
    setFavorite("cat");
  };
  const handleDogChange = () => {
    setFavorite("dog");
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel id="search"
                      label="Search: "
                      OnInputChange={ handleSearch }
                      value={ searchTerm }/>
      <hr/>
      <List list={ stories }
            searchTerm={ searchTerm }/>
      <Button onClick={ () => console.log("Clicked button One!") }>Click Button One!</Button>
      <Button type="submit"
              onClick={ () => console.log("Clicked button Two!") }>Click Button Two!</Button>
      <RadioButton label="Cat"
                   value={ favortie === "cat" }
                   onChange={ handleCatChange }/>
      <RadioButton label="Dog"
                   value={ favortie === "dog" }
                   onChange={ handleDogChange }/>
      <Checkbox label="My Value" value={checked} onChange={handleChecked}/>
    </div>
  );
}

function Checkbox({label, value, onChange}) {
  return (
    <label>
      <input type="checkbox" checked={value} onChange={onChange}/>
      {label}
    </label>
  );
}

function RadioButton({ label, value, onChange }) {
  return (
    <label>
      <input type="radio"
             checked={ value }
             onChange={ onChange }/>
      { label }
    </label>
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
                          id, label, type = "text",
                          value, onInputChange
                        }) {

  console.log("InputWithLabel renders");

  return (
    <>
      <label htmlFor={ id }>{ label }</label>
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
