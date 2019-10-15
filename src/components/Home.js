import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { searchRecipes } from '../utils/api';

const debounceSearch = _.debounce(
  (text, callback) => {
    callback(text);
  },
  1000,
  { maxWait: 500 }
);

const Home = ({ isAuthenticated }) => {
  const [list, setList] = useState([]);
  const [searchVal, setSearchVal] = useState('');

  const searchApi = async (text) => {
    if (text) {
      const recipes = await searchRecipes(text);
      setList(recipes);
    }
  };

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchVal(value);
    debounceSearch(searchVal, searchApi);
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <input
            type="text"
            id="search"
            value={searchVal}
            onChange={handleSearch}
          />
          <ul>
            {list.map((item) => (
              <li key={item.id}>
                <Link to={`/recipes/${item.id}`}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div>Welcome to Oni&apos;s Kitchen</div>
      )}
    </div>
  );
};

export default Home;
