import React, { useRef, useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { Button, Form, Message, List } from 'semantic-ui-react';
import { s3Upload } from '../utils/awsLib';

const NewRecipeForm = () => {
  const fileInput = useRef(null);
  const [files, setFiles] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
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
    const { files: inputFiles } = event.target;
    const fileArray = Object.values(inputFiles);
    setFiles(fileArray);
  };

  const reset = () => {
    setIsLoading(false);
    setName('');
    setCategory('');
    setFiles(null);
  };

  const createRecipe = (recipe) =>
    API.post('recipes', '/recipes', {
      body: recipe,
    });

  const handleImages = () => {
    const images = Promise.all(files.map((file) => s3Upload(file)));
    return images;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      try {
        const attachments = await handleImages();
        const recipe = {
          name,
          category,
          attachments,
        };

        await createRecipe(recipe);

        reset();
        setShowSuccessMessage(true);
      } catch (e) {
        setErrorMessage(e.message);
        setIsLoading(false);
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
        <br />
        <Button
          type="button"
          content="Choose File(s)"
          labelPosition="left"
          icon="file"
          onClick={() => fileInput.current.click()}
        />
        <List>
          {files &&
            files.map((file, i) => (
              <List.Item key={file.name}>
                {i}: {file.name}
              </List.Item>
            ))}
        </List>
        <input
          ref={fileInput}
          type="file"
          hidden
          onChange={handleFileChange}
          multiple
        />
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
