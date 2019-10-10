import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { API, Storage } from 'aws-amplify';

const Recipe = ({ match }) => {
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    function loadRecipe() {
      return API.get('recipes', `/recipes/${match.params.id}`);
    }

    async function onLoad() {
      try {
        const data = await loadRecipe();
        const { attachment } = data;
        let attachmentURL;
        if (attachment) {
          attachmentURL = await Storage.vault.get(attachment);
        }

        setRecipe({ ...data, attachmentURL });
      } catch (e) {
        console.log(e);
      }
    }

    onLoad();
  }, [match.params.id]);

  return recipe ? (
    <div>
      <h1>{recipe.name}</h1>
      <h2>{recipe.category}</h2>
      <ImgContainer>
        <img src={recipe.attachmentURL} alt="recipe" />
      </ImgContainer>
    </div>
  ) : (
    <div>Loading.</div>
  );
};

const ImgContainer = styled.div({
  width: '95%',
  margin: 'auto',
  '& img': {
    display: 'block',
    width: '100%',
  },
});

export default Recipe;
