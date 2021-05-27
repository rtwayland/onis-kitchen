import React from 'react';
import { Global } from '@emotion/react';

const GlobalStyles = () => (
  <Global
    styles={{
      '.handwriting': {
        fontFamily: '"Homemade Apple", cursive',
      },
    }}
  />
);

export default GlobalStyles;
