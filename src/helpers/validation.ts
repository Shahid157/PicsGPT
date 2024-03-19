import AsyncStorage from '@react-native-async-storage/async-storage';

export function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function isUserLogin() {
  const data = await AsyncStorage.getItem('userData');
  if (data) {
    if (JSON.parse(data)?.session === null) {
      return false;
    } else {
      return true;
    }
  }
}

export function delay<T>(ms: number, value: T) {
  return new Promise<T>(resolve => setTimeout(resolve, ms, value));
}
