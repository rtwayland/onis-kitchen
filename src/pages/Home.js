import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Input, List } from 'semantic-ui-react';
import { searchRecipes } from '../utils/api';
import DimmedLoader from '../components/DimmedLoader';

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
  const [isSearching, setIsSearching] = useState(false);

  const searchApi = async (text) => {
    if (text) {
      const recipes = await searchRecipes(text);
      setList(recipes);
      setIsSearching(false);
    }
  };

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchVal(value);
    setIsSearching(true);
    debounceSearch(value, searchApi);
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <h1 className="handwriting">Search Recipes</h1>
          <Input
            fluid
            size="huge"
            icon="search"
            iconPosition="left"
            id="search"
            placeholder="Recipe name"
            value={searchVal}
            onChange={handleSearch}
          />
          <DimmedLoader
            loadingText="Searching Recipes"
            isActive={isSearching && !!searchVal}
            fillSpace={list.length < 1}
          >
            <div style={{ marginTop: 30 }} />
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
            <div style={{ marginTop: 30 }} />
          </DimmedLoader>
        </>
      ) : (
        <Container>
          <Welcome className="handwriting">
            Welcome to Oni&apos;s Kitchen
          </Welcome>
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

const Welcome = styled.h1({
  fontSize: '3.5rem',
});

export default Home;
