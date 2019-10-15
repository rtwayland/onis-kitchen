import { API } from 'aws-amplify';
import _ from 'lodash';

export const LocalStorage = {
  get: (name) => JSON.parse(localStorage.getItem(name)),
  set: (name, item) => localStorage.setItem(name, JSON.stringify(item)),
};

export const getRecipes = async () => {
  let recipes = LocalStorage.get('rawRecipeData');
  if (!recipes) {
    try {
      recipes = await API.get('recipes', '/recipes');
      LocalStorage.set('rawRecipeData', recipes);
    } catch (e) {
      return [];
    }
  }
  let recipesById = LocalStorage.get('recipesById');
  if (!recipesById) {
    recipesById = _.keyBy(recipes, 'id');
    LocalStorage.set('recipesById', recipesById);
  }

  return recipes;
};

export const searchRecipes = async (val) => {
  const result = await API.get('recipes', `/recipes/search/${val.trim()}`);
  const recipes = result.map(({ id, name }) => ({ id, name }));
  return recipes;
};

export const refreshRecipes = () => {
  localStorage.removeItem('rawRecipeData');
  localStorage.removeItem('recipesById');
  window.location.reload();
};
