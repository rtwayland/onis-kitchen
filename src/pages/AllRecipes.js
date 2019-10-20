import React, { useState, useEffect } from 'react';
import { getRecipes, LocalStorage } from '../utils/api';
import RecipeList from '../components/RecipeList';
import DimmedLoader from '../components/DimmedLoader';

const AllRecipes = () => {
  const [recipes, setRecipes] = useState(null);

  useEffect(() => {
    const loadRecipes = async () => {
      let allRecipes = LocalStorage.get('rawRecipeData');
      if (!allRecipes) allRecipes = await getRecipes();

      setRecipes(allRecipes);
    };
    loadRecipes();
  }, []);

  return (
    <div>
      <h1 className="handwriting">Recipes by Category</h1>
      <DimmedLoader loadingText="Loading recipes" isActive={!recipes}>
        <RecipeList recipes={recipes} />
      </DimmedLoader>
    </div>
  );
};

export default AllRecipes;
