import {PingPong} from '@pingpong_ai/typescript-sdk';

const pingpong = new PingPong('732f9fbb-438c-11ee-a621-7200d0d07471');

export const getInterior = async (image, mask, prompt = '', romm_class) => {
  const deployment = await pingpong.deployments.create({
    name: 'InteriorAI',
    model: '844218fa-c5d0-4cee-29bc-0b42d226ac8d',
    args: {
      Input_image: image,
      Selected_area: mask,
      Room_class: romm_class,
      Num_Samples: 4,
      Description:
        prompt ||
        'interior living room, Arm Sofa Upholstery. Material: Faux Leather Genuine Leather. Color: Orange. Frame Material: Wood. Pattern: Solid. Color Arm Type: Square Arm Leg Color: Black Nailhead Trim: Without Nailhead Trim Features Seat Style: Multiple Cushion Seat Seat Fill Material: Memory Foam Back Style: Pillow Back Removable Cushions: Unremovable Cushions Storage Included: Storage Not Included Features: Water Resistant Slipcovered: Without Slipco',
    },
    sync: true,
  });
  const filteredFiles = deployment.job.files.filter(file =>
    file.endsWith('.jpg'),
  );
  deployment.job.files = filteredFiles;
  return deployment;
};

export const useUpscalarAi = async (
  input_image,
  face_enhance = true,
  scale = 4,
  tile = 0,
  version = 'default',
) => {
  const deployment = await pingpong.deployments.create({
    name: 'UpScale AI',
    model: 'edd16466-930d-44a2-8939-8260876d3683',
    args: {
      face_enhance,
      input_image,
      scale,
      tile,
      version,
    },
    sync: true,
  });
  return deployment;
};

export const useObjectRemoval = async (Input_image, Selected_area) => {
  const deployment = await pingpong.deployments.create({
    name: 'Object Removal',
    model: '6bf5c668-4f5b-4987-ac25-20f79a9d8cee',
    args: {
      Input_image,
      Selected_area,
    },
    sync: true,
  });
  return deployment;
};

export const autoMask = async (image, prompt = '', room_type) => {
  const deployment = await pingpong.deployments.create({
    name: 'Home AI - (Auto)',
    model: '16c039ea-0f7e-44f0-bc4a-6e8df09634dc',
    args: {
      Input_image: image,
      Room_class: room_type,
      Num_Samples: 4,
      Description:
        prompt ||
        'interior living room, Arm Sofa Upholstery. Material: Faux Leather Genuine Leather. Color: Orange. Frame Material: Wood. Pattern: Solid. Color Arm Type: Square Arm Leg Color: Black Nailhead Trim: Without Nailhead Trim Features Seat Style: Multiple Cushion Seat Seat Fill Material: Memory Foam Back Style: Pillow Back Removable Cushions: Unremovable Cushions Storage Included: Storage Not Included Features: Water Resistant Slipcovered: Without Slipco',
    },
    sync: true,
  });
  const filteredFiles = deployment.job.files.filter(file =>
    file.endsWith('.jpg'),
  );
  deployment.job.files = filteredFiles;
  return deployment;
};

export const create_singleId = async (gender, model_images, prompt) => {
  const modelImages = model_images.join(', ');
  const deployment = await pingpong.deployments.create({
    name: 'AI Photo Maker XL',
    model: '33200c56-49cc-4e9c-b306-21821ba124d6',
    args: {
      Gender: gender,
      Model_images: modelImages || ' ',
      Prompt: prompt,
      Style: 'photo',
    },
    sync: false,
  });
  return deployment;
};

export const getStatusByJobId = async job_id => {
  const deployment = await pingpong.deployments.getJob(job_id);
  return deployment;
};
