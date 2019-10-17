import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Dimmer, Loader, Icon } from 'semantic-ui-react';
import { API, Storage } from 'aws-amplify';
import {
  LocalStorage,
  getUserRecipeData,
  createUserRecipeData,
  updateUserRecipeData,
} from '../utils/api';

const Recipe = ({ match }) => {
  const [recipe, setRecipe] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isFavorite, setFavorite] = useState(false);

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
        const { attachment } = data;
        let attachmentURL;
        if (attachment) {
          attachmentURL = await Storage.get(attachment);
        }
        setRecipe({ ...data, attachmentURL });
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

  const expandImage = () => setExpanded(!expanded);

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
      <ImgContainer expanded={expanded}>
        <Expand onClick={expandImage}>
          <Icon
            name={expanded ? 'window minimize' : 'expand'}
            size="huge"
            inverted
          />
        </Expand>
        <img src={recipe.attachmentURL} alt="recipe" />
      </ImgContainer>
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

const Expand = styled.div({
  position: 'absolute',
  top: 5,
  right: 5,
  cursor: 'pointer',
});

const ImgContainer = styled.div(
  {
    width: '100%',
    margin: '0 auto 20px',
    position: 'relative',
    '& img': {
      display: 'block',
      width: '100%',
    },
  },
  ({ expanded = false }) =>
    expanded && {
      position: 'absolute',
      top: 0,
      left: 0,
    }
);

export default Recipe;
