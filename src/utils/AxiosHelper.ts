import Axios, {AxiosRequestConfig} from 'axios';
import {API_KEY} from '@env';

const BASE_URL = 'https://mediamagic.dev/';

Axios.defaults.baseURL = BASE_URL;

Axios.interceptors.request.use(async (config: any) => {
  const newConfig = {
    ...config,
  };
  newConfig.headers = {
    // authorization: `Bearer ${token}`,
    'x-mediamagic-key': '732f9fbb-438c-11ee-a621-7200d0d07471',
    ...config.headers,
  };
  newConfig.timeout = 30000;
  newConfig.baseURL = BASE_URL;
  return newConfig;
});

export const postRequestApi = (url: string, data?: unknown, headers?: any) => {
  return new Promise((resolve, reject) => {
    Axios.post(url, data, {
      ...headers,
      'Content-type': 'Application/json',
    })
      .then(response => {
        resolve(response?.data);
      })
      .catch(async error => {
        reject(error);
      });
  });
};

export const getRequestApi = (url: string, params = undefined) => {
  return new Promise((resolve, reject) => {
    Axios.get(params ? `${url}?${new URLSearchParams(params).toString()}` : url)
      .then(response => {
        resolve(response?.data);
      })
      .catch(async error => {
        reject(error);
      })
      .then(() => {});
  });
};
