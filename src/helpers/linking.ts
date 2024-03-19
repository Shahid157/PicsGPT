import { Linking } from "react-native";

const getInitialURL = async () => {
  const url = await Linking.getInitialURL();
  return url === null ? url : parseSupabaseUrl(url);
};

const subscribe = (listener: (url: string) => void) => {
  const onReceiveURL = ({ url }: { url: string }) => listener(parseSupabaseUrl(url));
  const subscription = Linking.addEventListener('url', onReceiveURL);

  return () => {
    subscription.remove();
  };
};

const parseSupabaseUrl = (url: string) => (url.includes('#') ? url.replace('#', '?') : url);

export const STYLEY_PREFIX = 'styley://';

export const linking = {
  prefixes: [STYLEY_PREFIX],
  getInitialURL,
  subscribe,
};
