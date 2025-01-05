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

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  console.log("App renders");

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search onSearch={handleSearch}/>
      <hr/>
      <List list={stories} searchTerm={searchTerm}/>
    </div>
  );
}

function List(props) {
  console.log("List renders");
  const filteredList = props.list.filter((item) => item.title.toLowerCase().includes(props.searchTerm.toLowerCase()));
  return (
    <ul>
      { filteredList.map((item) => {
        return <Item key={item.objectID} item={item}/>;
      }) }
    </ul>
  );
}

function Item({ item }) {
  console.log("Item renders");
  return (
    <li>
              <span>
                <a href={ item.url }>{ item.title }</a>
              </span>
      <span>{ item.author }</span>
      <span>{ item.num_comments }</span>
      <span>{ item.points }</span>
    </li>
  );
}

function Search(props) {

  const handleChange = (event) => {
    props.onSearch(event.target.value);
  };
  console.log("Search renders");
  
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search"
             onChange={ handleChange }
             type="text"/>
    </div>
  );
}

export default App;
