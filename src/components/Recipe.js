import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import {
  Button,
  Dimmer,
  Label,
  Loader,
  Icon,
  Dropdown,
} from 'semantic-ui-react';
import { API, Storage } from 'aws-amplify';
import {
  LocalStorage,
  getUserRecipeData,
  createUserRecipeData,
  updateUserRecipeData,
} from '../utils/api';

const createTagOptions = (tags) => {
  return tags.map((tag) => ({ text: tag, value: tag }));
};

const Recipe = ({ match }) => {
  const [hasUserRecipeData, setHasUserRecipeData] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isFavorite, setFavorite] = useState(false);
  const [tags, setTags] = useState([]);
  const [notes, setNotes] = useState([]);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTags, setNewTags] = useState([]);
  const userTags = ['one', 'two', 'three'];
  const [tagOptions, setTagOptions] = useState(createTagOptions(userTags));

  useEffect(() => {
    function loadRecipe() {
      const recipes = LocalStorage.get('recipesById');
      if (!recipes) return API.get('recipes', `/recipes/${match.params.id}`);
      return recipes[match.params.id];
    }

    async function loadUserRecipeData() {
      try {
        const data = await getUserRecipeData(match.params.id);
        setHasUserRecipeData(true);
        setFavorite(data.isFavorite);
        if (data.tags) setTags(data.tags);
        if (data.notes) setNotes(data.notes);
      } catch (error) {
        setHasUserRecipeData(false);
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
    if (hasUserRecipeData) {
      try {
        await updateUserRecipeData(match.params.id, data);
      } catch (updateErr) {
        console.log(updateErr);
      }
    } else {
      try {
        await createUserRecipeData(match.params.id, data);
      } catch (createErr) {
        console.log(createErr);
      }
    }
  };

  const handleTagDelete = (name) => {
    const filtered = tags.filter((tag) => tag !== name);
    setTags(filtered);
  };

  const saveNewTags = () => {
    setIsAddingTag(false);
    console.log(newTags);
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
        <Icon
          name="plus"
          size="large"
          color="blue"
          onClick={() => setIsAddingTag(true)}
          style={{ marginLeft: 5 }}
        />
      </HContainer>
      {isAddingTag && (
        <>
          <Dropdown
            placeholder="State"
            multiple
            search
            selection
            allowAdditions
            onAddItem={(event, data) => {
              const { value } = data;
              setTagOptions([...tagOptions, { text: value, value }]);
            }}
            onChange={(event, data) => {
              const { value } = data;
              setNewTags(value);
            }}
            options={tagOptions}
          />
          <Button onClick={saveNewTags}>Save</Button>
        </>
      )}
      {!isAddingTag &&
        newTags.length > 0 &&
        newTags.map((tag) => (
          <Label key={tag}>
            {tag}
            <Icon name="delete" onClick={() => handleTagDelete(tag)} />
          </Label>
        ))}
      <h2>Notes</h2>
      {notes.length > 0 && notes.map((note) => <p key={note}>{note}</p>)}
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
