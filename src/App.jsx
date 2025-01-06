import { useState } from "react";

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

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  console.log("App renders");

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search onSearch={ handleSearch }
              search={ searchTerm }/>
      <hr/>
      <List list={ stories }
            searchTerm={ searchTerm }/>
    </div>
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

function Search({ search, onSearch }) {

  console.log("Search renders");

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search"
             value={ search }
             onChange={ onSearch }
             type="text"/>
    </div>
  );
}

export default App;
