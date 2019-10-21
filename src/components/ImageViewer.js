import React, { useState, useRef } from 'react';
import { Global } from '@emotion/core';
import styled from '@emotion/styled';
import { Icon } from 'semantic-ui-react';

const ImageViewer = ({ image, minimized, onExpand, onMinimize }) => {
  const viewer = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(null);

  const handleExpand = () => {
    const isExpanded = !expanded;
    if (!scrollPosition) {
      setScrollPosition(window.scrollY);
    }
    setExpanded(isExpanded);
    if (isExpanded) {
      window.scrollTo(0, 0);
      onExpand();
    } else {
      // TODO: This works for all images except the last one
      //  it seems the scroll happens before the last image has
      //  retaken its place, so the scroll brings the view to the
      //  second to last image.
      window.scrollTo(0, scrollPosition);
      setScrollPosition(null);
      onMinimize();
    }
  };

  return (
    <>
      <Global styles={{ 'i.icon': { margin: 0 } }} />
      <ImgContainer
        ref={viewer}
        key={image}
        expanded={expanded}
        minimized={minimized}
      >
        <Expand onClick={handleExpand}>
          <Icon name={expanded ? 'minus' : 'expand'} size="big" />
        </Expand>
        <img src={image} alt="recipe" />
      </ImgContainer>
    </>
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
  backgroundColor: 'rgba(220, 220, 220, 0.7)',
  borderRadius: 5,
  '&:hover': {
    width: 40,
    height: 40,
    top: 3,
    right: 3,
  },
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
    },
  ({ minimized }) =>
    minimized && {
      visibility: 'hidden',
      // display: 'none',
    }
);

export default ImageViewer;
