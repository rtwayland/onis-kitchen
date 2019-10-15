import React, { useState, useEffect } from 'react';
import { Accordion } from 'semantic-ui-react';
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
          <ul>
            {section[1].map((item) => (
              <li key={item.id}>
                <Link to={`/recipes/${item.id}`}>{item.name}</Link>
              </li>
            ))}
          </ul>
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
    <div>
      <h1>Recipes</h1>
      <Accordion panels={recipes} />
    </div>
  );
};

export default RecipeList;
