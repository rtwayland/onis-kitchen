import React, { useState, useEffect } from 'react';
import { Accordion } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { API } from 'aws-amplify';
import _ from 'lodash';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    async function onLoad() {
      try {
        const allRecipes = await loadRecipes();
        const recipesByCategory = _.groupBy(allRecipes, 'category');
        const categories = Object.entries(recipesByCategory).map((section) => ({
          key: section[0],
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
        setRecipes(categories);
      } catch (e) {
        console.log(e);
      }
    }

    onLoad();
  }, []);

  function loadRecipes() {
    return API.get('recipes', '/recipes');
  }
  return (
    <div>
      <Accordion panels={recipes} />
    </div>
  );
};

export default RecipeList;
