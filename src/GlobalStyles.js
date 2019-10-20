import React from 'react';
import { Global } from '@emotion/core';

const GlobalStyles = () => {
  return (
    <Global
      styles={{
        '.handwriting': {
          fontFamily: '"Homemade Apple", cursive',
        },
      }}
    />
  );
};

export default GlobalStyles;
