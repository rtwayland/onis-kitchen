import { API, Auth } from 'aws-amplify';
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
  const recipes = result.map(({ id, name, category }) => ({
    id,
    name,
    category,
  }));
  return recipes;
};

export const getUserRecipeData = async (recipeId) => {
  try {
    const { username } = await Auth.currentUserInfo();
    const id = `${username}_${recipeId}`;
    const row = await API.get('userRecipeData', `/user-recipe-data/${id}`);
    return row;
  } catch (getError) {
    return {};
  }
};

export const createUserRecipeData = async (recipeId, data) => {
  try {
    const { username } = await Auth.currentUserInfo();
    const id = `${username}_${recipeId}`;
    const body = { ...data, id, userId: username, recipeId };
    await API.post('userRecipeData', '/user-recipe-data', {
      body,
    });
  } catch (createError) {
    console.log('CreateError', createError);
  }
};
export const updateUserRecipeData = async (recipeId, data) => {
  try {
    const { username } = await Auth.currentUserInfo();
    const id = `${username}_${recipeId}`;
    await API.put('userRecipeData', `/user-recipe-data/${id}`, {
      body: data,
    });
  } catch (updateError) {
    console.log('UpdateError', updateError);
  }
};

export const refreshRecipes = () => {
  localStorage.removeItem('rawRecipeData');
  localStorage.removeItem('recipesById');
  window.location.reload();
};
