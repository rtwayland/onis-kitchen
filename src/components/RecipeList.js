import React from 'react';
import { Global } from '@emotion/core';
import { Accordion, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

const RecipeList = ({ recipes }) => {
  const formatRecipesForList = (array) => {
    const recipesByCategory = _.groupBy(array, 'category');
    const categories = Object.entries(recipesByCategory).map((section, i) => ({
      key: `recipe-list-${i + 1}-${section[0]}`,
      title: section[0],
      content: {
        content: (
          <List divided relaxed>
            {section[1].map((item) => (
              <List.Item key={item.id}>
                <List.Content>
                  <List.Header>
                    <Link to={`/recipes/${item.id}`}>{item.name}</Link>
                  </List.Header>
                </List.Content>
              </List.Item>
            ))}
          </List>
        ),
      },
    }));

    return categories;
  };

  return (
    <>
      <Global
        styles={{
          '.ui.accordion .title:not(.ui)': {
            fontSize: 25,
          },
          '.ui.accordion .active.content': {
            paddingLeft: '36px !important',
          },
        }}
      />
      <Accordion exclusive={false} panels={formatRecipesForList(recipes)} />
    </>
  );
};

export default RecipeList;
