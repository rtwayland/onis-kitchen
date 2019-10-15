import { Storage } from 'aws-amplify';

export async function s3Upload(file) {
  const filename = `${file.name}-${Date.now()}`;

  const stored = await Storage.put(filename, file, {
    contentType: file.type,
  });

  return stored.key;
}
