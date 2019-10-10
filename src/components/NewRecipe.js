import React, { useRef, useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { Button, Checkbox, Form, Message, TextArea } from 'semantic-ui-react';
import config from '../config';
import { s3Upload } from '../utils/awsLib';

const NewRecipeForm = () => {
  const fileInput = useRef(null);
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 1500);
  }, [showSuccessMessage]);

  const validateForm = () => name.length > 0 && category.length > 0;

  const handleFileChange = (event) => {
    const newFile = event.target.files[0];
    setFile(newFile);
    setFilename(newFile.name);
  };

  const reset = () => {
    setIsLoading(false);
    setName('');
    setCategory('');
    setNotes('');
    setIsFavorite(false);
    setFile(null);
    setFilename('');
  };

  const createRecipe = (recipe) => {
    return API.post('recipes', '/recipes', {
      body: recipe,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      if (file && file.size > config.MAX_ATTACHMENT_SIZE) {
        setErrorMessage(
          `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
            1000000} MB.`
        );
        setIsLoading(false);
      } else {
        setIsLoading(true);
        try {
          const attachment = file ? await s3Upload(file) : null;
          const recipe = {
            name,
            category,
            notes,
            isFavorite,
            attachment,
          };

          await createRecipe(recipe);

          reset();
          setShowSuccessMessage(true);
        } catch (e) {
          setErrorMessage(e.message);
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <div>
      <Form loading={isLoading} onSubmit={handleSubmit}>
        <Form.Input
          value={name}
          id="name"
          label="Recipe Name"
          placeholder="Name"
          onChange={({ target }) => setName(target.value)}
        />
        <Form.Input
          value={category}
          id="category"
          label="Recipe Category"
          placeholder="Category"
          onChange={({ target }) => setCategory(target.value)}
        />
        <TextArea
          value={notes}
          id="notes"
          label="Recipe Notes"
          placeholder="Notes"
          onChange={({ target }) => setNotes(target.value)}
        />
        <Checkbox
          label="Favorite"
          checked={isFavorite}
          onChange={() => setIsFavorite(!isFavorite)}
        />
        <br />
        <Button
          type="button"
          content="Choose File"
          labelPosition="left"
          icon="file"
          onClick={() => fileInput.current.click()}
        />
        <span>{filename}</span>
        <input ref={fileInput} type="file" hidden onChange={handleFileChange} />
        <br />
        <Button type="submit" disabled={!validateForm()}>
          Create
        </Button>
      </Form>
      {errorMessage && <Message error content={errorMessage} />}
      {showSuccessMessage && (
        <Message
          positive
          header="Success"
          content="The recipe was successfully uploaded."
        />
      )}
    </div>
  );
};

export default NewRecipeForm;
