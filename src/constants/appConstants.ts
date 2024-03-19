import {MEDIAMAGIC_KEY} from '@env';

export const genderData = [
  {label: 'Male', value: '1'},
  {label: 'Female', value: '2'},
  {label: 'Other', value: '3'},
];

export const contentTypes = {
  media_magic_content: 'application/mediamagic.rest.v1+json',
};

export const photoAIConstants = {
  photoAIModelID: '33200c56-49cc-4e9c-b306-21821ba124d6',
  name: 'AI Photo Maker XL',
};

export const photoAIAPIHeaders = {
  Accept: '*/*',
  'Content-Type': contentTypes.media_magic_content,
  'X-MediaMagic-Key': MEDIAMAGIC_KEY,
};

export const dataModes = {
  update: 'update',
  insert: 'insert',
};

export const jobStatus = {
  pending: 'pending',
  running: 'running',
  training: 'training',
  complete: 'complete',
  failed: 'failed',
  docker_pulling: 'docker_pulling',
};

export const borderRadius = {
  none: 0,
  medium: 12,
  large: 13.74,
};
