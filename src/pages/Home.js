import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Input, List } from 'semantic-ui-react';
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
          <Input
            fluid
            size="huge"
            icon="search"
            iconPosition="left"
            id="search"
            placeholder="Search recipe names"
            value={searchVal}
            onChange={handleSearch}
          />
          <List divided relaxed>
            {list.map((item) => (
              <List.Item key={item.id}>
                <List.Content>
                  <List.Header>
                    <Link to={`/recipes/${item.id}`}>{item.name}</Link> —{' '}
                    {item.category}
                  </List.Header>
                  {/* <List.Description>Tags: </List.Description> */}
                </List.Content>
              </List.Item>
            ))}
          </List>
        </>
      ) : (
        <Container>
          <h1 className="handwriting">Welcome to Oni&apos;s Kitchen</h1>
        </Container>
      )}
    </div>
  );
};

const Container = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  zIndex: -1,
  textAlign: 'center',
});

export default Home;
