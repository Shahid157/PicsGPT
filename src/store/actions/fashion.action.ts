import axios from 'axios';
import {
  FASHION_REQUESTED,
  UPADTE_SELECTED_BRAND,
  UPDATE_INFERENCES,
  UPDATE_FASHION_DATA,
  UPADTE_SELECTED_CELEBRITY,
  UPDATE_QUANTITY_OF_MEDIA_GENERATED,
  UPDATE_PROMPT,
  UPDATE_SLECTED_STYLES,
  HANDLE_USER_AGENT,
  FETCH_PROMPTS,
  FETCH_MODELS,
  FETCH_GARMENTS,
  FETCH_PRICING_METHODS,
  USER_MODELS,
  USER_CUSTOM_MODELS,
  USER_GENERATIONS,
  FETCH_BRANDS,
  FETCH_GARMENT_SIZES,
  FETCH_PHOTO_STYLES,
} from '../types/fashion.types';

import {useSelector} from 'react-redux';

import {
  fetchPhotoStylesWithFilter,
  fetchPhotoStyles,
} from '../../api/fashion/fetch-photo-styles';
import {url} from '../../constants/linkingUrls';

export /**
 * this action will update the selected celerbity
 *
 * @param {*} [selectedCelebrity=null]
 */
const updateSelectedCelebrity =
  (selectedCelebrity = null) =>
  (dispatch: any) => {
    dispatch({
      type: UPADTE_SELECTED_CELEBRITY,
      payload: {
        selectedCelebrity,
      },
    });
  };

export /**
 * this action will update the inferences or result
 *
 * @param {*} [inferences=[]]
 */
const updateInferences =
  (inferences = []) =>
  (dispatch: any) => {
    dispatch({
      type: UPDATE_INFERENCES,
      payload: {
        inferences,
      },
    });
  };

export /**
 * this action will update the selected brand
 *
 * @param {*} [selectedBrand=null]
 */
const updateBrandCloth =
  (selectedBrand = null) =>
  (dispatch: any) => {
    dispatch({
      type: UPADTE_SELECTED_BRAND,
      payload: {
        selectedBrand,
      },
    });
  };

export /**
 * this action will update the selected image locatiion
 *
 * @param {*} [selectedImageLocation=null]
 */
const updateSelectedImageLocation =
  (selectedImageLocation = null) =>
  (dispatch: any) => {
    dispatch({
      type: UPADTE_SELECTED_CELEBRITY,
      payload: {
        selectedImageLocation,
      },
    });
  };

export /**
 * this action will update the selected prompt
 *
 * @param {string} [prompt='']
 */
const updatePrompt =
  (prompt = '') =>
  (dispatch: any) => {
    dispatch({
      type: UPDATE_PROMPT,
      payload: {
        prompt,
      },
    });
  };

export /**
 * this action will update the quantity of media generated
 *
 * @param {number} [quantityOfMediaGenerated=6]
 */
const updateQuantityOfMediaGenerated =
  (quantityOfMediaGenerated = 6) =>
  (dispatch: any) => {
    dispatch({
      type: UPDATE_QUANTITY_OF_MEDIA_GENERATED,
      payload: {
        quantityOfMediaGenerated,
      },
    });
  };

export /**
 * this action will update the selected styles
 *
 * @param {*} [selectedStyles={}]
 */
const updateSelectedStyle =
  (selectedStyles = {}) =>
  (dispatch: any) => {
    dispatch({
      type: UPDATE_SLECTED_STYLES,
      payload: {
        selectedStyles,
      },
    });
  };

export /**
 * this action will update the loading state
 *
 * @param {boolean} [loading=false]
 */
const updateLoadingLayer =
  (loading = false) =>
  (dispatch: any) => {
    dispatch({
      type: FASHION_REQUESTED,
      payload: {
        loading,
      },
    });
  };

export /**
 * this action will update the all the fashion details
 *
 * @param {*} [data={}]
 */
const updateAllFashionDetails =
  (data = {}) =>
  (dispatch: any) => {
    dispatch({
      type: UPDATE_FASHION_DATA,
      payload: data,
    });
  };

export /**
 * this action will update the login information
 *
 * @param {*} [loginInfo={}]
 */
const updateLoginInfo =
  (loginInfo = {}) =>
  (dispatch: any) => {
    dispatch({
      type: UPADTE_SELECTED_CELEBRITY,
      payload: {
        loginInfo,
      },
    });
  };

/**
 * API: this will fetch the current login session that is required for inference / training
 *
 * @export
 * @returns {*}
 */
export async function postData() {
  const resp = await fetch('/src/api/fashion/login', {
    method: 'POST',
    body: JSON.stringify({
      user: 'u_db_mobile',
      pass: 'AeVeiwez',
    }),
  });
  const res = await resp.json();
  return res;
}

export /**
 * API: endpoint to create collection by passing the selected images cdn's
 *
 * @param {string} [value='']
 * @param {*} [collection=[]]
 * @param {string} [string='']
 * @param {string} [userAgent='']
 * @returns {*}
 */
const imageCreateCollection = async (
  value = '',
  collection = [],
  string = '',
  userAgent = '',
  collectionDetails,
  type = 'garment',
  user_id = null,
  garment_type = null,
  payment_id = null,
  isInsert,
) => {
  const resp = await fetch('/src/api/fashion/gpucollection', {
    method: 'POST',
    body: JSON.stringify({
      sess_id: value,
      data: collection,
      query: string,
      userAgent: userAgent,
      ...(user_id && {user_id}),
      details: collectionDetails,
      type: type,
      garment_type: garment_type,
      payment_id,
      isInsert,
    }),
  });
  const res = await resp.json();
  return res;
};

export /**
 * API: endpoint to train the collection, this will return a tracking url that we will call to get the progress and the status
 *
 * @param {*} [collectionId=null]
 * @param {*} [sessionId=null]
 * @param {*} [fashion_collection_id=null]
 * @param {string} [garment_type='']
 * @param {string} [payment_id='']
 * @param {number} [priority=1]
 * @param {*} [user_id=null]
 * @param {string} [userAgent='']
 * @returns {*}
 */
const trainCollection = async (
  collectionId = null,
  sessionId = null,
  fashion_collection_id = null,
  garment_type = [],
  payment_id = '',
  priority = 1,
  user_id = null,
  userAgent = '',
) => {
  const resp = await fetch('/src/api/fashion/traincollection', {
    method: 'POST',
    body: JSON.stringify({
      sess_id: sessionId,
      collection: collectionId,
      fashion_collection_id,
      garment_type: garment_type || 'jacket',
      ...(payment_id &&
        payment_id !== 'null' && {payment_id: encodeURI(payment_id)}),
      priority,
      user_id: encodeURI(user_id),
      userAgent: userAgent,
    }),
  });
  const res = await resp.json();
  return res;
};

export /**
 * API: this tracking url is use to fetch the details by passing the endpoint of the training or inference url. for inference we will add watermark in this api when we got files.
 *
 * @param {string} [tracking_url='']
 * @returns {*}
 */
const trackingTrainingCollection = async (tracking_url = '') => {
  const resp = await fetch('/src/api/fashion/tracking', {
    method: 'POST',
    body: JSON.stringify({
      tracking_url: tracking_url,
    }),
  });
  const res = await resp.json();
  return res;
};

export /**
 * API: this is for getting the results by passing the required etails
 *
 * @param {*} [sessionId=null]
 * @param {*} [collectionId=null]
 * @param {string} [prompt='']
 * @param {number} [priority=1]
 * @param {*} [user=null]
 * @param {string} [userAgent='']
 * @param {string} [negative_prompt='']
 * @returns {*}
 */
const inferCollection = async (
  sessionId = null,
  collectionId = null,
  prompt = '',
  priority = 1,
  user = null,
  userAgent = '',
  negative_prompt = '',
  email = null,
  notify_data = null,
  query = null,
) => {
  const resp = await fetch('/src/api/fashion/infercollection', {
    method: 'POST',
    body: JSON.stringify({
      sess_id: sessionId,
      collection: collectionId,
      data: prompt,
      priority,
      ...(negative_prompt && {negative_prompt}),
      ...(user && {user: encodeURI(user)}),
      ...(user && {email: email}),
      ...(user && {notify_data: notify_data}),
      userAgent: userAgent,
      query: query,
    }),
  });
  const res = await resp.json();
  return res;
};

export /**
 * this will update the user agent in the redux state.
 *
 * @param {string} [userAgent='']
 */
const handleUserAgent =
  (userAgent = '') =>
  (dispatch: any) => {
    dispatch({
      type: HANDLE_USER_AGENT,
      payload: {
        userAgent,
      },
    });
  };

export /**
 * API: endpoint to create collection by passing the selected images cdn's
 *
 * @param {*} [data=[]]
 * @param {string} [collection_id='']
 * @returns {*}
 */
const save_generation = async (
  data,
  training_details,
  user_id = null,
  inference_id,
  payment_id,
  generate_id,
  usedItems,
) => {
  const resp = await fetch('/src/api/fashion/save-user-generation', {
    method: 'POST',
    body: JSON.stringify({
      data: data,
      user_id: user_id,
      collection_id: training_details,
      inference_id,
      payment_id: payment_id,
      generate_id: generate_id,
      usedItems,
    }),
  });
  const res = await resp.json();
  return res;
};

export const updateCredit = async (
  user_id,
  payment_id,
  addCredit = 1,
  type = 'add',
) => {
  const resp = await fetch('/src/api/fashion/update_Credits', {
    method: 'POST',
    body: JSON.stringify({
      user_id: user_id,
      payment_id: payment_id,
      addCredit: addCredit,
      type: type,
    }),
  });
  const res = await resp.json();
  return res;
};

export /**
 * this method is used to get the CDN from the image buffer/formData
 * @param {*} file
 * @returns {*}
 */

const uploadImageHandler = async (file, onProgressCallback) => {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    type: file.type,
    name: file.fileName,
  });
  formData.append('name', file.fileName);

  try {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://testing.styley.ai/api/fashion/uploadimage');
    xhr.withCredentials = true;

    xhr.upload.addEventListener('progress', event => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        onProgressCallback(percentCompleted);
      }
    });

    const response = await new Promise((resolve, reject) => {
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.responseText);
        } else {
          reject(`HTTP error! Status: ${xhr.status}`);
        }
      };

      xhr.onerror = function () {
        reject('Network error');
      };

      xhr.send(formData);
    });

    const result = JSON.parse(response);
    return result;
  } catch (error) {
    return error;
  }
};

///****/ API gpuCollection to get the person_id for supabase modals /*****///

export const gpuCollectionAPI = async (
  session: string,
  paymentId: string,
  gender: string,
  imageurls: any,
  name: string,
  user_id: string,
) => {
  try {
    const resp = await fetch(
      'https://testing.styley.ai/api/fashion/gpucollection',
      {
        method: 'POST',
        body: JSON.stringify({
          sess_id: '34eebfd8-855f-11ee-9af4-30d042e69440',
          data: imageurls,
          user_id: user_id,
          query: `&key=${gender}&description=${name}`,
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
          details: {
            url: imageurls[0],
            '3d-url': imageurls[0],
            name: '',
            full_name: name,
            id: 'selected-user',
            collection: imageurls,
            description: '',
            gender: gender,
            garment_type: '',
            product_url: '',
          },
          type: 'model',
          garment_type: null,
          payment_id: paymentId,
          isInsert: true,
        }),
      },
    );
    const res = JSON.parse(JSON.stringify(resp));
    return res;
  } catch (error) {
    return error;
  }
};

export const fetchPrompts = () => async (dispatch: any) => {
  const res = await axios.request({
    method: 'POST',
    url: '/src/api/fashion/fetch-prompts',
    withCredentials: true,
  });
  dispatch({
    type: FETCH_PROMPTS,
    payload: {
      prompts: res.data || [],
    },
  });
};
export const fetchModels = () => async (dispatch: any) => {
  const res = await axios.request({
    method: 'POST',
    url: '/src/api/fashion/fetch-models',
    withCredentials: true,
  });
  dispatch({
    type: FETCH_MODELS,
    payload: {
      models: res.data.free || [],
      celebs: res.data.models || [],
    },
  });
};

export const user_collections_api = async (user_id: string) => {
  try {
    const res = await fetch(
      'https://testing.styley.ai/api/fashion/fetch-custom-modals',
      {
        method: 'POST',
        body: JSON.stringify({
          id: user_id,
        }),
      },
    );
    const resp = await res.json();
    return resp;
  } catch (err) {
    return err;
  }
};

export const user_models = user_id => async (dispatch: any) => {
  const data = await user_collections_api(user_id);
  dispatch({
    type: USER_MODELS,
    payload: {
      user_collection: data || [],
    },
  });
};
export const fetchPricingMethods = () => async (dispatch: any) => {
  const res = await axios.request({
    method: 'POST',
    url: '/src/api/fashion/fetch-pricing',
    withCredentials: true,
  });
  dispatch({
    type: FETCH_PRICING_METHODS,
    payload: {
      pricingMethods: res.data.pricing || [],
      pricingMethods_homeAi: res.data.home_ai || [],
    },
  });
};

export const fetchGarments = filters => async (dispatch: any) => {
  const res = await axios.request({
    method: 'POST',
    url: '/src/api/fashion/fetch-garments',
    withCredentials: true,
    data: {
      filters,
    },
  });
  dispatch({
    type: FETCH_GARMENTS,
    payload: {
      garments: res.data.standard || [],
      fantasyGarments: res.data.fantasy || [],
    },
  });
};

export const fetchFilteredGarments =
  (filters, setloading) => async (dispatch: any) => {
    setloading(true);
    const res = await axios.request({
      method: 'POST',
      url: '/src/api/fashion/fetch-filterd-garments',
      withCredentials: true,
      data: {
        filters,
      },
    });
    dispatch({
      type: FETCH_GARMENTS,
      payload: {
        garments: res.data || [],
      },
    });
    setloading(false);
  };

export /**
 * This will fetch the results of pre trained or ran in inferences
 * @returns {*}
 */
const fetchPreRanInferences = async (id, current, end, searchQuery = '') => {
  const response = await fetch(
    `/src/api/fashion/pre-ran-inferences?sess_id=${id}&current=${current}&end=${end}${searchQuery}`,
  );
  const res = await response.json();
  return res;
};

export const gpuReRun = async jobId => {
  const response = await fetch(`/api/fashion/rerun-job?job_id=${jobId}`);
  const res = await response.json();
  return res;
};

export const fetchPreRanInferences2 = async () => {
  const response = await fetch(`/src/api/fashion/featured-media`);
  const res = await response.json();
  return res;
};

export const styley_generation = async (
  user_id,
  person_id,
  garment_id,
  payment_id,
  generation_id,
  prompt,
  priority,
  prompt_type,
  mode = 'insert',
  private_coll,
  payment_amount = null,
  credit_status = 'deducted',
) => {
  const res = await axios.request({
    method: 'POST',
    url: '/api/fashion/styley_generation',
    data: {
      data: {
        user_id,
        person_id,
        garment_id,
        payment_id,
        generation_id,
        prompt,
        priority,
        prompt_type,
        mode,
        ...(mode === 'update' && {private: private_coll}),
        ...(payment_amount && {payment: payment_amount}),
        credit_status: credit_status,
      },
    },
  });
  return res.data;
};

export const fetch_user_generation = user_id => async (dispatch: any) => {
  const data = await axios.request({
    method: 'POST',
    url: '/src/src/api/fashion/fetch-user-generation',
    data: {
      id: user_id,
    },
  });
  const res = data.data;
  dispatch({
    type: USER_GENERATIONS,
    payload: {
      // user_generations: res.data || [],
      single_id_generations: res.singleId || [],
      inProgress: res.inProgress || [],
    },
  });
};
const BASE_URL = 'https://mediamagic.dev/';
export const fetch_user_collection = user_id => async (dispatch: any) => {
  const data = await axios.request({
    method: 'POST',
    url: '/src/api/fashion/fetch-custom-modals',
    data: {
      id: user_id,
    },
  });

  const res = data.data.data;

  dispatch({
    type: USER_CUSTOM_MODELS,
    payload: {
      user_custom_models: res || [],
    },
  });
};

export const fetchBrands = () => async (dispatch: any) => {
  const res = await axios
    .request({
      method: 'POST',
      url: 'https://testing.styley.ai/api/fashion' + '/fetch-brands',
    })
    .then(sucess => {
      console.log('Check Sucess', sucess);
      dispatch({
        type: FETCH_BRANDS,
        payload: {
          popularBrands: sucess.data || [],
        },
      });
    })
    .catch(error => {
      console.log('CheckError', JSON.stringify(error));
    });
};

export const fetch_garment_sizes = () => async (dispatch: any) => {
  const res = await axios.request({
    method: 'POST',
    url: '../../api/fashion/fetch-photo-styles.js',
  });
  dispatch({
    type: FETCH_GARMENT_SIZES,
    payload: {
      garmentSizes: res.data || [],
    },
  });
};

export const fetch_photo_styles =
  (filterName: string): any =>
  async (dispatch: any) => {
    try {
      let res = [];
      if (filterName && filterName !== 'All') {
        res = (await fetchPhotoStylesWithFilter(filterName)) || [];
      } else {
        res = (await fetchPhotoStyles()) || [];
      }

      const groupedData = res?.reduce((acc?: any, item?: any) => {
        if (!acc[item?.prompt_category]) {
          acc[item?.prompt_category] = [];
        }
        acc[item?.prompt_category].push(item);
        return acc;
      }, {});

      const photo_styles = Object.keys(groupedData).map((category, index) => ({
        indexId: index,
        type: category,
        data: groupedData[category],
      }));

      const photo_style_filters = [];
      photo_style_filters.push({name: 'All', isSelected: true});

      res.forEach((item: {type: string}) => {
        photo_style_filters.push({name: item.type, isSelected: false});
      });

      dispatch({
        type: FETCH_PHOTO_STYLES,
        payload: {
          photo_styles,
          photo_style_filters,
          loading_photo_styles: false,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
