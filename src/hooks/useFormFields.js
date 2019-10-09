import { useState } from 'react';

export default function useFormFields(initialState) {
  const [fields, setValues] = useState(initialState);
  const handleFieldChange = ({ target }) => {
    setValues({
      ...fields,
      [target.id]: target.value,
    });
  };

  return [fields, handleFieldChange];
}
