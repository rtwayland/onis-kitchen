import React, { useState, useEffect } from 'react';
import { getFavoriteRecipes } from '../utils/api';
import RecipeList from '../components/RecipeList';
import DimmedLoader from '../components/DimmedLoader';

const FavoriteRecipes = () => {
  const [recipes, setRecipes] = useState(null);

  useEffect(() => {
    const loadRecipes = async () => {
      const favorites = await getFavoriteRecipes();
      setRecipes(favorites);
    };
    loadRecipes();
  }, []);

  return (
    <div>
      <h1 className="handwriting">Favorite Recipes by Category</h1>
      <DimmedLoader loadingText="Loading favorites" isActive={!recipes}>
        {recipes && recipes.length > 0 ? (
          <RecipeList recipes={recipes} />
        ) : (
          <div style={!recipes ? { display: 'none' } : {}}>
            Currently no favorites.
          </div>
        )}
      </DimmedLoader>
    </div>
  );
};

export default FavoriteRecipes;
