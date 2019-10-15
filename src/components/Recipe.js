import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Dimmer, Label, Loader, Icon } from 'semantic-ui-react';
import { API, Storage } from 'aws-amplify';
import { LocalStorage } from '../utils/api';

const Recipe = ({ match }) => {
  const [recipe, setRecipe] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isFavorite, setFavorite] = useState(false);
  const [tags, setTags] = useState(['fun', 'great', 'fantastic']);

  useEffect(() => {
    function loadRecipe() {
      const recipes = LocalStorage.get('recipesById');
      if (!recipes) return API.get('recipes', `/recipes/${match.params.id}`);
      return recipes[match.params.id];
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
  }, [match.params.id]);

  const handleFavorite = () => {
    setFavorite(!isFavorite);
  };

  const handleTagDelete = (name) => {
    const filtered = tags.filter((tag) => tag !== name);
    setTags(filtered);
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
      <HContainer>
        <h2>Tags:</h2>
        <Icon name="plus" size="large" color="blue" style={{ marginLeft: 5 }} />
      </HContainer>
      {tags.map((tag) => (
        <Label key={tag}>
          {tag}
          <Icon name="delete" onClick={() => handleTagDelete(tag)} />
        </Label>
      ))}
      <h2>Notes</h2>
      <p>{recipe.notes}</p>
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
    width: '95%',
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
      width: '100%',
      top: 0,
      left: 0,
    }
);

export default Recipe;
