import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

const DEVICE_ID_KEY = '@trustbank/device-id';

export const getOrCreateDeviceId = async (): Promise<string> => {
  if (Platform.OS === 'web') {
    let deviceId = window.localStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = 'dev-' + uuidv4().substring(0, 8);
      window.localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  } else {
    let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = 'dev-' + uuidv4().substring(0, 8);
      await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  }
};
