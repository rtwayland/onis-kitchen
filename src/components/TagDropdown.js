import React, { useState } from 'react';
import { Button, Dropdown } from 'semantic-ui-react';
import _ from 'lodash';

const createTagOptions = (masterList, itemList) => {
  const filtered = _.without(masterList, ...itemList);
  return filtered.map((tag) => ({ text: tag, value: tag }));
};
const TagDropdown = ({ masterTags, itemTags, onSaveTags }) => {
  const [displayedOptions, setDisplayedOptions] = useState(
    createTagOptions(masterTags, itemTags)
  );
  const [newTags, setNewTags] = useState([]);
  const [tagsForItem, setTagsForItem] = useState([]);
  const saveTags = () => {
    onSaveTags(tagsForItem, newTags);
  };
  return (
    <>
      <Dropdown
        placeholder="Tags"
        multiple
        search
        selection
        allowAdditions
        options={displayedOptions}
        onAddItem={(event, data) => {
          const { value } = data;
          setDisplayedOptions([...displayedOptions, { text: value, value }]);
          setNewTags([...newTags, value]);
        }}
        onChange={(event, data) => {
          const { value } = data;
          setTagsForItem(value);
        }}
      />
      <Button onClick={saveTags}>Save</Button>
      <Button onClick={() => onSaveTags()}>Cancel</Button>
    </>
  );
};

export default TagDropdown;
