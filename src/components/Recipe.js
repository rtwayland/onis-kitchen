import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Dimmer, Message, Loader, Icon } from 'semantic-ui-react';
import { API } from 'aws-amplify';
import _ from 'lodash';
import {
  LocalStorage,
  getUserRecipeData,
  createUserRecipeData,
  updateUserRecipeData,
  getRecipeImages,
} from '../utils/api';
import ImageViewer from './ImageViewer';

const Recipe = ({ match }) => {
  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setFavorite] = useState(false);
  const [currentExpanded, setCurrentExpanded] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    function loadRecipe() {
      const recipes = LocalStorage.get('recipesById');
      if (!recipes) return API.get('recipes', `/recipes/${match.params.id}`);
      return recipes[match.params.id];
    }

    async function loadUserRecipeData() {
      try {
        const data = await getUserRecipeData(match.params.id);
        if (!_.isEmpty(data)) {
          if (typeof data.isFavorite === 'boolean')
            setFavorite(data.isFavorite);
        } else {
          await createUserRecipeData(match.params.id, {});
        }
      } catch (error) {
        setErrorMessage("Failed to load user's recipe data.");
      }
    }

    async function onLoad() {
      try {
        const data = await loadRecipe();
        const images = await getRecipeImages(match.params.id);
        setRecipe({ ...data, images });
        return;
      } catch (e) {
        setErrorMessage('Something went wrong loading the recipe data.');
      }
    }

    onLoad();
    loadUserRecipeData();
  }, [match.params.id]);

  const handleFavorite = async () => {
    const isFav = !isFavorite;
    setFavorite(isFav);
    const data = { isFavorite: isFav };
    try {
      await updateUserRecipeData(match.params.id, data);
    } catch (updateErr) {
      setErrorMessage('Something went wrong setting the favorite.');
    }
  };

  return recipe ? (
    <div>
      <HContainer>
        <h1>{recipe.name}</h1>
        <Category>— {recipe.category}</Category>
        <Icon
          name={isFavorite ? 'favorite' : 'star outline'}
          size="big"
          style={{ cursor: 'pointer' }}
          color={isFavorite ? 'yellow' : 'black'}
          onClick={handleFavorite}
        />
      </HContainer>
      {errorMessage && <Message error content={errorMessage} />}
      {recipe.images &&
        recipe.images.map((imageUrl) => (
          <ImageViewer
            key={imageUrl}
            image={imageUrl}
            minimized={currentExpanded && currentExpanded !== imageUrl}
            onExpand={() => setCurrentExpanded(imageUrl)}
            onMinimize={() => setCurrentExpanded('')}
          />
        ))}
    </div>
  ) : (
    <div>
      <Dimmer.Dimmable dimmed>
        <Dimmer active inverted>
          <Loader inverted content="Loading" />
        </Dimmer>
        <h1>Recipe</h1>
      </Dimmer.Dimmable>
    </div>
  );
};

const HContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 20,
  '& h1, & h2': {
    margin: 0,
  },
});

const Category = styled.div({
  fontSize: 25,
  margin: '0 15px 0 10px',
});

export default Recipe;
