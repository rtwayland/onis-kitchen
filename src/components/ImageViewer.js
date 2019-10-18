import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Icon } from 'semantic-ui-react';

const ImageViewer = ({ image }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <ImgContainer key={image} expanded={expanded}>
      <Expand onClick={() => setExpanded(!expanded)}>
        <Icon
          name={expanded ? 'window minimize' : 'expand'}
          size="big"
          inverted
        />
      </Expand>
      <img src={image} alt="recipe" />
    </ImgContainer>
  );
};

const Expand = styled.div({
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 35,
  height: 35,
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
      zIndex: 1,
    }
);

export default ImageViewer;
