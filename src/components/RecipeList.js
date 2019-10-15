import React, { useState, useEffect } from 'react';
import { Global } from '@emotion/core';
import { Accordion, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { getRecipes, LocalStorage } from '../utils/api';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const formatRecipesForList = (array) => {
    const recipesByCategory = _.groupBy(array, 'category');
    const categories = Object.entries(recipesByCategory).map((section, i) => ({
      key: `recipe-list-${i + 1}-${section[0]}`,
      title: section[0],
      content: {
        content: (
          <List divided relaxed>
            {section[1].map((item) => (
              <List.Item key={item.id}>
                <List.Content>
                  <List.Header>
                    <Link to={`/recipes/${item.id}`}>{item.name}</Link>
                  </List.Header>
                </List.Content>
              </List.Item>
            ))}
          </List>
        ),
      },
    }));

    return categories;
  };

  useEffect(() => {
    const loadRecipes = async () => {
      let allRecipes = LocalStorage.get('rawRecipeData');
      if (!allRecipes) allRecipes = await getRecipes();

      const formattedRecipies = formatRecipesForList(allRecipes);
      setRecipes(formattedRecipies);
    };
    loadRecipes();
  }, []);

  return (
    <>
      <Global
        styles={{
          '.ui.accordion .title:not(.ui)': {
            fontSize: 25,
          },
          '.ui.accordion .active.content': {
            paddingLeft: '36px !important',
          },
        }}
      />
      <div>
        <h1>Recipes by Category</h1>
        <Accordion panels={recipes} />
      </div>
    </>
  );
};

export default RecipeList;
