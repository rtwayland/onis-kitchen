import React, { useState, useEffect } from 'react';
import { getFavoriteRecipes } from '../utils/api';
import RecipeList from '../components/RecipeList';

const FavoriteRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const loadRecipes = async () => {
      const favorites = await getFavoriteRecipes();
      setRecipes(favorites);
    };
    loadRecipes();
  }, []);

  return (
    <div>
      <h1>Favorite Recipes by Category</h1>
      {recipes.length > 0 ? (
        <RecipeList recipes={recipes} />
      ) : (
        'Currently no favorites.'
      )}
    </div>
  );
};

export default FavoriteRecipes;
