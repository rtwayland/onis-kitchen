import React, { useState, useEffect } from 'react';
import { getRecipes, LocalStorage } from '../utils/api';
import RecipeList from '../components/RecipeList';

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([]);

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
      <h1>Recipes by Category</h1>
      <RecipeList recipes={recipes} />
    </div>
  );
};

export default AllRecipes;
