import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

const DimmedLoader = ({
  children,
  loadingText,
  isActive = true,
  fillSpace = true,
}) => {
  return (
    <div>
      <Dimmer.Dimmable dimmed={isActive}>
        <Dimmer active={isActive} inverted>
          <Loader inverted content={loadingText} />
        </Dimmer>
        {isActive && fillSpace && (
          <div style={{ height: 100, width: '100%' }} />
        )}
        {children}
      </Dimmer.Dimmable>
    </div>
  );
};

export default DimmedLoader;
