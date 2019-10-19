import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Dimmer, Loader, Icon } from 'semantic-ui-react';
import { API } from 'aws-amplify';
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

  useEffect(() => {
    function loadRecipe() {
      const recipes = LocalStorage.get('recipesById');
      if (!recipes) return API.get('recipes', `/recipes/${match.params.id}`);
      return recipes[match.params.id];
    }

    async function loadUserRecipeData() {
      try {
        const data = await getUserRecipeData(match.params.id);
        if (typeof data.isFavorite === 'boolean') setFavorite(data.isFavorite);
      } catch (error) {
        await createUserRecipeData(match.params.id, {});
      }
    }

    async function onLoad() {
      try {
        const data = await loadRecipe();
        const images = await getRecipeImages(match.params.id);
        setRecipe({ ...data, images });
        return;
      } catch (e) {
        console.log(e);
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
      console.log(updateErr);
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
